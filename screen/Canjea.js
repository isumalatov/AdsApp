import React, { useState, useEffect } from "react";
import {
  Button,
  View,
  Text,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { db, auth } from "../firebase-config";
import { doc, getDoc, setDoc } from "firebase/firestore";
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

export default function CanjeaScreen({ navigation }) {
  const [coins, setCoins] = useState(0);
  const [coinsLoading, setCoinsLoading] = useState(true);
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

  const fetchCoins = async () => {
    const user = auth.currentUser;
    const userCoins = await getDoc(doc(db, "users", user.uid));
    if (userCoins.exists()) {
      const coins = userCoins.data().coins;
      setCoins(coins);
    }
    setCoinsLoading(false);
  };

  const services = [
    { id: 1, name: "Netflix", time: "6 meses!", price: "8000" },
    { id: 2, name: "Netflix", time: "3 meses!", price: "5000" },
    { id: 3, name: "Amazon", time: "20 euros!", price: "10000" },
    { id: 4, name: "Amazon", time: "50 euros!", price: "15000" },
    { id: 5, name: "Disney+", time: "3 meses!", price: "3750" },
    { id: 6, name: "Disney+", time: "6 meses!", price: "7000" },
    { id: 7, name: "Spotify", time: "6 meses!", price: "3000" },
    { id: 8, name: "Spotify", time: "1 año!", price: "5000" },
  ];

  const handledecrementCoins = async (value) => {
    const user = auth.currentUser;
    const coinsRef = doc(db, "users", user.uid);
    const newCoins = coins - value;

    if (newCoins < 0) {
      alert("Modenas insuficientes");
    } else {
      await setDoc(coinsRef, { coins: newCoins }, { merge: true });
      setCoins(newCoins);
      alert(
        "Gracias por tu compra, en menos de 30 dias recibirá un correo con los pasos a seguir"
      );
    }
  };

  useEffect(() => {
    fetchCoins();
    const unsubscribeInterstitialEvents = loadInterstitial();

    return () => {
      unsubscribeInterstitialEvents();
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={{ alignItems: "center" }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#DDDDDD",
        }}
      >
        {coinsLoading ? (
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={{ marginTop: 10 }}>Cargando monedas...</Text>
          </View>
        ) : (
          <Text style={{ fontSize: 20, fontWeight: "800", margin: 30 }}>
            Monedas: {coins}
          </Text>
        )}

        {services.map((service) => (
          <View
            key={service.id}
            style={{
              width: 180,
              height: 130,
              backgroundColor: "grey",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 25,
              borderWidth: 1,
            }}
          >
            <Text
              style={{
                color:
                  service.name === "Netflix"
                    ? "red"
                    : service.name === "Spotify"
                    ? "green"
                    : service.name === "Disney+"
                    ? "blue"
                    : service.name === "Amazon"
                    ? "orange"
                    : "black",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 20,
                marginBottom: 10,
              }}
            >
              {service.name}
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              {service.time} {service.price} monedas
            </Text>
            <Button
              color={"#f4511e"}
              title="Canjear"
              onPress={() => {
                interstitial.show();
                handledecrementCoins(service.price);
              }}
            />
          </View>
        ))}
        <Button
          color={"#f4511e"}
          title="Ir a Inicio"
          onPress={() => {
            interstitial.show();
            navigation.goBack();
          }}
        />
        <View>
          <BannerAd
            unitId={bAdUnitId}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}
