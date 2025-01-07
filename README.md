# React Native Mobile Chat App

## About the app:

In this mobile app, there is a start page for users to enter their name, choose a background color and a button to start chatting.  
The button links the users to the second page where they are able to see their conversation, type in an input box and submit new messages.  
Users are also able to send images and location data. All data gets stored online and offline.

## User Stories

- As a new user, I want to be able to easily enter a chat room so I can quickly start talking to my
  friends and family.
- As a user, I want to be able to send messages to my friends and family members to exchange
  the latest news.
- As a user, I want to send images to my friends to show them what I’m currently doing.
- As a user, I want to share my location with my friends to show them where I am.
- As a user, I want to be able to read my messages offline so I can reread conversations at any
  time.
- As a user with a visual impairment, I want to use a chat app that is compatible with a screen
  reader so that I can engage with a chat interface.

## Technologies Used

- React Native (JavaScript framework)
- Expo (Development platform)
- Android Studio Emulator (Testing)
- GiftedChat (React Native chat library)
- Firebase (Database & file storage)
- AsyncStorage (Caching for offline mode)
- React Native Maps (Display shared location)
- ImagePicker (Upload and share images)

## Setup Instructions

Follow these steps to set up the project locally:

1. Clone the repository:
   `git clone https://github.com/Mahir33/cf-oh-lets-chat.git`
   `cd CF-oh-lets-chat`

2. Install dependencies:
   Make sure to have [Node.js v18.20.4] (https://nodejs.org/en/learn/getting-started/how-to-install-nodejs) installed. Then run this command in a terminal to install the dependencies in the project folder:
   `npm install`
   Then install the Expo CLI as a global dependency (if you haven't already):
   `npm install -g expo-cli`

3. Configure Firebase: Go to Firebase Console, create a new project, and add a web app. Then copy your Firebase config credentials. Finally, add them to the "Firebase credentials" section of the "App.js" file:
   `const firebaseConfig = {`
   `apiKey: "YOUR_API_KEY",`
   `authDomain: "YOUR_AUTH_DOMAIN",`
   `projectId: "YOUR_PROJECT_ID",`
   `storageBucket: "YOUR_STORAGE_BUCKET",`
   `messagingSenderId: "YOUR_MESSAGING_SENDER_ID",`
   `appId: "YOUR_APP_ID"`

4. Run the app locally:
   `npm run start`