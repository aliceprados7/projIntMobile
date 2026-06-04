import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VisuFuncionario({ navigation }) {
  const [funcionarioAberto, setFuncionarioAberto] = useState(null);
  const [funcionarios, setFuncionarios] = useState([]);
  
  // Estados para controle do funcionário expandido
  const [cursosEmAndamento, setCursosEmAndamento] = useState([]);
  const [cursosFinalizados, setCursosFinalizados] = useState([]);
  const [certificados, setCertificados] = useState([]);

  // Base URL do seu servidor Flask local
  const API_URL = "http://localhost:5000";

  // Busca a equipe ao montar o componente
  useEffect(() => {
    buscarEquipe();
  }, []);

  // Monitora quando o usuário expande ou muda de funcionário
  useEffect(() => {
    buscarCursosEProgresso();
    buscarCertificados();
  }, [funcionarioAberto]);

  async function buscarEquipe() {
    try {
      const response = await fetch(`${API_URL}/equipe`);
      if (response.ok) {
        const data = await response.json();
        const dadosTratados = Array.isArray(data[0]) ? data[0] : data;
        setFuncionarios(dadosTratados);
      } else {
        Alert.alert("Erro", "Erro na resposta do servidor ao buscar equipe.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Erro ao buscar equipe");
    }
  }

  async function buscarCursosEProgresso() {
    if (!funcionarioAberto) {
      setCursosEmAndamento([]);
      setCursosFinalizados([]);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/buscar_cursos_realizados/${funcionarioAberto}`);
      if (response.ok) {
        const data = await response.json();
        const dadosTratados = Array.isArray(data[0]) ? data[0] : data;

        // Filtra os iniciados
        const iniciados = dadosTratados.filter(curso => curso.status === "INICIADO");
        setCursosEmAndamento(iniciados);

        // Filtra os finalizados
        const finalizados = dadosTratados.filter(curso => curso.status === "FINALIZADO");
        setCursosFinalizados(finalizados);
      } else {
        console.error("Erro ao buscar os cursos do servidor");
        setCursosEmAndamento([]);
        setCursosFinalizados([]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Erro de conexão ao buscar cursos.");
    }
  }

  async function buscarCertificados() {
    if (!funcionarioAberto) {
      setCertificados([]);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/certificados?usuario_id=${funcionarioAberto}`);
      const dados = await response.json();

      if (response.ok) {
        // Garante que o estado seja um array estável
        setCertificados(Array.isArray(dados) ? dados : []);
      } else {
        setCertificados([]);
        console.log("Aviso: " + (dados.erro || 'Erro ao buscar certificados.'));
      }
    } catch (error) {
      console.error(error);
      setCertificados([]);
      Alert.alert("Erro", 'Erro de conexão com o servidor.');
    }
  }

const abrirCertificado = async (link) => {
  if (!link) {
    Alert.alert("Erro", "Link do certificado não encontrado.");
    return;
  }

  // CORREÇÃO: Substitui 'localhost' ou '127.0.0.1' pelo IP da sua máquina
  let linkCorrigido = link;
  if (link.includes("localhost")) {
    linkCorrigido = link.replace("localhost:5000", "10.110.12.90:5000");
  } else if (link.includes("127.0.0.1")) {
    linkCorrigido = link.replace("127.0.0.1:5000", "10.110.12.90:5000");
  }

  try {
    const supported = await Linking.canOpenURL(linkCorrigido);
    if (supported) {
      await Linking.openURL(linkCorrigido);
    } else {
      Alert.alert("Erro", "Não foi possível abrir o link do certificado.");
    }
  } catch (error) {
    console.error(error);
    Alert.alert("Erro", "Formato de link inválido ou inacessível.");
  }
};

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.bntNavigation}
          onPress={() => navigation.navigate('VisuFuncionario')}
        >
          <Text style={styles.txtBotao}>Funcionários</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bntNavigation}
          onPress={() => navigation.navigate('AddFuncionario')}
        >
          <Text style={styles.txtBotao}>Adicionar funcionários</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <Text style={styles.txtVisuFunc}>Painel de Funcionários</Text>

        <View style={styles.cardPrincipal}>
          <Text style={styles.tituloPainel}>Monitoramento de Equipe</Text>
          <Text style={styles.subtitulo}>Clique em um funcionário para expandir</Text>

          {funcionarios.length === 0 ? (
            <Text style={{ color: '#ccc', textAlign: 'center', marginVertical: 20 }}>Carregando equipe...</Text>
          ) : (
            funcionarios.map((funcionario, index) => {
              // Ajuste de segurança para a key principal vinda do banco de dados
              const idDoFuncionario = funcionario.numero_registro || funcionario.registro || `func-${index}`;
              const nomeFuncionario = funcionario.name || funcionario.nome || "Funcionário Sem Nome";
              const aberto = funcionarioAberto === idDoFuncionario;

              return (
                <View key={idDoFuncionario} style={[styles.cardFuncionario, { marginBottom: 15 }]}>
                  
                  {/* TOPO DO CARD (ACCORDION HEADER) */}
                  <TouchableOpacity
                    style={styles.topoFuncionario}
                    onPress={() => setFuncionarioAberto(aberto ? null : idDoFuncionario)}
                  >
                    <View style={styles.avatar}>
                      <Text style={styles.txtAvatar}>{nomeFuncionario.charAt(0)}</Text>
                    </View>

                    <View style={styles.infoTopo}>
                      <Text style={styles.nomeFuncionario}>{nomeFuncionario}</Text>
                      <Text style={styles.cargoTopo}>{funcionario.cargo || "Cargo não informado"}</Text>
                    </View>

                    <Text style={styles.seta}>{aberto ? '▲' : '▼'}</Text>
                  </TouchableOpacity>

                  {/* CONTEÚDO EXPANDIDO */}
                  {aberto && (
                    <View style={{ marginTop: 20 }}>
                      
                      {/* SEÇÃO 1: DADOS */}
                      <View style={styles.areaDetalhes}>
                        <View style={styles.blocoDados}>
                          <Text style={styles.tituloBloco}>Dados do Funcionário</Text>
                          
                          <View style={styles.itemInfo}>
                            <Text style={styles.label}>Departamento</Text>
                            <Text style={styles.valor}>{funcionario.departamento || "Não informado"}</Text>
                          </View>

                          <View style={styles.itemInfo}>
                            <Text style={styles.label}>Registro/ID</Text>
                            <Text style={styles.valor}>{idDoFuncionario}</Text>
                          </View>
                        </View>

                        {/* SEÇÃO 2: CURSOS EM ANDAMENTO */}
                        <View style={styles.blocoCursos}>
                          <Text style={styles.tituloBloco}>Cursos Iniciados</Text>
                          
                          {(!cursosEmAndamento || cursosEmAndamento.length === 0) ? (
                            <Text style={{ color: '#888', fontStyle: 'italic', fontSize: 13 }}>Nenhum curso iniciado.</Text>
                          ) : (
                            cursosEmAndamento.map((cea, idx) => (
                              <View key={cea.id || `andamento-${idx}`} style={styles.cursoItem}>
                                <Text style={styles.nomeCurso}>{cea.titulo}</Text>
                                <Text style={{ color: '#ccc', fontSize: 12, marginBottom: 4 }}>Duração: {cea.duracao} min</Text>
                                <TouchableOpacity onPress={() => abrirCertificado(cea.link)}>
                                  <Text style={{ color: '#83a4f3', textDecorationLine: 'underline', fontSize: 13 }}>Acessar Curso</Text>
                                </TouchableOpacity>
                              </View>
                            ))
                          )}
                        </View>
                      </View>

                      {/* SEÇÃO 3: CURSOS FINALIZADOS */}
                      <View style={{ marginTop: 20 }}>
                        <Text style={styles.tituloBloco}>Cursos Finalizados</Text>
                        {(!cursosFinalizados || cursosFinalizados.length === 0) ? (
                          <Text style={{ color: '#888', fontStyle: 'italic', fontSize: 13, marginBottom: 10 }}>Nenhum curso finalizado ainda.</Text>
                        ) : (
                          cursosFinalizados.map((cf, idx) => (
                            <View key={cf.id || `finalizado-${idx}`} style={[styles.itemInfo, { backgroundColor: '#25292e' }]}>
                              <Text style={[styles.nomeCurso, { color: '#b7eb8f' }]}>{cf.titulo}</Text>
                              <Text style={{ color: '#ccc', fontSize: 12 }}>Duração: {cf.duracao} min</Text>
                            </View>
                          ))
                        )}
                      </View>

                      {/* SEÇÃO 4: CERTIFICADOS */}
                      <View style={styles.areaCertificados}>
                        <Text style={styles.tituloBloco}>Certificados Anexados</Text>
                        
                        {(!certificados || certificados.length === 0) ? (
                          <Text style={{ color: '#aaa', textAlign: 'center', fontStyle: 'italic' }}>
                            Nenhum certificado carregado para este usuário.
                          </Text>
                        ) : (
                          certificados.map((cert, idx) => (
                            <View key={cert.id || `cert-${idx}`} style={styles.certificadoCard}>
                              <Text style={styles.nomeCertificado}>{cert.nome_original || cert.nome}</Text>
                              <Text style={{ color: '#ccc', fontSize: 12, marginBottom: 10 }}>
                                Data: {cert.data || new Date().toLocaleDateString('pt-BR')}
                              </Text>
                              <TouchableOpacity 
                                style={styles.btnVisualizarCertificado}
                                onPress={() => abrirCertificado(cert.url_download || cert.link)}
                              >
                                <Text style={styles.txtBtnCertificado}>Visualizar</Text>
                              </TouchableOpacity>
                            </View>
                          ))
                        )}
                      </View>

                    </View>
                  )}

                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282d33',
  },
  header: {
    height: 80,
    backgroundColor: '#83a4f3',
    flexDirection: 'row',         
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bntNavigation:{
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  txtBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  txtVisuFunc:{
    fontWeight: 'bold',
    color: '#83a4f3',
    fontSize: 34,
    marginTop: 40,
    paddingHorizontal: 20,
  },
  cardPrincipal:{
    marginTop: 30,
    marginHorizontal: 20,
    backgroundColor: '#3a4047',
    borderRadius: 15,
    padding: 20,
    marginBottom: 40,
  },
  tituloPainel:{
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitulo:{
    color: '#ccc',
    marginTop: 10,
    marginBottom: 25,
    fontSize: 16,
  },
  cardFuncionario:{
    backgroundColor: '#2f343a',
    borderWidth: 1,
    borderColor: '#83a4f3',
    borderRadius: 15,
    padding: 20,
  },
  topoFuncionario:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar:{
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#83a4f3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtAvatar:{
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  infoTopo:{
    marginLeft: 15,
    flex: 1,
  },
  nomeFuncionario:{
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  cargoTopo:{
    color: '#ccc',
    marginTop: 3,
  },
  seta:{
    color: '#83a4f3',
    fontSize: 20,
  },
  areaDetalhes:{
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  blocoDados:{
    width: '48%',
  },
  blocoCursos:{
    width: '48%',
  },
  tituloBloco:{
    color: '#83a4f3',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  itemInfo:{
    backgroundColor: '#3f454d',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  label:{
    color: '#83a4f3',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  valor:{
    color: '#fff',
  },
  cursoItem:{
    backgroundColor: '#3f454d',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  nomeCurso:{
    color: '#ffd591',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  areaCertificados:{
    marginTop: 20,
  },
  certificadoCard:{
    backgroundColor: '#3f454d',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  nomeCertificado:{
    color: '#85a5ff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  btnVisualizarCertificado: {
    borderWidth: 1,
    borderColor: '#83a4f3',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  txtBtnCertificado: {
    color: '#83a4f3',
    fontWeight: 'bold',
  }
});