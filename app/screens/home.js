import { View, Text, Button, TextInput, KeyboardAvoidingView, Platform, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase';
import { Session } from '@supabase/supabase-js/dist/module';
import i18next from '../../services/i18next';
import { useTranslation } from "react-i18next";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Home({session}) {
  const [lng, setLng] = useState('');

  const storeDataAr = async (lng) => {
      await AsyncStorage.setItem('lng', lng);
      console.log('Data saved successfully!');
  };


  const {t} = useTranslation();
  const data = session;
  const role = session.user.user_metadata.role;

 
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


  return (
    <View>



      
      
      <Text>{role}</Text>
      <Button title={t('signOut')} onPress={() => supabase.auth.signOut()} />
      <Button title={t('arabic')} onPress={() => { i18next.changeLanguage("ar")
    setLng("ar")
    storeDataAr("ar")
  
    }} />
      <Button title={t('english')} onPress={() => { i18next.changeLanguage("en")
   setLng("en")
   
   storeDataAr("en")
   
    }} />
    
    <Button title={t('word')} onPress={ async() => { console.log(await AsyncStorage.getItem("lng"))}} />
     
      
    

    </View>
    
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInput: {
    height: 40,
    borderColor: '#000000',
    borderBottomWidth: 1,
    marginTop:600,
  },
});