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
import { useAuth } from '../context/AuthContext';

export default function PUser({ navigation, route }) {

  const { usuario } = useAuth();
  const [cursosEmAndamento, setCursosEmAndamento] = useState([]);
  const [cursosFinalizados, setCursosFinalizados] = useState([]);


  useEffect(() => {
    cursos_em_andamento();
  }, [usuario]);

  async function cursos_em_andamento() {

    if (!usuario?.numero_registro) return;

    try {

      const response = await fetch(
        `http://10.110.12.90:5000/buscar_cursos_realizados/${usuario.numero_registro}`
      );

      if (response.ok) {

        const data = await response.json();

        const iniciados =
          data.filter(curso => curso.status === 'INICIADO');

        const finalizados =
          data.filter(curso => curso.status === 'FINALIZADO');

        setCursosEmAndamento(iniciados);
        setCursosFinalizados(finalizados);

      }

    } catch (error) {

      console.log(error);

      Alert.alert(
        'Erro',
        'Erro ao buscar cursos'
      );

    }
  }

  async function handleSalvarProgresso(id) {

    try {

      const response = await fetch(
        `http://10.110.12.90:5000/update_cursos_incritos/${usuario.numero_registro}/${id}`,
        {
          method: 'POST'
        }
      );

      const dados = await response.json();

      if (response.ok) {

        Alert.alert(
          'Sucesso',
          dados.mensagem
        );

        cursos_em_andamento();

      } else {

        Alert.alert(
          'Erro',
          dados.erro
        );

      }

    } catch (error) {

      console.log(error);

    }

  }



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
        {usuario?.name}
      </Text>


      {/* CURSOS */}
      <View style={styles.areaCursos}>

        <Text style={styles.tituloCursos}>
          Cursos em andamento
        </Text>


        {/* LISTA DE CURSOS */}
        <FlatList
          data={cursosEmAndamento}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (

            <View style={styles.cardCurso}>

              <Text style={styles.nomeCurso}>
                {item.titulo}
              </Text>

              {/* BOTÃO OK */}
              <TouchableOpacity
                style={styles.botaoSalvar}
                onPress={() => handleSalvarProgresso(item.id)}
              >
                <Text style={styles.txtSalvar}>
                  Finalizar curso
                </Text>
              </TouchableOpacity>

            </View>
          )}
        />

        <FlatList
          data={cursosFinalizados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (

            <View style={styles.cardCurso}>

              <Text style={styles.nomeCurso}>
                {item.titulo}
              </Text>

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