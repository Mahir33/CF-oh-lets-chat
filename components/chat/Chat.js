// Purpose: This file contains the Chat component, which is the screen where the user can chat with others.
// The Chat component displays the user's name and sets the background color based on the user's selection in the Start component.
// The Chat component uses the useEffect hook to set the navigation title to the user's name.

// Import statements
import { GiftedChat } from 'react-native-gifted-chat';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Chat component
const Chat = ({route, navigation}) => {

    // State variable to store the messages in the chat
    const [ messages, setMessages ] = useState([]);

    // Extract the name and color from the route parameters
    const {name, color: color} = route.params;
    
    // Function to handle sending messages in the chat
    const onSend = (messages) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    }

    useEffect(() => {
        // Set the navigation title to the name passed in the route parameters
        navigation.setOptions({title: name});

        // Set the initial messages in the chat
        setMessages([
            {
                _id: 1,
                text: 'Welcome to the chat!',
                createdAt: new Date(),
                system: true,
            },
            {
                _id: 2,
                text: 'Hello!',
                createdAt: new Date(),
                user: {
                    _id: 3,
                    name: 'Adam',
                    avatar: 'https://placeimg.com/140/140/any',
                },
            },
        ])}  
    , []
    );

    return (
        // Set the background color of the container to the color passed in the route parameters
        <View style={[styles.container, {backgroundColor: color}]} >
            {/* 
            GiftedChat component to display the chat messages.
             */}
            <GiftedChat 
                messages={messages}
                onSend={onSend}
                user={{
                    _id: 1,
                }}
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