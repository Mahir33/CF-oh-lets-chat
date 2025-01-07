import { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat, InputToolbar, renderActions } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

import CustomActions from './CustomActions';
import MapView from 'react-native-maps';
import { v4 as uuidv4 } from 'uuid';

const Chat = ({ route, navigation, db, isConnected, storage }) => {
  const { userID, name, color } = route.params;
  const [messages, setMessages] = useState([]);


  let unsubscribeMessages;

  useEffect(() => {
    // Set the title of the chat screen to the user's name
    navigation.setOptions({ title: name });

    // Check if the user is connected to the internet
    if (isConnected === true) {

      // Unsubscribe from the previous listener
      // If there is an existing listener, unsubscribe from it before creating a new one
      if (unsubscribeMessages) unsubscribeMessages();
      unsubscribeMessages = null;
 
      // Get the messages from the Firestore database
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      // Listen to the query in real time
      unsubscribeMessages = onSnapshot(q, (docs) => {
        // Create a new array to store the messages
        let newMessages = [];
        // Loop through the documents returned by the query
        docs.forEach(doc => {
          // Get the data from the document
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis())
        })
      });
      // Cache the messages
      cacheMessages(newMessages);
      // Set the messages state
      setMessages(newMessages);
    });
    } else loadCachedMessages();

  //Clean up code
  return () => {
    // Unsubscribe from the listener when the component is unmounted
    if (unsubscribeMessages) unsubscribeMessages();
  }
  }, [isConnected]);

  // Load cached messages
  const loadCachedMessages = async () => {
    // Load the cached messages from AsyncStorage
    const cachedMessages = await AsyncStorage.getItem("messages") || [];
    // Set the messages state
    setMessages(JSON.parse(cachedMessages));
  }

  // Cache messages
  const cacheMessages = async (messagesToCache) => {
    // Cache the messages using AsyncStorage
    try { 
      await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  }

  // Function to send a message
  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0])
  }

  // Function to custom the chat bubble
  const renderBubble = (props) => {
   return (
   <Bubble
     {...props}
     wrapperStyle={{
       right: {
         backgroundColor: "#A9A9A9"
       },
       left: {
         backgroundColor: "#FFF"
       }
     }}
   />
 );
};

  // Function to render the input toolbar if the user is connected
  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  }

  // Function to render the custom actions component
  const renderCustomActions = (props) => {
    return <CustomActions 
      userID={userID} 
      storage={storage} 
      onSend={(newMessages => {
      onSend([{
        ...newMessages,
        _id: uuidv4(),
        createdAt: new Date (),
        user: {
          _id: userID,
          name: name
        }
    }])
    })} {...props}/>;
  };

  // Function to render the custom view for the location message
  const renderCustomView = (props) => {
    // Get the current message
    const { currentMessage} = props;
    // If the message is a location message, render the MapView
    if (currentMessage.location) {
      return (
          <MapView
            style={{width: 150,
              height: 100,
              borderRadius: 13,
              margin: 3}}
            region={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            accessible={true}
            accessibilityLabel="Map view"
            accessibilityHint="Displays the location shared in the message"
          />
      );
    }
    return null;
  }

// Return the chat screen
 return (
   <View 
    style={[
      styles.container,
      { backgroundColor: color}
      ]}
      accessible={true}
      accessibilityLabel="Chat screen"
      accessibilityHint="Displays the chat messages"
    >
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        onSend={messages => onSend(messages)}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        user={{
          _id: userID,
          name: name,
        }}
        accessible={true}
        accessibilityLabel="Chat messages"
        accessibilityHint="Displays the chat messages and input toolbar"
      />
    { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
    
   </View>
   
 );
}

/* Styles for Chat screen */
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default Chat;