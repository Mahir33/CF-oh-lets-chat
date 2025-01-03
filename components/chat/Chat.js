// Purpose: This file contains the Chat component, which is the screen where the user can chat with others.
// The Chat component displays the user's name and sets the background color based on the user's selection in the Start component.
// The Chat component uses the useEffect hook to set the navigation title to the user's name.

// Import statements
import { GiftedChat } from 'react-native-gifted-chat';
import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { 
    collection, 
    addDoc, 
    onSnapshot, 
    query, 
    where, 
    orderBy 
} from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

// Chat component
const Chat = ({route, navigation, db}) => {

    // State variable to store the messages in the chat
    const [ messages, setMessages ] = useState([]);

    // Extract the name, color and userID from the Start component
    const {name, color, userID} = route.params;

    useEffect(() => {
        // Set the navigation title to the name passed in the route parameters
        navigation.setOptions({title: name});

        // Set the initial messages in the chat
        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"), where ("uid", "==", userID));
        // Listen to the query
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let newMessages = [];
            querySnapshot.forEach((docObject) => {
                newMessages.push(docObject.data());
            });
            // Set the messages in the chat
            setMessages(newMessages);
        })
        // Unsubscribe from the listener when the component unmounts
        return () => {
            if (unsubscribe) unsubscribe();
        }
    }, []
    );

    // Function to send a new message
    const onSend = async (newMessage) => {
        // Add the new message to the Firestore database
        const newMessageRef = await addDoc(collection(db, "messages"), newMessage);
        // If the message was added successfully, update the messages state and show an alert
        if (newMessageRef.id) {
          setMessages([newMessage, ...messages]);
          Alert.alert(`The message "${newMessage}" has been sent.`);
        }else{
          Alert.alert("Unable to add. Please try later");
        }
      }

    // Function to handle sending a message
    const handleMessageSend = (messages = []) => {
        const newMessage = {
          _id: uuidv4(),
          text: messages[0]?.text || '',
          createdAt: new Date(),
          user: {
            _id: userID,
            name: name,
            avatar: "link"
          }
        };
        onSend(newMessage);
      }

    return (
        // Set the background color of the container to the color passed in the route parameters
        <View style={[styles.container, { backgroundColor: color }]}>
        <GiftedChat
          messages={messages}
          onSend={handleMessageSend}
        />
      </View>
    );
}

// Define the styles for the Chat component
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default Chat;