import { TouchableOpacity, Text, View, StyleSheet, Alert } from "react-native";
import { useActionSheet } from '@expo/react-native-action-sheet';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

// CustomActions component
const CustomActions = ({ 
  wrapperStyle, 
  iconTextStyle, 
  onSend, 
  storage, 
  userID }) => {
    // Use the ActionSheet hook
    const actionSheet = useActionSheet();

    // Function to handle the action press
        const onActionPress = () => {
        const options = [
            'Choose From Library', 
            'Take Picture', 
            'Send Location', 
            'Cancel'
        ];

        // Define the cancel button index
        const cancelButtonIndex = options.length - 1;
        actionSheet.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            // Handle the button press
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        pickImage();
                        return;
                    case 1:
                        takePhoto();
                        return;
                    case 2:
                        getLocation();
                    default:
                }
            },
        );
    };

  // Function to generate a unique reference for an image based on user ID, current timestamp, and image name
  const generateReference = (uri) => {
    // Get the current timestamp
    const timeStamp = new Date().getTime();
    // Get the image name
    const imageName = uri.split("/")[uri.split("/").length - 1];
    // Generate a unique reference string
    return `${userID}-${timeStamp}-${imageName}`;
  };

  // Function to upload an image to Firebase Storage and send its URL
  const uploadAndSendImage = async (imageURI) => {
    // Generate a unique reference string for the image
    const uniqueRefString = generateReference(imageURI);
    // Create a reference to the new image
    const newUploadRef = ref(storage, uniqueRefString);
    // Fetch the image data
    const response = await fetch(imageURI);
    // Convert the image data into a Blob
    const blob = await response.blob();
    // Upload the image to Firebase Storage
    //! ----------- DOESN'T WORK ------------
    uploadBytes(newUploadRef, blob).then(async (snapshot) => {
      const imageURL = await getDownloadURL(snapshot.ref);
      onSend({ image: imageURL });
    });
  };

  // Function to pick an image from the device's media library
  const pickImage = async () => {
    // Request media library permissions
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    // If permissions are granted, launch the image library
    if (permissions?.granted) {
      // Launch the image library
      let result = await ImagePicker.launchImageLibraryAsync();
      // If the user didn't cancel the action, upload and send the image
      if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
      // If the user canceled the action, do nothing
    } else Alert.alert("Permissions haven't been granted.");
  };

  // Function to take a photo using the device's camera
  const takePhoto = async () => {
    // Request camera permissions
    let permissions = await ImagePicker.requestCameraPermissionsAsync();
    // If permissions are granted, launch the camera
    if (permissions?.granted) {
      // Launch the camera
      let result = await ImagePicker.launchCameraAsync();
      // If the user didn't cancel the action, upload and send the image
      if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
      // If the user canceled the action, do nothing
    } else Alert.alert("Permissions haven't been granted.");
  };

  // Function to get the device's location
  const getLocation = async () => {
    // Request location permissions
    let permission = await Location.requestForegroundPermissionsAsync();
    // If permissions are granted, get the device's location
    if (permission?.granted) {
      // Get the device's location
      let location = await Location.getCurrentPositionAsync({});
      // If the location is fetched, send the location
      if (location) {
        onSend({
          location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          },
      });
      // If the location isn't fetched, display an error message
      } else Alert.alert("Error occurred while fetching location");
      // If permissions aren't granted, display an error message
    } else Alert.alert("Permissions haven't been granted.");
  };

  return (
    // TouchableOpacity component to handle the action press
    <TouchableOpacity
        accessible={true}
        accessibilityLabel="Input field option"
        accessibilityHint="Lets you select to pick an image, take a photo, or send a location."
        accessibilityRole="button"   
        style={styles.container} 
        onPress={onActionPress}>
            <View style={[styles.wrapper, wrapperStyle]}>
                <Text style={[styles.iconText, iconTextStyle]}>+</Text>
            </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 10,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

export default CustomActions;