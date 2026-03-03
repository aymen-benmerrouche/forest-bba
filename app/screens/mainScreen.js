import { View, Text, Dimensions } from "react-native";
import React from "react";
import Home from "./home";
import Animals from "./Animals";
import Plants from "./plants";
import AdminPanel from "./AdminPanel";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import colors from "../shared/colors";
import { MaterialIcons } from "@expo/vector-icons";
import Settings from "./Settings";
import Addpost from "./addpost";
import i18next from '../../services/i18next';
import { useTranslation } from "react-i18next";

const Tab = createBottomTabNavigator();

export default function mainScreen({ session }) {
  const role = session.user.user_metadata.role;
  const {t} = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1BC27A",
        tabBarInactiveTintColor: "#ffff",
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: colors.third,
          paddingTop: 0,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          borderLeftWidth: 0.2,
          borderRightWidth: 0.2,
          position: "absolute",
          overflow: "hidden",
          borderTopWidth: 0,
          height: 55,
        },
      }}
    >
      <Tab.Screen
        name={t('Animals')}
        children={() => <Animals session={session} />}
        options={{
          tabBarIcon: ({ color }) => (
            <Fontisto name="paw" size={30} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name={t('Plants')}
        children={() => <Plants session={session} />}
        options={{
          tabBarIcon: ({ color }) => (
            <Foundation name="trees" size={45} color={color} />
          ),
        }}
      />

      {role == "admin" || role === 'creator' ? (
        <Tab.Screen
          name= {t('creatpost')}
          children={() => <Addpost session={session} />}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="add-circle-outline" size={44} color={color} />
            ),
          }}
        />
      ) : null}
      <Tab.Screen
        name={t('Settings')}
        children={() => <Settings session={session} />}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="settings" size={35} color={color} />
          ),
        }}
      />
      {role === "admin" ? (
        <Tab.Screen
          name={t('AdminPanel')}
          children={() => <AdminPanel session={session} />}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialIcons
                name="admin-panel-settings"
                size={35}
                color={color}
              />
            ),
          }}
        />
      ) : null}
    </Tab.Navigator>
  );
}
