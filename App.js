import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InicioScreen from "./screen/Inicio";
import VideoScreen from "./screen/Video";
import AjuestesScreen from "./screen/Ajustes";
import CanjeaScreen from "./screen/Canjea";
import LoginScreen from "./screen/Login";
import SignUpScreen from "./screen/SignUp";
import React, { useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {auth} from "./firebase-config";
import "expo-dev-client";

const Stack = createNativeStackNavigator();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      setIsLoggedIn(true);
      // ...
    } else {
      setIsLoggedIn(false);
    }
  });

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Stack.Navigator initialRouteName="Inicio">
          <Stack.Screen
            name="Inicio"
            component={InicioScreen}
            options={{
              headerStyle: {
                backgroundColor: "#f4511e",
              },
              headerTintColor: "#fff",
            }}
          />
          <Stack.Screen
            name="Video"
            component={VideoScreen}
            options={{
              headerStyle: {
                backgroundColor: "#f4511e",
              },
              headerTintColor: "#fff",
            }}
          />
          <Stack.Screen
            name="Ajustes"
            component={AjuestesScreen}
            options={{
              headerStyle: {
                backgroundColor: "#f4511e",
              },
              headerTintColor: "#fff",
            }}
          />
          <Stack.Screen
            name="Canjea"
            component={CanjeaScreen}
            options={{
              headerStyle: {
                backgroundColor: "#f4511e",
              },
              headerTintColor: "#fff",
            }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Sign Up"
            component={SignUpScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default App;
