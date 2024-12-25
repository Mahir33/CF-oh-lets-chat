// Purpose: This file contains the Chat component, which is the screen where the user can chat with others.
// The Chat component displays the user's name and sets the background color based on the user's selection in the Start component.
// The Chat component uses the useEffect hook to set the navigation title to the user's name.

// Import statements
import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Chat component
const Chat = ({route, navigation}) => {

    // Extract the name and color from the route parameters
    const {name, color: color} = route.params;
    
    useEffect(() => {
        // Set the navigation title to the name passed in the route parameters
        navigation.setOptions({title: name});
    }, []);

    return (
        // Set the background color of the container to the color passed in the route parameters
        <View style={[styles.container, {backgroundColor: color}]} >
            <Text>Hello {name}</Text>
            <Text>Chat</Text>
        </View>
    );
}

// Define the styles for the Chat component
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Chat;