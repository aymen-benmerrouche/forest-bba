import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Button,
  Linking
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../shared/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";
import i18next from "../../services/i18next";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import uuid from "react-native-uuid";
import { Feather } from '@expo/vector-icons';



export default function Settings({ session }) {
  const [lng, setLng] = useState("");
  const [appLng, setAppLng] = useState("");
  const [lngModal, setLngModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [passModal, setPassModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);

  const [pass, setpass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageuri, setimageuri] = useState("/assets/icon.png");
  const [imagee, setimagee] = useState("");
  const [photoname, setphotoname] = useState("");
  const {t} = useTranslation();
  

  const photoProfile = session.user.user_metadata.image_url;
const userId=session.user.id

  const toStorage = async () => {
    try {
      console.log(session.user.id);

      const { user, error } = await supabase.auth.updateUser({
        data: { image_url: cdnprofilephoto + photoname + ".jpg" },
      });

      if (error) {
        throw error;
      }

      console.log("User metadata updated successfully:", user);
      
    } catch (error) {
      console.error("Failed to update user metadata:", error.message);
    }
  };
  

  //
  useEffect(() => {
    setphotoname(uuid.v4());
  }, []);
  useEffect(() => {
    if (imagee) {
      uploadPhoto();
    }
    
  }, [imagee]);
  //

  //changephoto
  const cdnprofilephoto =
    "https://gkcogetdjfokkfiazefy.supabase.co/storage/v1/object/public/ForstBba/PorfilePhotos/";
  const changephoto = async () => {
    await ImagePicker.requestCameraPermissionsAsync();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3.5, 4.5],
      quality: 1,
    });

    if (!result.canceled) {
      setimageuri(result.assets[0].uri);
      setimagee(result.assets[0]);
    }
  };

  const uploadPhoto = async () => {
    setphotoname(uuid.v4());
    const arraybuffer = await fetch(imagee.uri).then((res) =>
      res.arrayBuffer()
    );

    const { error } = await supabase.storage
      .from("ForstBba")
      .upload("PorfilePhotos/" + photoname + ".jpg", arraybuffer);

    if (error) {
      console.log(error);
    } else {
      console.log("done");
      toStorage();
      
    }
  };
  //fine changephoto

  // error success hundler
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 3000);
    }
    if (success) {
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    }
  }, [error, success]);
  // error success hundler

  //language functions
  const storeLngData = async (lng) => {
    setAppLng(lng);
    await AsyncStorage.setItem("lng", lng);
    i18next.changeLanguage(lng);
  };
  useEffect(() => {
    const Language = async () => {
      setAppLng(await AsyncStorage.getItem("lng"));
    };
    Language();
  }, [appLng]);

  // language functions

  // delete account function
  const deletAcount = async () => {
    const { data, error } = await supabase.auth.admin.deleteUser(
      session.user.id
    );
    supabase.auth.signOut();
  };
  // delete account function

  // update password
  const updatePassword = async () => {
    if (pass === confirmPass) {
      try {
        const { data: user, error } = await supabase.auth.admin.updateUserById(
          session.user.id,
          { password: pass }
        );

        if (error) {
          setError(error.message);
        } else {
          setSuccess("User password updated  successfully");
        }
      } catch (error) {
        console.error("Error updating user:", error);
      }
    } else {
      setError("Passwords are different");
    }
    setConfirmPass("");
    setpass("");
  };

  // update password

  // update email
  const updateEmail = async () => {
    if (email === confirmEmail) {
      try {
        const { data: user, error } = await supabase.auth.updateUser({
          email: email,
        });

        if (error) {
          setError(error.message);
        } else {
          setSuccess("we sent  a lonk in ur email");
          setEmail("");
          setConfirmEmail("");
        }
      } catch (error) {
        console.error("Error updating user:", error);
      }
    } else {
      setError("Emails are different");
    }
  };
  const role = session.user.user_metadata.role;
  // update email
  return (
    <>
      <View style={{ backgroundColor: colors.third, padding: 10 }}>
        <View style={styles.header}>
          <MaterialIcons name="settings" size={35} color={colors.primary} />
          <Text style={styles.textHeader}> {t('Settinges')}</Text>
        </View>
      </View>

      <View style={styles.container}>
        <TouchableOpacity style={styles.profile} disabled>
          <TouchableOpacity
            onPress={() => {
              changephoto();
            }}
            disabled={!(session.user.user_metadata.image_url==null)}
          >
            {photoProfile ? (
              <Image
                source={{ uri: photoProfile }}
                style={{ width: 70, height: 70, borderRadius: 35 }}
              />
            ) : (
              <Image
                source={require("../images/Default profile.jpg")}
                style={{ width: 70, height: 70, borderRadius: 35 }}
              />
            )}
          </TouchableOpacity>

          <View>
            <Text style={styles.texttt}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </Text>

            <Text style={styles.textt}>{session.user.email}</Text>
          </View>
          {role == "admin" ? (
            <Image
              source={require("../images/admin badge.png")}
              style={{ width: 40, height: 45, position: "absolute", right: 18 }}
            />
          ) : null}
        </TouchableOpacity>
        <View style={{ marginBottom: "20%" }}></View>


      

        <TouchableOpacity
          style={styles.TouchableOpacity}
          onPress={() => {
            setEmailModal(true);
          }}
        >
          <MaterialCommunityIcons
            name="email-edit-outline"
            size={60}
            color={colors.primary}
          />
          <View>
            <Text style={styles.text}>{t('Email')}</Text>
            <Text style={styles.textt}> {t('changeemail')}</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={60}
            color={colors.primary}
            style={{ position: "absolute", right: 1 }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.TouchableOpacity}
          onPress={() => {
            setPassModal(true);
          }}
        >
          <MaterialIcons name="password" size={65} color={colors.primary} />
          <View>
            <Text style={styles.text}>{t('Password')}</Text>
            <Text style={styles.textt}>{t('changpass')}</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={60}
            color={colors.primary}
            style={{ position: "absolute", right: 1 }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.TouchableOpacity]}
          onPress={() => {
            setLngModal(true);
          }}
        >
          <MaterialIcons name="language" size={65} color={colors.primary} />
          <View>
            <Text style={styles.text}>{t('Language')}</Text>
            <Text style={styles.textt}>{t('changlng')}</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={60}
            color={colors.primary}
            style={{ position: "absolute", right: 1 }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.TouchableOpacity]}
          onPress={() => {
            setDeleteModal(true);
          }}
        >
          <AntDesign name="deleteuser" size={65} color={colors.primary} />
          <View>
            <Text style={styles.text}>{t('Delete')}</Text>
            <Text style={styles.textt}>{t('deletacct')}</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={60}
            color={colors.primary}
            style={{ position: "absolute", right: 1 }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.TouchableOpacity]}
          onPress={() => {
            Linking.openURL('tel:1070');
          }}
        >
          <Feather name="phone" size={55} color={colors.primary} />
          <View>
            <Text style={styles.text}>{t('Callus')}</Text>
            <Text style={styles.textt}>{t('Calluss')}</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={60}
            color={colors.primary}
            style={{ position: "absolute", right: 1 }}
          />
        </TouchableOpacity>
        

        <TouchableOpacity
          style={styles.logout}
          onPress={() => supabase.auth.signOut()}
        >
          <MaterialIcons name="logout" size={65} color={colors.primary} />
          <View>
            <Text style={styles.text}>{t('LogOut')}</Text>
          </View>
        </TouchableOpacity>
        
      </View>
      <Modal
        visible={lngModal}
        transparent
        onRequestClose={() => {
          setLngModal(false);
        }}
      >
        <View style={styles.modalBackGround}>
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.modalContainer}
          >
            <MaterialCommunityIcons
              name="close-circle-outline"
              size={38}
              color="black"
              style={styles.close}
              onPress={() => {
                setLngModal(false);
              }}
            />
            <MaterialIcons name="language" size={75} color="black" style={{}} />
            <Text
              style={{
                position: "relative",
                left: 10,
                top: 5,
                fontSize: 25,
                fontWeight: "bold",
                marginBottom: "8%",
              }}
            >
               {t('changelng')}
            </Text>
            <View>
              <TouchableOpacity
                style={[
                  styles.lng,
                  appLng === "ar" ? { backgroundColor: colors.primary } : null,
                ]}
                onPress={() => {
                  storeLngData("ar");
                }}
              >
                <Text style={{ color: colors.third, fontWeight: "bold" }}>
                  العربية
                </Text>
                <Image
                  source={require("../images/alg flag.webp")}
                  style={styles.flag}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.lng,
                  appLng === "en" ? { backgroundColor: colors.primary } : null,
                ]}
                onPress={() => {
                  storeLngData("en");
                }}
              >
                <Text style={{ color: colors.third, fontWeight: "bold" }}>
                  English
                </Text>
                <Image
                  source={require("../images/usa flag.webp")}
                  style={styles.flag}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.lng,
                  appLng === "fr" ? { backgroundColor: colors.primary } : null,
                ]}
                onPress={() => {
                  storeLngData("fr");
                }}
              >
                <Text style={{ color: colors.third, fontWeight: "bold" }}>
                  Francis
                </Text>
                <Image
                  source={require("../images/fr flag.webp")}
                  style={styles.flag}
                />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      <Modal
        visible={deleteModal}
        transparent
        onRequestClose={() => {
          setDeleteModal(false);
        }}
      >
        <View style={styles.modalBackGround}>
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.modalContainer}
          >
            <MaterialCommunityIcons
              name="close-circle-outline"
              size={38}
              color="black"
              style={styles.close}
              onPress={() => {
                setDeleteModal(false);
              }}
            />
            <Text
              style={{
                marginTop: "10%",
                color: "black",
                fontSize: 23,
                fontWeight: "bold",
              }}
            >
             {t('deletemsg')}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "10%",
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "grey",
                  padding: 10,
                  borderRadius: 16,
                }}
                onPress={() => {
                  setDeleteModal(false);
                }}
              >
                <Text style={styles.text}>{t('Cancle')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "red",
                  padding: 10,
                  borderRadius: 16,
                }}
                onPress={() => {
                  deletAcount();
                }}
              >
                <Text style={styles.text}>{t('Delete')}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      <Modal
        visible={passModal}
        transparent
        onRequestClose={() => {
          setPassModal(false);
        }}
      >
        <View style={styles.modalBackGround}>
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.modalContainer}
          >
            <MaterialCommunityIcons
              name="close-circle-outline"
              size={38}
              color="black"
              style={styles.close}
              onPress={() => {
                setPassModal(false);
              }}
            />
            <MaterialIcons name="password" size={75} color="black" style={{}} />

            <Text
              style={{
                position: "relative",
                left: 0,
                top: 0,
                fontSize: 25,
                fontWeight: "bold",
              }}
            >
              {t('Updatethepassword')}
            </Text>
            <TextInput
              style={{
                borderBottomWidth: 1,
                borderColor: colors.third,
                fontSize: 20,
                padding: 7,
                marginVertical: "3%",
              }}
              placeholder= {t('Newpassword')}
              secureTextEntry={true}
              value={pass}
              onChangeText={setpass}
            />
            <TextInput
              style={{
                borderBottomWidth: 1,
                borderColor: colors.third,
                fontSize: 20,
                padding: 7,
              }}
              placeholder= {t('Confirmpassword')}
              secureTextEntry={true}
              value={confirmPass}
              onChangeText={setConfirmPass}
            />
            <TouchableOpacity
              style={{
                backgroundColor: colors.third,
                padding: 10,
                borderRadius: 16,
                justifyContent: "center",
                flexDirection: "row",
                marginTop: "5%",
              }}
              onPress={() => {
                updatePassword();
              }}
            >
              <Text style={styles.text}> {t('Update')}</Text>
            </TouchableOpacity>
            {error ? (
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 15,
                  color: "red",
                  marginTop: "5%",
                }}
              >
                {error}
              </Text>
            ) : null}

            {success ? (
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 15,
                  color: "green",
                  marginTop: "5%",
                }}
              >
                {success}
              </Text>
            ) : null}
          </Animated.View>
        </View>
      </Modal>

      <Modal
        visible={emailModal}
        transparent
        onRequestClose={() => {
          setEmailModal(false);
        }}
      >
        <View style={styles.modalBackGround}>
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.modalContainer}
          >
            <MaterialCommunityIcons
              name="close-circle-outline"
              size={38}
              color="black"
              style={styles.close}
              onPress={() => {
                setEmailModal(false);
              }}
            />
            <MaterialCommunityIcons
              name="email-edit-outline"
              size={75}
              color="black"
              style={{}}
            />

            <Text
              style={{
                position: "relative",
                left: 0,
                top: 0,
                fontSize: 25,
                fontWeight: "bold",
              }}
            >
               {t('Changetheemail')}
            </Text>
            <TextInput
              style={{
                borderBottomWidth: 1,
                borderColor: colors.third,
                fontSize: 20,
                padding: 7,
                marginVertical: "3%",
              }}
              placeholder={t('NewEmail')}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={{
                borderBottomWidth: 1,
                borderColor: colors.third,
                fontSize: 20,
                padding: 7,
              }}
              placeholder={t('ConfirmEmail')}
              keyboardType="email-address"
              value={confirmEmail}
              onChangeText={setConfirmEmail}
            />
            <TouchableOpacity
              style={{
                backgroundColor: colors.third,
                padding: 10,
                borderRadius: 16,
                justifyContent: "center",
                flexDirection: "row",
                marginTop: "5%",
              }}
              onPress={() => {
                updateEmail();
              }}
            >
              <Text style={styles.text}>{t('Update')}</Text>
            </TouchableOpacity>
            {error ? (
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 15,
                  color: "red",
                  marginTop: "5%",
                }}
              >
                {error}
              </Text>
            ) : null}

            {success ? (
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 15,
                  color: "green",
                  marginTop: "5%",
                }}
              >
                {success}
              </Text>
            ) : null}
          </Animated.View>
        </View>
      </Modal>
      

    </>
  );
}
const styles = StyleSheet.create({
  container: {
    marginLeft: "3%",
    marginTop: "8%",
    marginRight: "3%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginLeft: "10%",
  },
  textHeader: {
    fontSize: 30,
    fontWeight: "bold",
    color: colors.primary,
  },
  line: {
    width: "110%",
    borderBottomColor: "black",
    borderBottomWidth: 1,
    marginVertical: 5,
  },
  TouchableOpacity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    backgroundColor: "rgba(125, 155, 147, 0.87)",
    padding: 5,
    borderRadius: 20,
    marginBottom: "1%",
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primary,
  },
  textt: {
    color: colors.primary,
    fontWeight: "bold",
  },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    backgroundColor: "rgba(224, 0, 0, 0.85)",
    padding: 5,
    borderRadius: 20,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    backgroundColor: "grey",
    padding: 15,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    elevation: 5,
  },
  texttt: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
  },
  modalBackGround: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: colors.secnd,
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
  close: {
    position: "absolute",
    right: 1,
    top: 1,
  },
  flag: {
    width: 33,
    height: 30,
    position: "absolute",
    left: 0,
    borderRadius: 10,
  },
  lng: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: "3%",
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
    borderColor: "black",
    height: 30,
    overflow: "hidden",
  },
});
