import React, { useState, useEffect } from "react";
import { Button, View, Text, TextInput, ActivityIndicator } from "react-native";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { auth } from "../firebase-config";
import {
  BannerAd,
  InterstitialAd,
  BannerAdSize,
  AdEventType,
  TestIds,
} from "react-native-google-mobile-ads";

const bAdUnitId = __DEV__
  ? TestIds.BANNER
  : "ca-app-pub-8461800461427854/8164763611";

const iAdUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : "ca-app-pub-8461800461427854/4225518603";

const interstitial = InterstitialAd.createForAdRequest(iAdUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

export default function AjuestesScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [iLoaded, iSetLoaded] = useState(false);

  const loadInterstitial = () => {
    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        iSetLoaded(true);
      }
    );

    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        iSetLoaded(false);
        interstitial.load();
      }
    );

    interstitial.load();

    return () => {
      unsubscribeClosed();
      unsubscribeLoaded();
    };
  };

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      setLoading(false);
    }
    const unsubscribeInterstitialEvents = loadInterstitial();

    return () => {
      unsubscribeInterstitialEvents();
    };
  }, []);

  const handleSubmit = () => {
    const oldPasswordInput = oldPassword.trim();
    const newPasswordInput = newPassword.trim();
    const confirmPasswordInput = confirmPassword.trim();

    // Validar que todos los campos estén llenos
    if (!oldPasswordInput || !newPasswordInput || !confirmPasswordInput) {
      setErrorMessage("Por favor, complete todos los campos.");
      return;
    }

    // Validar que las nuevas contraseñas sean iguales
    if (newPasswordInput !== confirmPasswordInput) {
      setErrorMessage("Las nuevas contraseñas no coinciden.");
      return;
    }

    // Validar que la contraseña antigua sea correcta
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      oldPassword
    );
    reauthenticateWithCredential(user, credential)
      .then(() => {
        // Actualizar la contraseña
        updatePassword(user, newPasswordInput)
          .then(() => {
            console.log("Password updated successfully");
            // Aquí puedes mostrar una notificación de que la contraseña se ha actualizado correctamente
          })
          .catch((error) => {
            console.error(error);
            // Aquí puedes mostrar una notificación de que ha ocurrido un error al actualizar la contraseña
          });
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage("La contraseña antigua es incorrecta.");
      });
  };
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#DDDDDD",
      }}
    >
      {loading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={{ marginTop: 10 }}>Cargando monedas...</Text>
        </View>
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 20, fontWeight: "800" }}>
            Bienvenido: {user.email}
          </Text>
        </View>
      )}
      <View style={{ flex: 6, flexDirection: "column" }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <TextInput
            placeholder="Contraseña antigua"
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry
          />
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <TextInput
            placeholder="Nueva contraseña"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <TextInput
            placeholder="Confirmar nueva contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "red" }}>{errorMessage}</Text>
        </View>
        <View
          style={{ flex: 2, justifyContent: "center", alignItems: "center" }}
        >
          <Button
            color={"#f4511e"}
            title="Cambiar contraseña"
            onPress={() => {
              interstitial.show();
              handleSubmit;
            }}
          />
        </View>
        <View
          style={{ flex: 2, justifyContent: "center", alignItems: "center" }}
        >
          <Button
            color={"#f4511e"}
            title="Ir a Inicio"
            onPress={() => {
              interstitial.show();
              navigation.goBack();
            }}
          />
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <BannerAd
          unitId={bAdUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </View>
    </View>
  );
}
