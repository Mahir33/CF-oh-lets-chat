// Purpose: This file contains the Start component, which is the first screen that the user sees when they open the app.
// The Start component allows the user to enter their name, select a background color, and navigate to the chat screen.
// The user's name and selected background color will be passed to the chat screen.
// The Start component uses state variables to store the user's name, selected background color, and error message.

// Import statements
import { 
  View, 
  Text, 
  StyleSheet, 
  ImageBackground, 
  TextInput, 
  TouchableOpacity
} from "react-native";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Alert } from "react-native";
import { getAuth, signInAnonymously } from "firebase/auth";

// Start component
const Start = ({ navigation }) => {

  // Firebase authentication
  const auth = getAuth();
  
  // State variables to store the user's name, selected background color, and error message
  const [name, setName] = useState('');
  const [color, setColor] = useState('#B9C6AE');
  const [errMessage, setErrMessage] = useState('');

  // Function to handle the name input.
  // This function will be called when the user types in the name input.
  const handleName = (text) => {
      setErrMessage('');
      setName(text);
  }

  // Function to handle the enter chat button.
  // This function will be called when the user presses the enter chat button.
  const signInUser = () => {
    // If the name input is empty or less than 2 characters, display an error message.
    if (name === '' || name.length <= 2) {
      setErrMessage('Please enter your name');
    } else {
      // Sign in anonymously
      signInAnonymously(auth)
        .then(result => {
            // Navigate to the Chat screen with the user's ID, selected color, and name
            navigation.navigate("Chat", {userID: result.user.uid, color, name});
            Alert.alert("Signed in Successfully!");
    })
        .catch((error) => {
            Alert.alert("Unable to sign in, try later again.");
            console.error(error);
            })
      // Clear the name input after navigation
      setName('');
    }
  }

  // Array of color options and their corresponding style keys.
  const colorStyles = [
    {color: '#090C08', styleKey: 'black'}, 
    {color: '#474056', styleKey: 'darkGray'}, 
    {color: '#8A95A5', styleKey: 'gray'}, 
    {color: '#B9C6AE', styleKey: 'lightGreen'}
  ];

  return (
    <ImageBackground 
      source={require('../assets/background.png')} 
      style={styles.backgroundMain}
      accessible={true}
      accessibilityLabel="Background image"
      accessibilityHint="Displays the background image of the start screen"
    > 
      <View>
        <Text style={styles.appTitle}>Oh Lets Chat</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            accessible={true}
            accessibilityLabel="More options"
            accessibilityHint="Type your name to enter the chat."
            accessibilityRole="text"
            value={name}
            onChangeText={handleName}
            style={styles.textInput}
            placeholder="Your name"
            placeholderTextColor="rgba(117, 112, 131, 0.5)"
          />
          <Text style={{color: 'red'}}>{errMessage}</Text>
        </View>
        <View>
          <Text style={{color: '#757083'}}>Choose Background Color:</Text>
          <View style={styles.bgColorContainer}>

          {/* Map through the colorSTyles array, and display all color options. 
          When a color option is selected, the corresponding style key will be applied to the button.
          If the color option is the currently selected color, a border will be displayed around the button.
          When a color option is selected, the color state variable will be updated with the selected color.
          */}
            {colorStyles.map((item, index) => (
              <TouchableOpacity
              accessible={true}
              accessibilityLabel="More options"
              accessibilityHint="Choose a background color for the chat."
              accessibilityRole="button"
                key={index}
                style={[
                    styles.bgColorBtn, 
                    styles[item.styleKey], 
                    color === item.color && styles.selected
                  ]}
                  // When a color option is pressed, the color state variable will be updated with the selected color.
                onPress={() => setColor(item.color)}
              ></TouchableOpacity>
            ))}
          </View>
        </View>
        <TouchableOpacity
          accessible={true}
          accessibilityLabel="More options"
          accessibilityHint="Enter the chat room."
          accessibilityRole="button"
          style={styles.button}
          onPress={signInUser}
        >
          <Text style={styles.buttonText}>Start Chatting</Text>
        </TouchableOpacity>
      </View>
      {/* KeyboardAvoidingView to handle the keyboard behavior. */}
      {Platform.OS === 'ios' ? <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior="padding" /> : null}
    </ImageBackground>
    
  );
};

const styles = StyleSheet.create({
  backgroundMain: {
    flex: 1,
    resizeMode: 'cover',
    paddingBottom: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 50,
  },
  container: {
    height: "44%",
    width: "88%",
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: "#fff",
    padding: 15
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: 'white',
    paddingLeft: 10,
  },
 
  textInput: {
    width: '100%',
    height: 50,
    color: 'black',
    opacity: 0.5,
    fontWeight: '300',
    fontSize: 16,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#757083',
    padding: 10,
    width: '100%',
    height: 50
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  bgColorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 55
  },
  selected: {
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  bgColorBtn: {
    width: 35,
    height: 35,
    borderRadius: 25,
    margin: 10,
    backgroundColor: "red",
  },
  black: {
    backgroundColor: '#090C08',
  },
  darkGray: {
    backgroundColor: '#474056',
  },
  gray: {
    backgroundColor: '#8A95A5',
  },
  lightGreen: {
    backgroundColor: '#B9C6AE',
  },
  keyboardAvoidingView: {
    margin: 0
  }
});

export default Start;
