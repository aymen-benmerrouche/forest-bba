import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import colors from "../shared/colors";
import { MaterialIcons } from "@expo/vector-icons";
import AddUser from "../components/addUser";
import DeleteUser from "../components/deleteUser";
import i18next from '../../services/i18next';
import { useTranslation } from "react-i18next";

export default function AdminPanel() {
  const [showAddUser, setShowAddUser] = useState(true);
  const [showDeleteUser, setShowDeleteUser] = useState(false);
  const {t} = useTranslation();
  const handleAddUserClick = () => {
    setShowAddUser(true);
    setShowDeleteUser(false);
  };

  const handleDeleteUserClick = () => {
    setShowAddUser(false);
    setShowDeleteUser(true);
  };
  return (
    <ImageBackground
      style={{ flex: 1 }}
      source={require("../images/background.jpg")}
    >
      <KeyboardAvoidingView
        keyboardVerticalOffset={150}
        behavior="padding"
        style={styles.container}
      >
        <View style={styles.logoView}>
          <MaterialIcons
            name="admin-panel-settings"
            size={110}
            color={colors.primary}
            style={{
              textShadowColor: "rgba(0, 0, 0, 0.75)",
              textShadowOffset: { width: -1, height: 1 },
              textShadowRadius: 10,
            }}
          />
          <Text
            style={{
              color: colors.primary,
              fontSize: 40,
              fontWeight: "bold",
              textShadowColor: "rgba(0, 0, 0, 0.75)",
              textShadowOffset: { width: -1, height: 1 },
              textShadowRadius: 10,
            }}
          >
            {t('AdminPanel')}
          </Text>
        </View>

        <View style={styles.addUserView}>
          <TouchableWithoutFeedback onPress={handleAddUserClick}>
            <View
              style={{
                borderBottomWidth: showAddUser ? 3 : 0,
                borderBottomColor: colors.third,
              }}
            >
              <Text style={styles.textt}>{t('AddUser')}</Text>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={handleDeleteUserClick}>
            <View
              style={{
                borderBottomWidth: showDeleteUser ? 3 : 0,
                borderBottomColor: colors.third,
              }}
            >
              <Text style={styles.textt}>{t('DeleteUser')}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

        {showAddUser && <AddUser />}
        {showDeleteUser && <DeleteUser />}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginTop: -100,
  },
  logoView: {
    alignItems: "center",
    marginTop: "16%",
  },
  addUserView: {
    width: "70%",
    marginLeft: "auto",
    marginRight: "auto",
    flexDirection: "row",
    marginTop: "10%",
    justifyContent: "space-around",
  },
  textt: {
    fontSize: 25,
    color: colors.primary,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  InputForm: {
    fontSize: 20,
    marginBottom: "13%",
    borderBottomWidth: 1,
    borderBottomColor: "#BEC2C2",
    padding: 10,
    color: "#ffff",
  },
});
