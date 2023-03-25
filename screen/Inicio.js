import React, { useState, useEffect } from "react";
import { Button, View, Text } from "react-native";
import { signOut } from "firebase/auth";
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

export default function InicioScreen({ navigation }) {
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
    const unsubscribeInterstitialEvents = loadInterstitial();

    return () => {
      unsubscribeInterstitialEvents();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      alert.log(error.message);
    }
  };

  return (
    <View
      style={{ flex: 1, flexDirection: "column", backgroundColor: "#DDDDDD" }}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 34, fontWeight: "800" }}>¡Sortea2!</Text>
      </View>
      <View style={{ flex: 6, flexDirection: "column" }}>
        <View
          style={{ flex: 2, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 20, fontWeight: "800" }}>
            ¡Empieza a ganar premios!
          </Text>
          <Button
            color={"#f4511e"}
            title="Ir a Video"
            onPress={() => {
              interstitial.show();
              navigation.navigate("Video");
            }}
          />
        </View>
        <View
          style={{ flex: 2, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 20, fontWeight: "800" }}>
            ¡Canjea tus monedas por premios!
          </Text>
          <Button
            color={"#f4511e"}
            title="Ir a Canjea"
            onPress={() => {
              interstitial.show();
              navigation.navigate("Canjea");
            }}
          />
        </View>
        <View
          style={{ flex: 2, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 20, fontWeight: "800" }}>
            Gestiona tu contraseña
          </Text>
          <Button
            color={"#f4511e"}
            title="Ir a Ajustes"
            onPress={() => {
              interstitial.show();
              navigation.navigate("Ajustes");
            }}
          />
        </View>
        <View
          style={{ flex: 2, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 20, fontWeight: "800" }}>Cerrar Sesión</Text>
          <Button
            color={"#f4511e"}
            title="Cerrar Sesión"
            onPress={() => {
              interstitial.show();
              handleSignOut;
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
