import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, Image, ScrollView, FlatList, SectionList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Searchbar } from 'react-native-paper';

export default function PInicial({ navigation }) {
    const [search, setSearch] = useState('');
    const [cursos, setCursos] = useState([]);

    const buscarCursos = async (texto) => {
        setSearch(texto);

        try {
            const response = await fetch(`https://sua-api.com/cursos?nome=${texto}`);
            const data = await response.json();
            setCursos(data);
            } catch (error) {
            console.log(error);
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

      <Text style={styles.saudacao}>Bem Vindo!</Text>
      <Text style={styles.txtIntro}>Pesquise o curso desejado da microsoft para realizar!</Text>

        {/*Barra de pesquisa*/}
        <Searchbar
            style={styles.Searchbar}
            placeholder="Buscar cursos..."
            onChangeText={(value) => buscarCursos(value)}
            value={search}
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
Searchbar:{
    marginHorizontal: 20,
    marginTop: 20,
}
});