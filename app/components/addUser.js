import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image
} from "react-native";
import { supabase } from "../../lib/supabase";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import colors from "../shared/colors";
import { AntDesign } from "@expo/vector-icons";
import i18next from '../../services/i18next';
import { useTranslation } from "react-i18next";

export default function AddUser() {

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [userName, setUserName] = useState("");
  const {t} = useTranslation();

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    }
  }, [success]);
  function clear(){
    setEmail("")
    setPassword("")
    setUserName("")
    }

  const AddUser = async () => {
    try {
      if (password === "") {
        setError("u need to add password");
        return;
      }
      const { data, error } = await supabase.auth.admin.createUser({
        email: email,
        email_confirm: true,
        password: password,
        user_metadata: { role: role ,
        username:userName},
      });

      if (error) {
        console.error("Error creating user:", error.message);
        setError(error.message);
      } else {
        console.log("User created successfully:");
        setSuccess("The account has been successfully created")
        clear()
      }
    } catch (error) {}
  };
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={t('UserName')}
        style={styles.Input}
        placeholderTextColor="#BEC2C2"
        value={userName}
        onChangeText={(val) => {
          setUserName(val);
        }}
      />
      <TextInput
        placeholder={t('email')}
        style={styles.Input}
        placeholderTextColor="#BEC2C2"
        value={email}
        onChangeText={(val) => {
          setEmail(val);
        }}
      />


      <TextInput
        placeholder={t('password')}
        style={styles.Input}
        placeholderTextColor="#BEC2C2"
        value={password}
        onChangeText={(val) => {
          setPassword(val);
        }}
      />

      <Picker
        style={{ color: "white" }}
        prompt="Role:"
        mode="dialog"
        dropdownIconColor={"white"}
        dropdownIconRippleColor={"colors.third"}
        selectedValue={role}
        onValueChange={(val, itemIndex) => setRole(val)}
      >
        <Picker.Item label="Admin" value="admin" />
        <Picker.Item label="Creator" value="creator" />
        <Picker.Item label="User" value="user" />
      </Picker>

      <TouchableOpacity
        style={styles.Btn}
        onPress={() => {
          AddUser();
        }}
      >
        <Text style={{ fontSize: 25, color: colors.primary }}>{t('Adduser')}</Text>
        <AntDesign name="adduser" size={35} color={colors.primary} />
      </TouchableOpacity>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>{success}</Text> : null}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "70%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "10%",
    backgroundColor: colors.third,
    padding: 20,
    borderRadius: 16,
    elevation: 100
  },
  Input: {
    fontSize: 20,
    marginBottom: "13%",
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    padding: 10,
    color: "#ffff",
  },
  Btn: {
    marginTop: "1%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.third,
    padding: 8,
    justifyContent: "center",
    borderRadius: 16,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  error: {
    textAlign: "center",
    marginTop: "5%",
    color: "red",
    fontSize: 15,
  },
  success:{
    textAlign:"center",
marginTop:"5%",
color:"green",
  }
});
