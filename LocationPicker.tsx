import React, { useEffect, useState } from "react";
import { View, Text, Modal, TextInput } from "react-native";
import MapView, { Region } from "react-native-maps";
import { downloadTiles } from "./DownloadTiles";
import { Button } from "../../../ui/Button";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as FileSystem from "expo-file-system";
import { LocationType, DEFAULT_LOCATION } from "../hooks/useLocation";
import { twMerge } from "tailwind-merge";
import { StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

const LocationPicker: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useTranslation();

  const [region, setRegion] = useState<LocationType>(DEFAULT_LOCATION);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [initialLocationLoaded, setInitialLocationLoaded] = useState(false);
  const [mapName, setMapName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const fileUri = `${FileSystem.documentDirectory}/location.json`;
        const fileExists = await FileSystem.getInfoAsync(fileUri);

        if (fileExists.exists) {
          const fileContent = await FileSystem.readAsStringAsync(fileUri);
          const location = JSON.parse(fileContent);
          setRegion(location);
        }
        setInitialLocationLoaded(true);
      } catch (error) {
        console.error("Error reading location file:", error);
        setInitialLocationLoaded(true);
      }
    };

    fetchLocation();
  }, []);

  const handleRegionChangeComplete = (region: Region) => {
    setRegion(region);
  };

  const handleSaveLocation = async (name: string) => {
    setIsLoading(true);
    await downloadTiles(region, `${name}`, (progress) => {
      setDownloadProgress(progress);
    });
    setIsLoading(false);
    navigation.goBack();
  };

  return (
    <View style={StyleSheet.absoluteFillObject}>
      {initialLocationLoaded && (
        <MapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={region}
          onRegionChangeComplete={handleRegionChangeComplete}
        />
      )}
      <View className="absolute top-1/2 left-1/2 -ml-6 -mt-12">
        <Icon name="location-on" size={48} color="black" />
      </View>
      <Button
        testID="user-drawer-button"
        style="secondary"
        className={twMerge(
          "absolute top-[60px] left-[30px] w-24 h-12 shadow-md bg-white",
          "secondary"
        )}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Text className={twMerge("text-lg text-center text-black font-bold")}>
          Cancel
        </Text>
      </Button>
      <Button
        text={t("offline-map.location-picker.save-map")}
        onPress={() => setModalVisible(true)}
        className={twMerge(
          "absolute bottom-[40px] right-[30px] w-[120px] h-16 shadow-md",
          "primary"
        )}
        style="primary"
      />
      {isLoading && <LoadingScreen progress={downloadProgress} />}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <View className="bg-white p-5 rounded-lg w-4/5 items-center">
            <Text className="text-lg font-bold mb-2.5">
              {t("offline-map.location-picker.alert-title")}
            </Text>
            <TextInput
              testID="map-name-input"
              className="w-full p-2.5 border border-gray-400 rounded-lg mb-5"
              placeholder={t("offline-map.location-picker.alert-message")}
              value={mapName}
              onChangeText={setMapName}
              maxLength={30}
            />
            <Text className="self-end mb-2.5 text-xs text-gray-500">
              {`${mapName.length}/30`}
            </Text>
            <View className="flex-row justify-center w-1/2">
              <Button
                text={t("offline-map.location-picker.cancel")}
                onPress={() => setModalVisible(false)}
                className={twMerge("mr-4")}
                style="secondary"
              />
              <Button
                text={t("offline-map.location-picker.OK")}
                onPress={async () => {
                  if (mapName) {
                    setModalVisible(false);
                    await handleSaveLocation(mapName);
                  }
                }}
                style="primary"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const LoadingScreen = ({ progress }: { progress: number }) => {
  const { t } = useTranslation();

  return (
    <View
      className="absolute inset-0 bg-black justify-center items-center"
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="text-white text-lg mb-2.5">
        {t("offline-map.location-picker.downloading-tiles")}
      </Text>
      <View className="w-4/5 h-2.5 bg-gray-200 rounded-lg mb-2.5">
        <View
          className="h-full bg-green-500 rounded-lg"
          style={{ width: `${progress * 100}%` }}
        />
      </View>
      <Text className="text-white text-base">
        {`${Math.round(progress * 100)}%`}
      </Text>
    </View>
  );
};

export default LocationPicker;
