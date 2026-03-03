import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Button,
  FlatList,
  RefreshControl,
  Linking
} from "react-native";
import React, { useState, useEffect } from "react";
import colors from "../shared/colors";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import i18next from "../../services/i18next";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../lib/supabase";
import { Entypo } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { AntDesign } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut, FadeInDown} from "react-native-reanimated";
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

export default function Animals({ session }) {


 //time
 const formatTime = (time) => {
  return formatDistanceToNow(new Date(time), { addSuffix: true });
};
//fine time

//openmap

const openMapApp = (latitude,longitude) => {
if (latitude,longitude){
  const url = `http://maps.apple.com/?q=${latitude},${longitude}`;
  Linking.openURL(url);
}
else console.log("no location") ;
  
  

};
//fine openmap

  //
  const renderEmptyComponent = () => (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
     <MaterialCommunityIcons name="emoticon-sad-outline" size={80} color={colors.primary} />
      <Text style={{ marginTop: 10, fontSize:30, color:colors.primary } }>{t('empty')} </Text>
    </View>
  );
  //

  //search
  const searchFilter = (text) => {
    if (text) {
      const newdata = posts.filter((item) => {
        const itemdata = item.titel
          ? item.titel.toUpperCase()
          : "".toUpperCase();
        const textdata = text.toUpperCase();
        return itemdata.indexOf(textdata) > -1;
      });
      setfiltredPosts(newdata);
      setSearch(text);
    } else {
      setfiltredPosts(posts);
      setSearch(text);
    }
  };
  //search

  const [posts, settposts] = useState([]);
  const [filtredPosts, setfiltredPosts] = useState([]);
  const [coments, setComents] = useState([]);
  const [comentModal, setcomentModal] = useState(false);
  const [postId, SetPostid] = useState("");
  const [inputComnet, setInputComent] = useState("");
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [sortedData, setSortedData] = useState([]);
  const { t } = useTranslation();
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const photoProfile = session.user.user_metadata.image_url;
  const userName = session.user.user_metadata.username;
  //toggleDescription
  const toggleDescription = (postId) => {
    setExpandedDescriptions((prevExpandedDescriptions) => ({
      ...prevExpandedDescriptions,
      [postId]: !prevExpandedDescriptions[postId],
    }));
  };
  //toggleDescription
  const handleRefresh = async () => {
    await getposts();
    setRefreshing(true);

    setRefreshing(false);
  };

  // get posts

  useEffect(() => {
    getposts();
  }, []);

  const getposts = async () => {
    const { data, error } = await supabase.from("PlantsPosts").select();

    if (error) {
      console.error("Error fetching data:", error.message);
      return;
    }
    const sorted = [...data].sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });
    settposts(sorted);
    setfiltredPosts(sorted);
    handleRefresh;
  };

  // get posts

  // auto change laungage
  useEffect(() => {
    const Language = async () => {
      if ((await AsyncStorage.getItem("lng")) === "ar") {
        i18next.changeLanguage("ar");
      } else {
        i18next.changeLanguage("en");
      }
    };
    Language();
  }, []);
  // auto change laungage



  // delete row 
  const role = session.user.user_metadata.role;
  const deleteRow = async (post_id) => {
    try {
      let { data, error } = await supabase
        .from('PlantsPosts') 
        .delete()  
        .eq('post_id', post_id); 

      if (error) {
        throw error;
      }

      console.log('Success', 'Row deleted successfully');
      getposts()
    } catch (error) {
      console.log('Error', error.message);
    }
  };
  // delete row



  //coment function

const coment =async(postid)=>{
  SetPostid(postid);
  await getcoments()
 setcomentModal(true);
 
 }
 
 
 
 const getcoments = async () => {
   const { data, error } = await supabase.from("Comments")
   .select()
   .eq("post_id", postId);
 
   if (error) {
     console.error("Error fetching data:", error.message);
     return;
   }
   const sorted = [...data].sort((a, b) => {
     return new Date(b.created_at) - new Date(a.created_at);
   });
   setComents(sorted);
   
 };
 
 useEffect(() => {
   if (postId) {
     getcoments();
   }
 }, [postId,comentModal]);
 
 
 //
 async function addcoment() {
   const { dats, error } = await supabase.from("Comments").insert({
     text: inputComnet,
     post_id:postId,
     profile_photo:photoProfile,
     user_name:userName
   });
   if (error) {
     console.log(error);
   } else {
     console.log("done");
     
   }
   setInputComent("")
   getcoments()
   
 }
 
 
 
   // fin coment function
 

  return (
    <View style={styles.container}>
      <View>
        <Text
          style={{
            textAlign: "center",
            fontWeight: "bold",
            marginTop: "5%",
            marginBottom: "2%",
            fontSize: 20,
            color: colors.primary,
          }}
        >
          {t('plantsSection')}
        </Text>
      </View>

      <FlatList
        data={filtredPosts}
        ListEmptyComponent={renderEmptyComponent}
        renderItem={({ item, index }) => (
          <View style={styles.postContainer}>
            <View style={styles.post}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 2 }}
              >
                <Image
                 source={item.profile_photo ? { uri: item.profile_photo } : require('../images/logoo.png')}
                  style={{
                    width: 38,
                    height: 38,
                    resizeMode: "cover",
                    borderRadius: 50,
                  }}
                />

<View>
                  <Text style={{ color: colors.primary, fontSize: 15 }}>
                    {item.username}
                  </Text>
                  <Text style={{ color: "grey", fontSize: 15 }}>{formatTime(item.created_at)}</Text>
                </View>
              </View>
              <Entypo
                name="dots-three-vertical"
                size={25}
                color={colors.primary}
                style={{ position: "absolute", right: 1, top: 8 }}
              />
              <Text style={styles.titel}>{item.titel}</Text>

              <Image
                source={{ uri: item.image_url }}
                style={{
                  width: "100%",
                  height: 450,
                  resizeMode: "cover",
                  borderRadius: 16,
                  alignSelf: "center",
                }}
              />

              {item.description.length > 50 ? (
                <TouchableOpacity
                  onPress={() => toggleDescription(item.post_id)}
                >
                  <Text style={styles.dics}>
                    {expandedDescriptions[item.post_id]
                      ? item.description
                      : `${item.description.slice(0, 40)}...`}
                    <Text style={{ color: "grey" }}>
                      {" "}
                      {expandedDescriptions[item.post_id]
    ? <Text>{t('Seeless')}</Text>
    : <Text>{t('Seemore')}</Text>}
                    </Text>
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.dics}>{item.description}</Text>
              )}
            </View>
            <View style={{flexDirection:"row"}}>
            <TouchableOpacity
              style={{
                flexDirection: "row-reverse",
                alignItems: "center",
                justifyContent: "flex-end",
                marginBottom: "2%",
                marginRight: "2%",
                flexGrow:1
              }}
              onPress={() => {
                openMapApp(item.latitude, item.longitude);
              }}
            >
              <Text style={{ color: "#1BC27A" }}>{t("showMap")} </Text>
              <MaterialCommunityIcons
                name="map-marker-radius"
                size={24}
                color="#1BC27A"
              />
            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection:"row",alignItems:'center', gap:5, marginLeft:"2%",marginBottom:"2%", flexGrow:0.1}}
             onPress={()=>{
              coment(item.post_id)
             }}
             >
             
              <FontAwesome name="comment" size={24} color="#1BC27A" />
              <Text style={{color:"#1BC27A"}}>{t('comments')}</Text>
             </TouchableOpacity>
             {role == "admin" ? (
  <TouchableOpacity style={{flexDirection:"row",alignItems:'center', gap:5, marginLeft:"2%",marginBottom:"2%", flexGrow:0.1}}
     onPress={() => deleteRow(item.post_id)}>
    <AntDesign
      name="delete"
      size={25}
      color="#1BC27A"
      style={{}}
      onPress={() => deleteRow(item.post_id)}
    />
    <Text style={{color:"#1BC27A"}}>{t('deletepost')}</Text>
  </TouchableOpacity>
) : null}
            </View>
             
          </View>
        )}
        keyExtractor={(item, index) => item.post_id}
        style={{ marginBottom: "0%" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={
          <View style={styles.scrollView}>
            <View style={styles.SearchBar}>
              <FontAwesome5 name="search" size={24} color={colors.primary} />
              <TextInput
                placeholder={t('searchInPlants')}
                placeholderTextColor={colors.primary}
                style={{ color: "white" }}
                value={search}
                onChangeText={(text) => {
                  searchFilter(text);
                }}
              />
            </View>
          </View>
        }
        ItemSeparatorComponent={<View style={{ height: 20 }}></View>}
        ListFooterComponent={<View style={{ height: 60 }}></View>}
      />
      <Modal
      visible={comentModal}
      transparent
      onRequestClose={() => {
        setcomentModal(false);
      }}
    >
      <View style={styles.modalBackGround}>
        <Animated.View
          entering={FadeInDown.duration(200).delay(100).springify()}
          exiting={FadeOut}
          style={styles.modalContainer}
        >
         
          <Text style={{color:colors.primary, fontSize:26, fontWeight:"bold", textAlign:"center", marginBottom:"2%"}}>{t('comments')}</Text>
          <View
           
            
          >
            <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
            removeClippedSubviews={false}
            contentContainerStyle={styles.flatListContent}
              data={coments}
              renderItem={({ item }) => (
                <View
                style={{ flexDirection: "row", alignItems: "center", gap: 5, marginBottom:"5%"}}
              >
                               <Image
                  source={
                   
                      { uri: item.profile_photo }
                      
                  }
                  style={{
                    width: 38,
                    height: 38,
                    resizeMode: "cover",
                    borderRadius: 50,
                  }}
                />
                <View style={{backgroundColor:"#255755" , flexGrow:1, padding:10, borderRadius:16}}>
                  <Text style={{color: colors.primary, fontSize: 15, fontWeight:"bold"}}>{item.user_name}</Text>
                <Text style={{ color: colors.primary, fontSize: 14 , flexGrow:1}}>
                    {item.text}
                  </Text>
                </View>
                
                 

</View>
              )}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={
                <View style={{flexDirection:"row", alignItems:"center", gap:10, marginTop:"5%",  }}>
                   <TextInput
                  style={{backgroundColor:"#255755",  padding:7, borderRadius:16, flexGrow:1, borderColor:colors.primary, color:colors.primary} }
                  onChangeText={setInputComent}
                  value={inputComnet}
                  placeholder={t('addyourcomment')}
                  placeholderTextColor={"#fff8"}
                />
                <Ionicons name="send" size={24} color="#255755" onPress={()=>{addcoment()}}/>

                </View>
               
              }
              
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.third,
  },
  SearchBar: {
    marginTop: "3%",
    marginBottom: "5%",
    flexDirection: "row",
    backgroundColor: "rgba(124, 154, 146, 0.5)",
    padding: 10,
    borderRadius: 16,
    gap: 10,
  },
  scrollView: {
    width: "90%",
    marginRight: "auto",
    marginLeft: "auto",
  },
  postContainer: {
    backgroundColor: "#203534",
    width: "95%",
    marginLeft: "auto",
    marginRight: "auto",
    elevation: 30,
    borderRadius: 16,
  },
  post: {
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    padding: 10,
  },
  touchableOpacity: {
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 16,
  },
  dics: {
    color: colors.primary,
    marginTop: "2%",
  },

  titel: {
    color: colors.primary,
    fontSize: 30,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    marginBottom: "2%",
    marginLeft: "5%",
  },
  modalBackGround: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "95%",
    backgroundColor: "#203534",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,


  },
  flatListContent: {
    paddingBottom: 50, // Ensures space for keyboard
  },
});
