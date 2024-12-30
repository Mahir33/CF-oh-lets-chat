import { StyleSheet, Text, View } from 'react-native';

// Importing components
import Start from './components/start/Start.js';
import Chat from './components/chat/Chat.js';

// Importing react-navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importing firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Creating a stack navigator
const Stack = createNativeStackNavigator();



export default function App() {

  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAcwZk2_UVrNHrRW9UQHqPlZoZCmw7l0Ro",
    authDomain: "ohletsmeetapp.firebaseapp.com",
    projectId: "ohletsmeetapp",
    storageBucket: "ohletsmeetapp.firebasestorage.app",
    messagingSenderId: "708963268313",
    appId: "1:708963268313:web:d11c43e5336e5a1dc0f0c8"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start">
        <Stack.Screen 
          name="Start" 
          component={Start} />
        <Stack.Screen 
          name="Chat" 
         >
          { props => <Chat  db={db} {...props} />}
         </Stack.Screen> 
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
