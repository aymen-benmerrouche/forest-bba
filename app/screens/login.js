import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Button,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import colors from "../shared/colors";
import Animated, {
  FadeIn,
  FadeOut,
  FadeInDown,
  FadeInUp,
  FadeInRight,
  FadeInLeft,
} from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { supabase } from "../../lib/supabase";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { LogBox } from "react-native";
import { useTranslation } from "react-i18next";
LogBox.ignoreLogs(["new NativeEventEmitter"]);
import i18next from "../../services/i18next";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sound, setSound] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [modal, setmodal] = useState(false);
  const [error, setError] = useState("");
  const [lodingBtn, setlodingBtn] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    
    const Language = async () => {
      
      if (await AsyncStorage.getItem("lng")==="ar") {
        i18next.changeLanguage("ar")
      }
      else{
        i18next.changeLanguage("en")
      }
      
    };
    Language();
  }, []);





  useEffect(() => {
    const loadMusic = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/login.mp3"),
        { isLooping: true }
      );
      setSound(sound);
    };
    loadMusic();
  }, []);

  useEffect(() => {
    const playMusic = async () => {
      if (sound) {
        await sound.playAsync();
      }
    };
    playMusic();
  }, [sound]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  }, [error]);

  const toggleMute = async () => {
    setIsMuted((prev) => !prev);
    if (sound) {
      await sound.setIsMutedAsync(!isMuted);
    }
  };

  const Mute = async () => {
    await sound.setIsMutedAsync(true);
  };

  async function signInWithEmail() {
    setlodingBtn(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) setError(error.message);
    else {
      Mute();
    }
    setlodingBtn(false);
  }
  return (
    <>
      <ImageBackground
        style={styles.Background}
        source={require("../images/background.jpg")}
        blurRadius={6}
      >
       
        <Animated.View
          entering={FadeInDown.duration(100).delay(1100).springify()}
        >
          <Ionicons
            name={isMuted ? "volume-off" : "volume-high"}
            size={32}
            color="#ffff"
            style={{ position: "absolute", top: 10, right: 10 }}
            onPress={toggleMute}
          />
        </Animated.View>
        <Animated.View
          entering={FadeInUp.duration(100).delay(200).springify()}
          style={styles.logocontainer}
        >
          <Image source={require("../images/logo.png")} style={styles.logo} />
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(100).delay(400).springify()}>
          <Text style={styles.welcome}>{t("welcome")} </Text>
        </Animated.View>
        <Animated.View
          entering={FadeInUp.duration(100).delay(600).springify()}
          style={styles.textcontainer}
        >
          <Text style={styles.text}>{t("welcomText")}</Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(100).delay(900).springify()}
          style={{
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            bottom: "-20%",
          }}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              console.log("clicked");
              setmodal(true);
            }}
          >
            <Text style={styles.textbutton}>{t("loginBtn")}</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.Text
          entering={FadeInDown.duration(100).delay(1100).springify()}
          style={styles.textt}
        >
          {t("loginText")}
          <Text style={{ fontWeight: "bold", color: "#7C9A92" }}>
            {t("contactUs")}
          </Text>
        </Animated.Text>
      </ImageBackground>

      <Modal
        visible={modal}
        onRequestClose={() => {
          setmodal(false);
        }}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <KeyboardAvoidingView
          keyboardVerticalOffset={150}
          behavior="padding"
          style={styles.modal}
        >
          <Ionicons
            name={isMuted ? "volume-off" : "volume-high"}
            size={32}
            color="#ffff"
            style={{ position: "absolute", top: 10, left: "90%" }}
            onPress={toggleMute}
          />

          <View style={{ width: "90%" }}>
            <Animated.View
              entering={FadeInLeft.duration(100).delay(400).springify()}
              style={styles.ImageContianer}
            >
              <Image
                source={require("../images/logo.png")}
                style={styles.ModalImage}
              />
            </Animated.View>
            <Animated.View
              entering={FadeInRight.duration(100).delay(600).springify()}
              style={{ marginTop: "5%", marginLeft: "10%" }}
            >
              <Text style={styles.signin}>{t("signIn")}</Text>
              <Text style={styles.signinText}>{t("signInText")}</Text>
            </Animated.View>

            <Animated.View
              entering={FadeInLeft.duration(100).delay(900).springify()}
              style={styles.LoginForm}
            >
              <TextInput
                style={styles.InputForm}
                placeholder={t("email")}
                placeholderTextColor="#BEC2C2"
                keyboardType="email-address"
                value={email}
                onChangeText={(val) => {
                  setEmail(val);
                }}
              />

              <TextInput
                style={styles.InputForm}
                placeholder={t("password")}
                placeholderTextColor="#BEC2C2"
                secureTextEntry
                value={password}
                onChangeText={(val) => {
                  setPassword(val);
                }}
              />
            </Animated.View>

            <Animated.View
              entering={FadeInRight.duration(100).delay(1100).springify()}
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "auto",
                marginTop: -40,
              }}
            >
              <TouchableOpacity
                disabled={lodingBtn}
                style={styles.button}
                onPress={async () => {
                  signInWithEmail();
                }}
              >
                <Text style={styles.textbutton}>{t("loginBtn")} </Text>
              </TouchableOpacity>
              <Animated.Text
                entering={FadeInLeft.duration(100).delay(1300).springify()}
                style={[styles.texttt]}
              >
                {t("loginText")}
                <Text style={{ fontWeight: "bold", color: "#7C9A92" }}>
                  {t("contactUs")}
                </Text>
              </Animated.Text>
              <Animated.Text
                entering={FadeInLeft.duration(100).delay(100).springify()}
                style={styles.textEror}
              >
                {error}
              </Animated.Text>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  Background: {
    flex: 1,
  },
  text: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFF",
    textAlign: "center",
    marginTop: 120,
    elevation: 30,

    textShadowColor: "#000000",
    textShadowOffset: { width: -3, height: 3 },
    textShadowRadius: 10,
  },
  welcome: {
    color: colors.primary,
    marginTop: 15,
    textAlign: "center",
    fontSize: 40,
    fontWeight: "900",
  },
  logocontainer: {
    marginTop: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 215,
    height: 200,
  },
  textcontainer: {
    flexDirection: "row",
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  text: {
    marginTop: 6,
    fontSize: 14,
    color: colors.primary,
    textAlign: "center",
    fontWeight: "bold",
  },
  button: {
    marginTop: 50,
    width: 300,
    height: 60,
    backgroundColor: colors.secnd,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  textbutton: {
    color: colors.primary,
    fontSize: 25,
    fontWeight: "500",
  },
  textt: {
    bottom: "-21%",
    fontSize: 15,
    color: colors.primary,
    textAlign: "center",
  },
  texttt: {
    bottom: "-6%",
    fontSize: 15,
    color: colors.primary,
    textAlign: "center",
  },
  modal: {
    backgroundColor: colors.third,
    flex: 1,
    justifyContent: "center",
  },
  ImageContianer: {
    marginTop: "25%",
    marginLeft: "10%",
  },
  ModalImage: {
    width: 95,
    height: 90,
  },
  signin: {
    color: colors.primary,
    fontSize: 37,
    fontWeight: "bold",
  },
  signinText: {
    color: "#BEC2C2",
    fontSize: 17,
  },
  LoginForm: {
    marginTop: "10%",
    marginLeft: "10%",
  },
  TextForm: {},
  InputForm: {
    fontSize: 20,
    marginBottom: "13%",
    borderBottomWidth: 1,
    borderBottomColor: "#BEC2C2",
    padding: 10,
    color: "#ffff",
  },
  textEror: {
    fontSize: 18,
    marginTop: "5%",
    color: "red",
    fontWeight: "bold",
  },
});
