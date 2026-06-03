import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';

export default function PUser({ navigation, route }) {

  const [registro, setRegistro] = useState('');
  const [novoCurso, setNovoCurso] = useState('');
  const [mostrarInput, setMostrarInput] = useState(false);

  const [cursos, setCursos] = useState([]);

  //Adicionar novo curso
  const adicionarCurso = () => {

    if (novoCurso.trim() === '') {

      Alert.alert('Digite um nome para o curso');
      return;

    }

    const novo = {
      id: Date.now(),
      nome: novoCurso,
      progresso: 0,
    };

    setCursos([...cursos, novo]);

    setNovoCurso('');
    setMostrarInput(false);
  };

  //Atualizar progresso
  const atualizarProgresso = async (curso) => {

    if (!registro) {

      Alert.alert(
        'Digite o número de registro'
      );

      return;
    }

    const jsonEnvio = {
      numero_registro: registro,
      idCurso: curso.id,
      nomeCurso: curso.nome,
      porcentagem: curso.progresso,
    };

    console.log(jsonEnvio);

    try {

      const response = await fetch(
        'http://10.110.12.90:5000/progresso',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(jsonEnvio),
        }
      );

      const data = await response.json();

      console.log(data);

      if (response.ok) {

        Alert.alert(
          'Progresso atualizado com sucesso'
        );

      } else {

        Alert.alert(
          'Erro ao atualizar progresso'
        );

      }

    } catch (error) {

      console.log(error);

      Alert.alert(
        'Erro ao conectar com servidor'
      );

    }
  };
    useEffect(() => {
    if (route.params?.curso) {

      const novo = {
        id: Date.now(),
        nome: route.params.curso,
        progresso: 0,
      };

      setCursos((cursosAtuais) => {

        const existe = cursosAtuais.some(
          curso => curso.nome === route.params.curso
        );

        if (existe) return cursosAtuais;

        return [...cursosAtuais, novo];
      });

    }
  }, [route.params]);

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>

        <TouchableOpacity
          style={styles.bntNavigation}
          onPress={() => navigation.navigate('PUser')}
        >
          <Text style={styles.txtBotao}>
            Meu Perfil
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bntNavigation}
          onPress={() => navigation.navigate('PInicial')}
        >
          <Text style={styles.txtBotao}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bntNavigation}
          onPress={() => navigation.navigate('PCertificados')}
        >
          <Text style={styles.txtBotao}>
            Certificados
          </Text>
        </TouchableOpacity>

      </View>

      {/* DADOS FUNCIONÁRIO */}
      <Text style={styles.nomeFunc}>
        Funcionário
      </Text>

      <Text style={styles.nRegistro}>
        Número de Registro
      </Text>

      {/* INPUT REGISTRO */}
      <TextInput
        style={styles.input}
        placeholder="Digite o número de registro"
        placeholderTextColor="#999"
        value={registro}
        onChangeText={setRegistro}
      />

      {/* CURSOS */}
      <View style={styles.areaCursos}>

        <Text style={styles.tituloCursos}>
          Cursos em andamento
        </Text>

        {/* BOTÃO ADICIONAR */}
        <TouchableOpacity
          style={styles.botaoAdicionar}
          onPress={() => setMostrarInput(true)}
        >
          <Text style={styles.txtAdicionar}>
            + Adicionar Curso
          </Text>
        </TouchableOpacity>

        {/* INPUT NOVO CURSO */}
        {mostrarInput && (

          <View style={styles.areaNovoCurso}>

            <TextInput
              style={styles.input}
              placeholder="Nome do curso"
              placeholderTextColor="#999"
              value={novoCurso}
              onChangeText={setNovoCurso}
            />

            <TouchableOpacity
              style={styles.botaoOk}
              onPress={adicionarCurso}
            >
              <Text style={styles.txtOk}>
                OK
              </Text>
            </TouchableOpacity>

          </View>
        )}

        {/* LISTA DE CURSOS */}
        <FlatList
          data={cursos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (

            <View style={styles.cardCurso}>

              <Text style={styles.nomeCurso}>
                {item.nome}
              </Text>

              <Text style={styles.progresso}>
                {item.progresso}%
              </Text>

              {/* SLIDER */}
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={item.progresso}
                minimumTrackTintColor="#83a4f3"
                maximumTrackTintColor="#999"
                thumbTintColor="#83a4f3"

                onValueChange={(valor) => {

                  setCursos((cursosAtuais) =>
                    cursosAtuais.map((curso) =>
                      curso.id === item.id
                        ? { ...curso, progresso: valor }
                        : curso
                    )
                  );

                }}
              />

              {/* BOTÃO OK */}
              <TouchableOpacity
                style={styles.botaoSalvar}
                onPress={() => atualizarProgresso(item)}
              >
                <Text style={styles.txtSalvar}>
                  OK
                </Text>
              </TouchableOpacity>

            </View>
          )}
        />

      </View>

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

  bntNavigation: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },

  txtBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  nomeFunc: {
    fontWeight: 'bold',
    color: '#83a4f3',
    fontSize: 30,
    marginTop: 40,
    paddingHorizontal: 20,
  },

  nRegistro: {
    color: '#fff',
    fontSize: 18,
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },

  areaCursos: {
    marginTop: 40,
    paddingHorizontal: 20,
  },

  tituloCursos: {
    color: '#83a4f3',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  botaoAdicionar: {
    backgroundColor: '#83a4f3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  txtAdicionar: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  areaNovoCurso: {
    marginTop: 20,
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    marginHorizontal: 20,
  },

  botaoOk: {
    backgroundColor: '#83a4f3',
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  txtOk: {
    color: '#fff',
    fontWeight: 'bold',
  },

  cardCurso: {
    backgroundColor: '#3a4047',
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
  },

  nomeCurso: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  progresso: {
    color: '#83a4f3',
    fontSize: 18,
    marginTop: 10,
  },

  botaoSalvar: {
    backgroundColor: '#83a4f3',
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  txtSalvar: {
    color: '#fff',
    fontWeight: 'bold',
  },

});