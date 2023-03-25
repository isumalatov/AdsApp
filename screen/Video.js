import React, { useState, useEffect } from "react";
import {
  Button,
  View,
  Text,
  Linking,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import { doc, collection, getDocs, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase-config";
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

const windowWidth = Dimensions.get("window").width;

export default function VideoScreen({ navigation }) {
  const [youtubeLinks, setYoutubeLinks] = useState([]);
  const [linksLoading, setLinksLoading] = useState(true);
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

  const fetchLinks = async () => {
    const querySnapshot = await getDocs(collection(db, "youtube_links"));
    const links = [];
    querySnapshot.forEach((doc) => {
      const link = doc.data().link;
      links.push(link);
    });
    setYoutubeLinks(links);
    setLinksLoading(false);
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

  useEffect(() => {
    fetchLinks();
    fetchCoins();
    const unsubscribeInterstitialEvents = loadInterstitial();

    return () => {
      unsubscribeInterstitialEvents();
    };
  }, []);

  const handleOpenVideo = async (link) => {
    Linking.openURL(link);
    const user = auth.currentUser;
    const coinsRef = doc(db, "users", user.uid);
    const newCoins = coins + 100;
    await setDoc(coinsRef, { coins: newCoins }, { merge: true });
    setCoins(newCoins);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#DDDDDD",
        flexDirection: "column",
      }}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 20, fontWeight: "800" }}>
          Visualiza los siguientes videos
        </Text>
      </View>
      {coinsLoading ? (
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
            Monedas: {coins}
          </Text>
        </View>
      )}
      <View style={{ flex: 8, flexDirection: "column" }}>
        {linksLoading ? (
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={{ marginTop: 10 }}>Cargando videos...</Text>
          </View>
        ) : (
          youtubeLinks.map((link, index) => (
            <View style={{ width: windowWidth * 0.8, marginBottom: 10 }}>
              <Button
                color={"#f4511e"}
                key={index}
                title={`Abrir video ${index + 1}`}
                onPress={() => {
                  handleOpenVideo(link).then(() => {
                    if (iLoaded) {
                      interstitial.show();
                    }
                  });
                }}
              />
            </View>
          ))
        )}
        <Button
          color={"#f4511e"}
          title="Ir a Inicio"
          onPress={() => {
            interstitial.show();
            navigation.goBack();
          }}
        />
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
    </ScrollView>
  );
}
