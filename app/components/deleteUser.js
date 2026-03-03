import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from "../../lib/supabase";
import colors from '../shared/colors'
import { AntDesign } from '@expo/vector-icons';
import i18next from '../../services/i18next';
import { useTranslation } from "react-i18next";

export default function DeleteUser() {
function clear(){
setEmail("")
}

    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState("");
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

const deleteuser = async()=>{
    try {
        const { data, error } = await supabase.rpc("delete_user_by_email", {
          email: email.toLowerCase(),
        });

        if (error) {
          console.error("Error deleting user:", error.message);
          setError(error.message)
          clear()
        } else {
          console.log("User deleted successfully:");
          setSuccess("The account has been successfully deleted")
          clear()
        }
      } catch (e) {
        console.error("An unexpected error occurred:", e.message);
      }

}
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={t('email')} 
        style={styles.Input}
        placeholderTextColor="#BEC2C2"
        value={email}
        onChangeText={(val)=>{setEmail(val)}}
      />

<TouchableOpacity style={styles.Btn} onPress={()=>{
        deleteuser()
        
      }}>
        <Text style={{ fontSize: 25 , color:colors.primary}}>{t('Deleteuser')} </Text>
        <AntDesign name="deleteuser" size={35} color={colors.primary} />
      </TouchableOpacity>

    {error? (<Text style={styles.error}>{error}</Text>): null}
    {success? (<Text style={styles.success}>{success}</Text>): null}
    </View>
  )
}
const styles = StyleSheet.create({
    container: {
        width: "70%",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "10%",
        backgroundColor:colors.third,
        padding:20,
        borderRadius:16
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
        
        padding:8,
        justifyContent:"center",
        borderRadius:16,
        backgroundColor:colors.third,
        borderColor:colors.primary,
        borderWidth:1
      },
      error:{
        textAlign:"center",
        marginTop:"5%",
        color:"red",
        
        fontSize:15
          },
          success:{
            textAlign:"center",
        marginTop:"5%",
        color:"green",
          }
    
})