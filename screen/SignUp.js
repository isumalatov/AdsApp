import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import TextBox from "../components/TextBox";
import Btn from "../components/Btn";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

const adUnitId = __DEV__
  ? TestIds.BANNER
  : "ca-app-pub-8461800461427854/8164763611";

const styles = StyleSheet.create({
  view: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default function SignUpScreen({ navigation }) {
  const [values, setValues] = useState({
    email: "",
    pwd: "",
    pwd2: "",
  });

  function handleChange(text, eventName) {
    setValues((prev) => {
      return {
        ...prev,
        [eventName]: text,
      };
    });
  }

  function SignUp() {
    const { email, pwd, pwd2 } = values;

    if (pwd == pwd2) {
      createUserWithEmailAndPassword(auth, email, pwd)
        .then(() => {})
        .catch((error) => {
          alert(error.message);
          // ..
        });
    } else {
      alert("Passwords are different!");
    }
  }

  return (
    <View style={styles.view}>
      <Text style={{ fontSize: 34, fontWeight: "800", marginBottom: 20 }}>
        ¡Sortea2!
      </Text>
      <Text style={{ fontSize: 34, fontWeight: "800", marginBottom: 20 }}>
        Resgístrate
      </Text>
      <TextBox
        placeholder="Dirección de correo"
        onChangeText={(text) => handleChange(text, "email")}
      />
      <TextBox
        placeholder="Contraseña"
        secureTextEntry={true}
        onChangeText={(text) => handleChange(text, "pwd")}
      />
      <TextBox
        placeholder="Repite la contraseña"
        secureTextEntry={true}
        onChangeText={(text) => handleChange(text, "pwd2")}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "92%",
        }}
      >
        <Btn
          onClick={() => SignUp()}
          title="Resgitrarse"
          style={{ width: "48%", backgroundColor: "#f4511e" }}
        />
        <Btn
          onClick={() => navigation.replace("Login")}
          title="Iniciar Sesión"
          style={{ width: "48%", backgroundColor: "#f4511e" }}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </View>
    </View>
  );
}
