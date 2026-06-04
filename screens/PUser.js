import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from './context/AuthContext';

export default function PUser({ navigation }) {

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

        setCursosEmAndamento(
          data.filter(curso => curso.status === 'INICIADO')
        );

        setCursosFinalizados(
          data.filter(curso => curso.status === 'FINALIZADO')
        );

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

        await cursos_em_andamento();

        navigation.navigate('PCertificados');

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

  const todosCursos = [
    ...cursosEmAndamento,
    ...cursosFinalizados
  ];

  return (

    <SafeAreaView style={styles.container}>

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

      <Text style={styles.nomeFunc}>
        {usuario?.name}
      </Text>

      <View style={styles.areaCursos}>

        <Text style={styles.tituloCursos}>
          Meus Cursos
        </Text>

        <FlatList
          data={todosCursos}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={({ item }) => (

            <View style={styles.cardCurso}>

              <Text style={styles.nomeCurso}>
                {item.titulo}
              </Text>

              <Text
                style={{
                  color:
                    item.status === 'FINALIZADO'
                      ? '#4CAF50'
                      : '#FFC107',
                  fontWeight: 'bold',
                  marginTop: 8,
                  fontSize: 16,
                }}
              >
                {item.status}
              </Text>

              {item.status === 'INICIADO' && (

                <TouchableOpacity
                  style={styles.botaoSalvar}
                  onPress={() => handleSalvarProgresso(item.id)}
                >
                  <Text style={styles.txtSalvar}>
                    Finalizar curso
                  </Text>
                </TouchableOpacity>

              )}

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
    marginTop: 30,
    paddingHorizontal: 20,
  },

  areaCursos: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
  },

  tituloCursos: {
    color: '#83a4f3',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  cardCurso: {
    backgroundColor: '#3a4047',
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
  },

  nomeCurso: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  botaoSalvar: {
    backgroundColor: '#83a4f3',
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  txtSalvar: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

});