import { SafeAreaView, StyleSheet, View } from "react-native";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { Session } from "@supabase/supabase-js";
import MainScreen from "./app/screens/mainScreen";
import Login from "./app/screens/login";
import Home from "./app/screens/home";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import { NavigationContainer } from '@react-navigation/native';




export default function App() {
  const [session, setSession] = useState(null);
  useEffect(() => {
    supabase.auth.getSession().then(function (result) {
      var session = result.data.session;
      setSession(session);
    });

    supabase.auth.onAuthStateChange(function (_event, session) {
      setSession(session);
    });
  }, []);

  return (
    <NavigationContainer>
<SafeAreaView style={styles.continar}>
      <View style={{ flex: 1 }}>
        {session && session.user ? (
          <MainScreen key={session.user.id} session={session} />
        ) : (
          <Login />
        )}
      </View>
      <StatusBar style="dark" translucent={true} hidden={false} />
    </SafeAreaView>
    </NavigationContainer>


   
    
  );
}
const styles = StyleSheet.create({
  continar: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
});
