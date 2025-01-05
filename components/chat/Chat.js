// Import necessary libraries and dependencies
import { collection, addDoc, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform} from 'react-native';

import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";

import AsyncStorage from "@react-native-async-storage/async-storage";



const Chat = ({ route, navigation, db, isConnected }) => {
  // Destructure the route object to get the name, background, and userID 
  const { name, color, userID } = route.params;

  // Initialize the messages state variable
  const [ messages, setMessages ] = useState([]);

  // Update the title of the chat screen and set the color of the title
  useEffect(() => {
    navigation.setOptions({ name, color });
  }, []);
  

  // Initialize the unsubscribeMessages variable
  let unsubscribeMessages;

  useEffect(() => {

    // Check if the device is connected to the internet
    if (isConnected === true) {

      // Unregister current onSnapshot() listener to avoid registering multiple listeners when
      // useEffect code is re-executed.
      if (unsubscribeMessages) unsubscribeMessages();
      unsubscribeMessages = null;

    // Create a query to get the messages collection from Firestore
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    // Register the onSnapshot() listener to listen for changes in the messages collection
    unsubscribeMessages = onSnapshot(q, (docs) => {
      // Initialize an empty array to store the new messages
      let newMessages = [];
      // Loop through the documents in the collection and add them to the newMessages array
      docs.forEach(doc => {
        newMessages.push({
          id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis())
        })
      })
      // Cache the new messages
      cacheMessages(newMessages);
      // Update the messages state variable with the new messages
      setMessages(newMessages);
    });
  } else loadCachedMessages();


    return () => {
      // Unsubscribe the onSnapshot() listener when the component is unmounted
      if (unsubscribeMessages) unsubscribeMessages();
    }
   }, [isConnected]);


   // Function to cache messages
   const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  }

  // Function to load cached messages
  const loadCachedMessages = async () => {
    const cachedMessages = await AsyncStorage.getItem("messages") || [];
    setMessages(JSON.parse(cachedMessages));
  }

  // Function to handle sending messages
  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0])
  }

  // Function to render the chat bubble
  const renderBubble = (props) => {
    return <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#000"
        },
        left: {
          backgroundColor: "#FFF"
        }
      }}
    />
  }

  // Function to render the input toolbar
  const renderInputToolbar = (props) => {
    // Check if the device is connected to the internet
    if (isConnected) return <InputToolbar {...props} />;
    // If the device is not connected to the internet, disable the input toolbar
    else return null;
   }


  //  Return the GiftedChat component with the necessary props
  return (
    <View style={[styles.mContainer, {backgroundColor: color}]}>
    <GiftedChat
      messages={messages}
      renderBubble={renderBubble}
      renderInputToolbar={renderInputToolbar}
      onSend={messages => onSend(messages)}
      user={{
        _id: userID,
        name: name
    }}
    />
    { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mContainer: {
    flex: 1
  }
});

export default Chat;