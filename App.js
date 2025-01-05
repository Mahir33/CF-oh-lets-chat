import { StyleSheet} from 'react-native';

// Importing environment variables
import { 
  API_KEY, 
  AUTH_DOMAIN, 
  PROJECT_ID, 
  STORAGE_BUCKET, 
  MESSAGING_SENDER_ID, 
  APP_ID 
} from '@env';

// Importing react-navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importing firebase
import { initializeApp } from "firebase/app";
import { getFirestore, enableNetwork, disableNetwork } from "firebase/firestore";

// Importing netinfo
import { useNetInfo } from "@react-native-community/netinfo";

// Importing react hooks
import { useEffect } from 'react';

// Importing components
import Start from './components/start/Start.js';
import Chat from './components/chat/Chat.js';

// Creating a stack navigator
const Stack = createNativeStackNavigator();



export default function App() {

    // Check the network status
    const netInfo = useNetInfo();

    // Check if the device is connected to the internet
    // If the device is not connected to the internet, disable the network
    useEffect(() => {
      if (netInfo.isConnected === false) {
        alert.alert("Connection lost")
        disableNetwork(db);
      } else if (netInfo.isConnected === true) {
        enableNetwork(db);
      }
    }, [netInfo.isConnected]);

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
          { props => <Chat isConnected={netInfo.isConnected}  db={db} {...props} />}
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
