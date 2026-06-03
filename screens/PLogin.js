import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './context/AuthContext';

export default function Login({ navigation}) {

  const { loginGlobal } = useAuth();
  const [senha, setSenha] = useState('');
  const [registro, setRegistro] = useState('');
  const [user, setUser] = useState([]); 

  const handleLogin = async () => {

    try {

      const response = await fetch(
        `http://10.110.12.42:5000/login/${registro}/${senha}`
      );

      const data = await response.json();

      if (data.status === 201) {

        console.log(data.user);

        const usuarioArray = data.user[0];

        setUser(usuarioArray);

        // SALVAR NO STORAGE
        loginGlobal(usuarioArray)

        // NAVEGAÇÃO
        navigation.navigate('PInicial', {
          user: usuarioArray,
        });

      } else {

        Alert.alert('Login inválido');

      }

    } catch (error) {

      console.log(error);

      Alert.alert('Erro ao conectar com o servidor');
    }
    
  };
  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.container}>

        <View style={styles.logo}>
          <Text style={styles.txtLogo}>SLA</Text>
        </View>
        <Text style={styles.titulo}>Bem vindo! Faça seu login:</Text>
        {/* txtinput para o número de registro do funcionário */}
        <Text style={styles.label}>Digite seu número de registro:</Text>
        <TextInput
        style={styles.input}
        placeholder="Número de registro"
        autoCapitalize="none"
        value={registro}
        onChangeText={setRegistro}
        keyboardType="numeric"
        />
        {/* txtinput para a senha do funcionário */}
        <Text style={styles.label}>Digite sua senha:</Text>
        <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry={true}
        />
        <TouchableOpacity
          style={styles.botao}
          onPress={handleLogin}
          activeOpacity={0.7}
        ><Text style={styles.txtBotao}>Entrar</Text></TouchableOpacity>
    </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 90,
    backgroundColor: '#282d33',
    
  },
  header:{
    position: 'absolute', // ADICIONADO: Tira o header do fluxo, impedindo que o container o jogue para o meio
    top: 0,
    height: 120,
    width: '100%',
    backgroundColor: '#83a4f3',
    flexDirection: 'row',
    alignItems: 'top',
    paddingHorizontal: 10
  },
  logo:{
    marginBottom: 20,       // Espaço entre a logo e o texto "Bem vindo"
    alignItems: 'center',   // Garante que o texto dentro dela esteja alinhado
    justifyContent: 'center',
    width: '100%',
  },
  txtLogo:{
    fontSize: 60,
    color: '#83a4f3',
    fontWeight: 'bold',
    textAlign: 'center', 
    marginTop: 100,
  },
    titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
    
  },
    label: {
    alignSelf: 'flex-start',
    marginLeft: '10%',
    fontSize: 15,
    marginBottom: 5,
    color: 'white',
  },
    input: {
    width: '80%',
    height: 45,
    borderWidth: 2,
    borderColor: '#fffcfc',
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: '#e6e0e0',
    marginBottom: 15,
  },
    botao: {
    backgroundColor: '#83a4f3',
    padding: 15, 
    borderRadius: 10
  },
  txtBotao: {
    color: '#FFF', 
    textAlign: 'center'
  },
});