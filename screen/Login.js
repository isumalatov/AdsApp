import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import TextBox from "../components/TextBox";
import Btn from "../components/Btn";
import { signInWithEmailAndPassword } from "firebase/auth";
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

export default function Loginscreen({ navigation }) {
  const [values, setValues] = useState({
    email: "",
    pwd: "",
  });

  function handleChange(text, eventName) {
    setValues((prev) => {
      return {
        ...prev,
        [eventName]: text,
      };
    });
  }

  function Login() {
    const { email, pwd } = values;

    signInWithEmailAndPassword(auth, email, pwd)
      .then(() => {})
      .catch((error) => {
        alert("Contraseña o correo incorrectos");
        // ..
      });
  }

  return (
    <View style={styles.view}>
      <Text style={{ fontSize: 34, fontWeight: "800", marginBottom: 20 }}>
        ¡Sortea2!
      </Text>
      <Text style={{ fontSize: 34, fontWeight: "800", marginBottom: 20 }}>
        Inicia Sesión
      </Text>
      <TextBox
        placeholder="Dirrección de correo"
        onChangeText={(text) => handleChange(text, "email")}
      />
      <TextBox
        placeholder="Contraseña"
        onChangeText={(text) => handleChange(text, "pwd")}
        secureTextEntry={true}
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
          onClick={() => Login()}
          title="Iniciar Sesión"
          style={{ width: "48%", backgroundColor: "#f4511e" }}
        />
        <Btn
          onClick={() => navigation.navigate("Sign Up")}
          title="Registrarse"
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
