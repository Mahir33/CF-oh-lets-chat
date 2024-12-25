import { StyleSheet, Text, View } from 'react-native';

// Importing components
import Start from './components/start/Start.js';
import Chat from './components/chat/Chat.js';

// Importing react-navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Creating a stack navigator
const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start">
        <Stack.Screen 
          name="Start" 
          component={Start} />
        <Stack.Screen 
          name="Chat" 
          component={Chat} />
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
