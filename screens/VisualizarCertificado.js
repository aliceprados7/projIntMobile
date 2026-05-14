import React from 'react';

import {
  View,
  Image,
  StyleSheet,
} from 'react-native';

export default function VisualizarCertificado({ route }) {

  const { imagem } = route.params;

  return (

    <View style={styles.container}>

      <Image
        source={{ uri: imagem }}
        style={styles.imagem}
        resizeMode="contain"
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container:{
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },

  imagem:{
    width: '100%',
    height: '100%',
  },

});