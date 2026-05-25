import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, Image, ScrollView, FlatList, SectionList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VisuFuncionario({ navigation }) {
const [funcionarioAberto, setFuncionarioAberto] = useState(null);
const funcionarios = [

  {
    id: 1,
    nome: 'João Victor',
    cargo: 'Desenvolvedor Front-end',
    departamento: 'TI',
    registro: '2026001',

    cursos: [
      {
        nome: 'React Native',
        progresso: 75,
      },

      {
        nome: 'Docker',
        progresso: 40,
      },
    ],

    certificados: [
      'Certificado React Native.pdf',
      'Certificado Docker.png',
    ],
  },

  {
    id: 2,
    nome: 'Maria Silva',
    cargo: 'Analista de Dados',
    departamento: 'Dados',
    registro: '2026002',

    cursos: [
      {
        nome: 'Python',
        progresso: 90,
      },
    ],

    certificados: [
      'Certificado Python.pdf',
    ],
  },

];

return (
  <SafeAreaView style={styles.container}>

    {/* HEADER */}
    <View style={styles.header}>

      <TouchableOpacity
        style={styles.bntNavigation}
        onPress={() => navigation.navigate('VisuFuncionario')}
      >
        <Text style={styles.txtBotao}>
          Funcionários
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.bntNavigation}
        onPress={() => navigation.navigate('AddFuncionario')}
      >
        <Text style={styles.txtBotao}>
          Adicionar funcionários
        </Text>
      </TouchableOpacity>

    </View>

    <ScrollView>
        <Text style={styles.txtVisuFunc}>
        Painel de Funcionários
        </Text>

        <View style={styles.cardPrincipal}>

        <Text style={styles.tituloPainel}>
            Monitoramento de Equipe
        </Text>

        <Text style={styles.subtitulo}>
            Clique em um funcionário para expandir
        </Text>

        {funcionarios.map((funcionario) => {

            const aberto =
            funcionarioAberto === funcionario.id;

            return (

            <View
                key={funcionario.id}
                style={styles.cardFuncionario}
            >

                {/* TOPO */}
                <TouchableOpacity
                style={styles.topoFuncionario}
                onPress={() =>

                    setFuncionarioAberto(
                    aberto ? null : funcionario.id
                    )

                }
                >

                <View style={styles.avatar}>
                    <Text style={styles.txtAvatar}>
                    {funcionario.nome.charAt(0)}
                    </Text>
                </View>

                <View style={styles.infoTopo}>

                    <Text style={styles.nomeFuncionario}>
                    {funcionario.nome}
                    </Text>

                    <Text style={styles.cargoTopo}>
                    {funcionario.cargo}
                    </Text>

                </View>

                <Text style={styles.seta}>
                    {aberto ? '▲' : '▼'}
                </Text>

                </TouchableOpacity>

                {/* CONTEÚDO EXPANDIDO */}
                {aberto && (

                <View>

                    {/* DADOS */}
                    <View style={styles.areaDetalhes}>

                    <View style={styles.blocoDados}>

                        <Text style={styles.tituloBloco}>
                        Dados do Funcionário
                        </Text>

                        <View style={styles.itemInfo}>
                        <Text style={styles.label}>
                            Nome
                        </Text>

                        <Text style={styles.valor}>
                            {funcionario.nome}
                        </Text>
                        </View>

                        <View style={styles.itemInfo}>
                        <Text style={styles.label}>
                            Cargo
                        </Text>

                        <Text style={styles.valor}>
                            {funcionario.cargo}
                        </Text>
                        </View>

                        <View style={styles.itemInfo}>
                        <Text style={styles.label}>
                            Departamento
                        </Text>

                        <Text style={styles.valor}>
                            {funcionario.departamento}
                        </Text>
                        </View>

                        <View style={styles.itemInfo}>
                        <Text style={styles.label}>
                            Registro
                        </Text>

                        <Text style={styles.valor}>
                            {funcionario.registro}
                        </Text>
                        </View>

                    </View>

                    {/* CURSOS */}
                    <View style={styles.blocoCursos}>

                        <Text style={styles.tituloBloco}>
                        Cursos em andamento
                        </Text>

                        {funcionario.cursos.map((curso, index) => (

                        <View
                            key={index}
                            style={styles.cursoItem}
                        >

                            <View style={styles.cursoLinha}>

                            <Text style={styles.nomeCurso}>
                                {curso.nome}
                            </Text>

                            <Text style={styles.porcentagem}>
                                {curso.progresso}%
                            </Text>

                            </View>

                            <View style={styles.barraFundo}>

                            <View
                                style={[
                                styles.barraProgresso,
                                {
                                    width: `${curso.progresso}%`
                                }
                                ]}
                            />

                            </View>

                        </View>

                        ))}

                    </View>

                    </View>

                    {/* CERTIFICADOS */}
                    <View style={styles.areaCertificados}>

                    <Text style={styles.tituloBloco}>
                        Certificados anexados
                    </Text>

                    {funcionario.certificados.map(
                        (certificado, index) => (

                        <View
                            key={index}
                            style={styles.certificadoCard}
                        >

                            <Text style={styles.nomeCertificado}>
                            {certificado}
                            </Text>

                        </View>

                        )
                    )}

                    </View>

                </View>

                )}

            </View>

            );
        })}

        </View>

    </ScrollView>

  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282d33', // Seu fundo padrão
  },
  header: {
    height: 80,
    backgroundColor: '#83a4f3',
    flexDirection: 'row',         
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center', // Centraliza o conteúdo no meio da tela
    alignItems: 'center',
  },
  texto: {
    color: '#fff',
    fontSize: 18,
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
    fontSize: 30,
    marginTop: 40,
    paddingHorizontal: 20,
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
  marginTop: 30,
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
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 20,
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
  marginBottom: 20,
},

cursoLinha:{
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 8,
},

nomeCurso:{
  color: '#fff',
  fontWeight: 'bold',
},

porcentagem:{
  color: '#83a4f3',
  fontWeight: 'bold',
},

barraFundo:{
  height: 10,
  backgroundColor: '#555',
  borderRadius: 10,
},

barraProgresso:{
  height: 10,
  backgroundColor: '#83a4f3',
  borderRadius: 10,
},

areaCertificados:{
  marginTop: 30,
},

certificadoCard:{
  backgroundColor: '#3f454d',
  padding: 15,
  borderRadius: 10,
  marginBottom: 10,
},

nomeCertificado:{
  color: '#fff',
  fontWeight: 'bold',
},

});