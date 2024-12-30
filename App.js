import { StyleSheet} from 'react-native';
import { 
  API_KEY, 
  AUTH_DOMAIN, 
  PROJECT_ID, 
  STORAGE_BUCKET, 
  MESSAGING_SENDER_ID, 
  APP_ID 
} from '@env';


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

  // Secured firebase configuration
  const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID
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
