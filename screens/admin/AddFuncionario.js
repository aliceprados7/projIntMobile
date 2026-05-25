import React, { useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddFuncionario({ navigation }) {

  const [nome, setNome] = useState('');
  const [registro, setRegistro] = useState('');
  const [cargo, setCargo] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [senha, setSenha] = useState('');

  const salvarFuncionario = async () => {

    if (
      !nome ||
      !registro ||
      !cargo ||
      !departamento ||
      !senha
    ) {

      Alert.alert(
        'Preencha todos os campos'
      );

      return;
    }
    //salva no json
    const jsonEnvio = {
      username: nome,
      password: senha,
      name: nome,
      numero_registro: registro,
      cargo: cargo,
      departamento: departamento,
    };

    console.log(jsonEnvio);

    try {

      const response = await fetch(
        'http://10.110.12.62:5000/cadastro',
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
          'Funcionário cadastrado com sucesso'
        );

        setNome('');
        setRegistro('');
        setCargo('');
        setDepartamento('');
        setSenha('');

      } else {

        Alert.alert(
          'Erro ao cadastrar'
        );

      }

    } catch (error) {

      console.log(error);

      Alert.alert(
        'Erro ao conectar com servidor'
      );

    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>

        {/* Botão visualizar funcionários */}
        <TouchableOpacity
          style={styles.bntNavigation}
          onPress={() => navigation.navigate('VisuFuncionario')}
        >
          <Text style={styles.txtBotao}>
            Funcionários
          </Text>
        </TouchableOpacity>

        {/* Botão adicionar */}
        <TouchableOpacity
          style={styles.bntNavigation}
          onPress={() => navigation.navigate('AddFuncionario')}
        >
          <Text style={styles.txtBotao}>
            Adicionar funcionários
          </Text>
        </TouchableOpacity>

      </View>

      <Text style={styles.txtAddFunc}>
        Adicionar funcionários
      </Text>

      {/* FORMULÁRIO */}
      <View style={styles.areaFormulario}>

        {/* Nome */}
        <Text style={styles.label}>
          Nome completo
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Digite o nome completo"
          placeholderTextColor="#999"
          value={nome}
          onChangeText={setNome}
        />

        {/* Registro */}
        <Text style={styles.label}>
          Número de registro
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Digite o número de registro"
          placeholderTextColor="#999"
          value={registro}
          onChangeText={setRegistro}
        />

        {/* Cargo */}
        <Text style={styles.label}>
          Cargo
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Digite o cargo"
          placeholderTextColor="#999"
          value={cargo}
          onChangeText={setCargo}
        />

        {/* Departamento */}
        <Text style={styles.label}>
          Departamento
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Digite o departamento"
          placeholderTextColor="#999"
          value={departamento}
          onChangeText={setDepartamento}
        />

        {/* Senha */}
        <Text style={styles.label}>
          Senha de acesso
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Digite a senha"
          placeholderTextColor="#999"
          secureTextEntry={true}
          value={senha}
          onChangeText={setSenha}
        />

        {/* BOTÃO */}
        <TouchableOpacity
          style={styles.botaoSalvar}
          onPress={salvarFuncionario}
        >
          <Text style={styles.txtSalvar}>
            Salvar Funcionário
          </Text>
        </TouchableOpacity>

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

  txtAddFunc: {
    fontWeight: 'bold',
    color: '#83a4f3',
    fontSize: 30,
    marginTop: 40,
    paddingHorizontal: 20,
  },

  areaFormulario: {
    marginTop: 30,
    paddingHorizontal: 20,
  },

  label: {
    color: '#83a4f3',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 15,
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
  },

  botaoSalvar: {
    backgroundColor: '#83a4f3',
    marginTop: 30,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },

  txtSalvar: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

});