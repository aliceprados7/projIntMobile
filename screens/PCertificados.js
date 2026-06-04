import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  Image
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from './context/AuthContext';


export default function PCertificados({navigation}) {

  const { usuario } = useAuth();
  const registro = usuario.numero_registro;
  console.log(registro)
  const [imagem, setImagem] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [certificados, setCertificados] = useState([]);
  useEffect(() => {
    listarCertificados();
  }, []);

  const salvarCertificado = async () => {

  if (!titulo || !imagem) {

    Alert.alert(
      'Preencha registro, título e selecione uma imagem'
    );

    return;
  }

  try {

    const formData = new FormData();

    formData.append(
      'usuario_id',
      registro
    );

    formData.append(
      'arquivo',
      {
        uri: imagem,
        name: 'certificado.jpg',
        type: 'image/jpeg',
      }
    );
    formData.append('titulo', titulo);

    const response = await fetch(
      'http://10.110.12.90:5000/api/certificados/upload',
      {
        method: 'POST',
        body: formData,
      }
    );

    const dados = await response.json();

    if (response.ok) {

      Alert.alert(
        dados.mensagem
      );

      await listarCertificados();

      setTitulo('');
      setImagem(null);

    } else {

      Alert.alert(
        dados.erro
      );

    }

  } catch (error) {

    console.log(error);

    Alert.alert(
      'Erro ao conectar com servidor'
    );

  }

    const novoCertificado = {
      id: Date.now(),
      titulo: titulo,
      imagem: imagem,
    };

    // salva na tela
    setCertificados([
      ...certificados,
      novoCertificado
    ]);

    // JSON para backend
    const jsonEnvio = {
      titulo: titulo,
      imagem: imagem,
    };

    console.log(jsonEnvio);

    /*
    BACKEND / DOCKER

    try {

      await fetch('http://SEU_IP:3000/certificados', {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(jsonEnvio),
      });

    } catch (error) {
      console.log(error);
    }
    */

    // limpa campos
    setTitulo('');
    setImagem(null);

  };
  const listarCertificados = async () => {
    

  if (!registro) {
    return;
  }

  try {

    const response = await fetch(
      `http://10.110.12.90:5000/api/certificados?usuario_id=${registro}`
    );

    const dados = await response.json();
    console.log(dados);

    if (response.ok) {

      setCertificados(dados);
      console.log(certificados)

    } else {

      Alert.alert(dados.erro);

    }

  } catch (error) {

    console.log(error);

  }
};

  const escolherImagem = async () => {

    const permissao =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissao.granted) {
      Alert.alert(
        'Permissão necessária para acessar a galeria'
      );
      return;
    }

    const resultado =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

    if (!resultado.canceled) {
      setImagem(resultado.assets[0].uri);
      console.log(resultado.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
      
        {/*Botão para entrar no perfil de cada um*/}
        <TouchableOpacity
        style={styles.bntNavigation}
        onPress={()=> navigation.navigate('PUser')}
        >
          <Text style={styles.txtBotao}>Meu Perfil</Text>
        </TouchableOpacity>
      
        {/*Botão Home */}
        <TouchableOpacity
        style={styles.bntNavigation}
        onPress={()=> navigation.navigate('PInicial')}
        >
          <Text style={styles.txtBotao}>Home</Text>
        </TouchableOpacity>
      
        {/*Botão para os certificados*/}
        <TouchableOpacity
        style={styles.bntNavigation}
        onPress={()=> navigation.navigate('PCertificados')}
        >
          <Text style={styles.txtBotao}>Certificados</Text>
        </TouchableOpacity>
      </View>
            <Text style={styles.saudacao}>
        Meus Certificados
      </Text>

      <Text style={styles.txtIntro}>
        Anexe seu certificado abaixo
      </Text>

      <TouchableOpacity
        style={styles.botaoImagem}
        onPress={escolherImagem}
      >
        <Text style={styles.txtBotaoImagem}>
          Anexar Imagem
        </Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Título do certificado"
        placeholderTextColor="#999"
        value={titulo}
        onChangeText={setTitulo}
      />

      <TouchableOpacity
        style={styles.botaoSalvar}
        onPress={salvarCertificado}
      >
        <Text style={styles.txtSalvar}>
          Salvar Certificado
        </Text>
      </TouchableOpacity>

      <FlatList
      data={certificados}
      keyExtractor={(item) => item.id.toString()}

      renderItem={({ item }) => (

        <View style={styles.cardCertificado}>

          <Text style={styles.tituloCertificado}>
            {item.nome_original}
          </Text>

          <TouchableOpacity
            style={styles.cardArquivo}
            onPress={() =>
              navigation.navigate(
                'VisualizarCertificado',
                { imagem: item.imagem }
              )
            }
          >

            <Text style={styles.iconArquivo}>
              📄
            </Text>

            <View>

              <Text style={styles.nomeArquivo}>
                {item.titulo}
              </Text>

              <Text style={styles.tipoArquivo}>
                PNG / JPG
              </Text>

            </View>

          </TouchableOpacity>

    </View>

  )}
/>
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
  bntNavigation:{
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  txtBotao: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},
saudacao:{
fontWeight: 'bold',
color: '#83a4f3',
fontSize: 40,
marginTop: 40,
alignItems: 'center',
paddingHorizontal: 20,
},
txtIntro:{
    color: '#ffffff',
    marginTop: 40,
    fontSize: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
},
  botaoImagem: {
    backgroundColor: '#83a4f3',
    marginTop: 40,
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  txtBotaoImagem: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  imagem: {
    width: 300,
    height: 200,
    marginTop: 30,
    borderRadius: 10,
    alignSelf: 'center',
  },
  input:{
  backgroundColor: '#fff',
  marginTop: 20,
  marginHorizontal: 20,
  borderRadius: 10,
  paddingHorizontal: 15,
  height: 50,
},

botaoSalvar:{
  backgroundColor: '#83a4f3',
  marginTop: 20,
  marginHorizontal: 20,
  padding: 15,
  borderRadius: 10,
  alignItems: 'center',
},

txtSalvar:{
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
},

cardCertificado:{
  backgroundColor: '#3a4047',
  marginTop: 30,
  marginHorizontal: 20,
  padding: 15,
  borderRadius: 12,
},

tituloCertificado:{
  color: '#83a4f3',
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 15,
},

imagemCertificado:{
  width: '100%',
  height: 200,
  borderRadius: 10,
},
cardArquivo:{
  backgroundColor: '#3a4047',
  marginTop: 20,
  marginHorizontal: 20,
  padding: 1,
  borderRadius: 12,
  flexDirection: 'row',
  alignItems: 'center',
},

iconArquivo:{
  fontSize: 20,
  marginRight: 15,
},

nomeArquivo:{
  color: '#fff',
  fontSize: 18,
  fontWeight: 'bold',
},

tipoArquivo:{
  color: '#999',
  marginTop: 5,
},

});