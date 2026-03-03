import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import colors from "../shared/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import uuid from "react-native-uuid";
import { supabase } from "../../lib/supabase";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import i18next from '../../services/i18next';
import { useTranslation } from "react-i18next";

export default function Addpost({ session }) {
  const [isDisabled, setisDisabled] = useState(true);
  const [imageuri, setimageuri] = useState("");
  const [imagee, setimagee] = useState("");
  const [photoname, setphotoname] = useState("");
  const [data, setData] = useState("");
  const [titel, setTitel] = useState("");
  const [disc, setDisc] = useState("");
  const [modal, setModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const {t} = useTranslation();
  const photoProfile = session.user.user_metadata.image_url;
  const userName = session.user.user_metadata.username;
  //location
  useEffect(() => {
    const userLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
  
      let location = await Location.getCurrentPositionAsync({
        enaenablehighaccuracy: true,
      });
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setSelectedLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    };
    userLocation()
  }, []);

  const [mapRegion, setMapRegion] = useState({
    latitude: 28.0339,
    longitude: 1.6596,
    latitudeDelta: 15,
    longitudeDelta: 15,
  });

  const handleMapPress = (event) => {
    setSelectedLocation({
      latitude: event.nativeEvent.coordinate.latitude,
      longitude: event.nativeEvent.coordinate.longitude,
    });
  };

  const userLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({
      enaenablehighaccuracy: true,
    });
    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    setSelectedLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };


  //Finelocation

  useEffect(() => {
    setphotoname(uuid.v4());
  }, []);

  // clear function
  const clear = () => {
    setTitel("");
    setDisc("");
    setimageuri("");
    setData("");
    setimagee("");
  };

  // clear function

  useEffect(() => {
    if (imageuri && titel && disc && data) {
      setisDisabled(false);
    } else {
      setisDisabled(true);
    }
  }, [imageuri, titel, disc, data]);

  //uplode photo function
  async function image() {
    await ImagePicker.requestCameraPermissionsAsync();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3.5, 4.5],
      quality: 1,
    });

    console.log(result.assets[0].size);

    if (!result.canceled) {
      setimageuri(result.assets[0].uri);
      setimagee(result.assets[0]);
    }
  }

  //post function

  //cdn
  const cdnPlants =
    "https://gkcogetdjfokkfiazefy.supabase.co/storage/v1/object/public/ForstBba/PlantsPosts/";

  const cdnAnimals =
    "https://gkcogetdjfokkfiazefy.supabase.co/storage/v1/object/public/ForstBba/AnimalsPost/";
  //cdn

  //animalsposts
  const postAnimals = async () => {
    setphotoname(uuid.v4());
    setisDisabled(true);
    setIsUploading(true);
    const arraybuffer = await fetch(imagee.uri).then((res) =>
      res.arrayBuffer()
    );

    const photo = imageuri;

    const { error } = await supabase.storage
      .from("ForstBba")
      .upload("AnimalsPost/" + photoname + ".jpg", arraybuffer);

    if (error) {
      console.log(error);
    } else {
      console.log("done");
    }

    async function addToTable() {
      const { dats, error } = await supabase.from("AnimalsPosts").insert({
        titel: titel,
        description: disc,
        image_url: cdnAnimals + photoname + ".jpg",
        longitude: selectedLocation.longitude,
        latitude: selectedLocation.latitude,
        username: userName,
        profile_photo: photoProfile,
      });
      if (error) {
        console.log(error);
      } else {
        console.log("done");
        setModal(true);
      }
    }
    addToTable();

    setIsUploading(false);
  };
  //animalsposts

  //plantspost
  const postPlants = async () => {
    setisDisabled(true);
    setIsUploading(true);
    const arraybuffer = await fetch(imagee.uri).then((res) =>
      res.arrayBuffer()
    );

    const photo = imageuri;
    setphotoname(uuid.v4());
    const { error } = await supabase.storage
      .from("ForstBba")
      .upload("PlantsPosts/" + photoname + ".jpg", arraybuffer);

    if (error) {
      console.log(error);
    } else {
      console.log("done");
    }

    async function addToTable() {
      const { dats, error } = await supabase.from("PlantsPosts").insert({
        titel: titel,
        description: disc,
        image_url: cdnPlants + photoname + ".jpg",
        longitude: selectedLocation.longitude,
        latitude: selectedLocation.latitude,
        username: userName,
        profile_photo: photoProfile,
      });
      if (error) {
        console.log(error);
      } else {
        console.log("done");
        setModal(true);
      }
    }
    addToTable();
    setIsUploading(false);
  };

  //plantspost
  //
  
  return (
    <View style={{ flex: 0, alignItems: "center", justifyContent: "center" }}>
      <View style={styles.modal}>
        {isUploading ? (
          <ActivityIndicator size={"large"} animating={isUploading} />
        ) : null}
        

        <Text
          style={{
            textAlign: "center",
            fontSize: 35,
            fontWeight: "bold",
            color: colors.secnd,
          }}
        >
          {t('Creatapost')}
        </Text>
        <TextInput
          placeholder={t('titel')}
          style={styles.textt}
          value={titel}
          onChangeText={setTitel}
        />
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          placeholder={t('EnteryourT')}
          value={disc}
          onChangeText={setDisc}
        />
        <MaterialIcons
          name="add-photo-alternate"
          size={40}
          color={colors.secnd}
          style={{ marginTop: "2%" }}
          onPress={() => {
            image();
          }}
        />
        {imageuri ? (
          <View>
            <Image
              source={{ uri: imageuri }}
              style={{
                width: 150,
                height: 90,
                borderRadius: 5,
                marginTop: "5%",
              }}
              resizeMode="center"
            />
            <View style={styles.iconContainer}>
              <FontAwesome6
                name="delete-left"
                size={24}
                color={colors.secnd}
                onPress={() => {
                  setimageuri(null);
                  setimagee(null);
                }}
              />
            </View>
          </View>
        ) : null}

        <View style={styles.data}>
          <TouchableOpacity
            style={[
              styles.btn,
              { backgroundColor: data === "animals" ? colors.secnd : null },
            ]}
            onPress={() => {
              setData("animals");
            }}
          >
            <Text style={styles.dataText}>{t('Animals')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.btn,
              { backgroundColor: data === "plants" ? colors.secnd : null },
            ]}
            onPress={() => {
              setData("plants");
            }}
          >
            <Text style={styles.dataText}>{t('Plants')}</Text>
          </TouchableOpacity>
        </View>
        <MapView style={styles.map} onPress={handleMapPress} region={mapRegion}  provider={PROVIDER_GOOGLE}>
          {selectedLocation && (
            <Marker
              coordinate={{
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
              }}
            />
          )}
        </MapView>

        <TouchableOpacity
          style={{
            borderRadius: 16,
            marginTop: "1%",
            marginRight: "auto",
            marginLeft: "auto",
            borderColor: colors.third,
            width: "50%",
          }}
          onPress={() => {
            userLocation();
          }}
        >
          <Text style={[styles.text, { color: "#1BC27A" }]}>
          {t('mylocation')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={isDisabled}
          style={{
            backgroundColor: colors.secnd,
            padding: 10,
            borderRadius: 16,
            marginTop: "3%",
          }}
          onPress={() => {
            if (data === "animals") {
              postAnimals();
            } else {
              postPlants();
            }
          }}
        >
          <Text style={styles.text}>{t('Submit')}</Text>
        </TouchableOpacity>

        <Modal
          visible={modal}
          transparent
          onRequestClose={() => {
            setModal(false);
          }}
        >
          <View style={styles.modalBackGround}>
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              style={styles.modalContainer}
            >
              <View style={{ alignItems: "center" }}>
                <Image
                  source={require("../images/success.png")}
                  style={{ width: 120, height: 120 }}
                />
                <Text style={{ marginTop: "5%", fontWeight: "500" }}>
                  The post has been published successfully{" "}
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#1BC27A",
                    padding: 10,
                    borderRadius: 16,
                    marginTop: "8%",

                    borderColor: colors.third,
                    width: "100%",
                  }}
                  onPress={() => {
                    setModal(false);
                    clear();
                  }}
                >
                  <Text style={styles.text}>Close</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    marginTop: "1%",
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    borderWidth: 2,
    padding: 10,
    borderRadius: 5,
    borderTopRightRadius: 100,
    overflow: "hidden",
    borderColor: colors.secnd,
    backgroundColor: "white",
    elevation: 10,
  },
  text: {
    textAlign: "center",
    color: colors.primary,
    color: "black",
    fontWeight: "500",
  },
  close: {
    position: "absolute",
    right: 0,
    top: -30,
  },

  iconContainer: {
    position: "absolute",
    top: 15, // Adjust this value to position the icon vertically
    left: 1, // Adjust this value to position the icon horizontally
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.secnd,
    padding: 10,
    width: "100%",
    height: 150,
    textAlignVertical: "top",
    borderRadius: 16,
  },
  textt: {
    borderWidth: 1,
    borderColor: colors.secnd,
    marginBottom: "8%",
    padding: 10,
    borderRadius: 16,
    marginTop: "3%",
  },
  data: {
    marginTop: "3%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  btn: {
    borderColor: colors.third,
    width: "40%",
    borderWidth: 1,
    padding: 10,
    borderRadius: 16,
  },
  dataText: {
    textAlign: "center",
  },
  modalBackGround: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
  map: {
    marginTop: "3%",
    width: "80%",
    height: "20%",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 16,
  },
  selectedLocationContainer: {
    position: "absolute",
    bottom: 20,
    left: 10,
    right: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    elevation: 5,
  },
});
