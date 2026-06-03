import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [usuario, setUsuario] = useState(null);

  useEffect(() => {

    const carregarUsuario = async () => {

      try {

        const usuarioSalvo =
          await AsyncStorage.getItem('usuario_projeto');

        if (usuarioSalvo) {

          setUsuario(
            JSON.parse(usuarioSalvo)
          );

        }

      } catch (error) {

        console.log(error);

      }

    };

    carregarUsuario();

  }, []);

  const loginGlobal = async (dadosUsuario) => {

    try {

      await AsyncStorage.setItem(
        'usuario_projeto',
        JSON.stringify(dadosUsuario)
      );

      setUsuario(dadosUsuario);

    } catch (error) {

      console.log(error);

    }

  };

  const logoutGlobal = async () => {

    try {

      await AsyncStorage.removeItem(
        'usuario_projeto'
      );

      setUsuario(null);

    } catch (error) {

      console.log(error);

    }

  };

  const userRole = usuario?.cargo || 'user';

  return (
    <AuthContext.Provider
      value={{
        usuario,
        userRole,
        loginGlobal,
        logoutGlobal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);