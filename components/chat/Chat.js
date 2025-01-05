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
  

  
  let unsubscribeMessages;

  useEffect(() => {

    if (isConnected === true) {

      // unregister current onSnapshot() listener to avoid registering multiple listeners when
      // useEffect code is re-executed.
      if (unsubscribeMessages) unsubscribeMessages();
      unsubscribeMessages = null;

    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    unsubscribeMessages = onSnapshot(q, (docs) => {
      let newMessages = [];
      docs.forEach(doc => {
        newMessages.push({
          id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis())
        })
      })
      cacheMessages(newMessages);
      setMessages(newMessages);
    });
  } else loadCachedMessages();


    return () => {
      if (unsubscribeMessages) unsubscribeMessages();
    }
   }, [isConnected]);



   const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  }

  const loadCachedMessages = async () => {
    const cachedMessages = await AsyncStorage.getItem("messages") || [];
    setMessages(JSON.parse(cachedMessages));
  }

  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0])
  }

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

  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
   }



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