import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Login from './screens/PLogin';
import PInicial from './screens/PInicial'
import PUser from './screens/PUser';
import PCertificados from './screens/PCertificados';
import VisualizarCertificado from './screens/VisualizarCertificado';
import AddFuncionario from './screens/admin/AddFuncionario';
import VisuFuncionario from './screens/admin/VisuFuncionario';

const Stack = createNativeStackNavigator();

export default function App() {
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AddFuncionario">

        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerShown: false }}
        />

         <Stack.Screen 
          name="PInicial" 
          component={PInicial} 
          options={{ headerShown: false }}
        />

        <Stack.Screen 
          name="PUser" 
          component={PUser} 
          options={{ headerShown: false }}
        />

        <Stack.Screen 
          name="PCertificados" 
          component={PCertificados} 
          options={{ headerShown: false }}
        /> 

        <Stack.Screen
          name="VisualizarCertificado"
          component={VisualizarCertificado}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="AddFuncionario"
          component={AddFuncionario}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="VisuFuncionario"
          component={VisuFuncionario}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
