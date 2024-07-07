import React, { ReactNode } from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView, { Region } from "react-native-maps";
import LocationMarker from "./LocationMarker";
import { Button } from "../ui/Button";
import Icon from "react-native-vector-icons/MaterialIcons";
import { twMerge } from "tailwind-merge";

type SharedMapProps = {
  mapRef: React.RefObject<MapView>;
  currentRegion: Region;
  setCurrentRegion: (region: Region) => void;
  marker: Region | null;
  loading: boolean;
  onPanDrag: () => void;
  toggleAutoCenter: () => void;
  navigation?: any;
  children?: ReactNode;
  testid?: string;
  mapType: "operator" | "user";
  bottomRightButtonText?: string;
};

const SharedMap: React.FC<SharedMapProps> = ({
  mapRef,
  currentRegion,
  setCurrentRegion,
  marker,
  loading,
  onPanDrag,
  toggleAutoCenter,
  navigation,
  children,
  testid,
  mapType,
  bottomRightButtonText,
}) => {
  return (
    <View style={StyleSheet.absoluteFillObject}>
      <MapView
        onPanDrag={onPanDrag}
        testID={testid}
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={currentRegion}
        onRegionChangeComplete={(region: Region) => setCurrentRegion(region)}
      >
        {marker && <LocationMarker coordinate={marker} />}
        {children}
      </MapView>

      {loading && (
        <View
          className={twMerge("flex-1 justify-center items-center")}
          style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
        >
          <Text>Loading your location...</Text>
        </View>
      )}

      <>
        <Button
          testID="my-location-button"
          className={`absolute top-[60px] right-[30px] w-16 h-16 shadow-md ${loading ? "bg-transparent" : "bg-white"}`}
          style="secondary"
          onPress={toggleAutoCenter}
        >
          <Icon
            name="my-location"
            size={24}
            color={loading ? "transparent" : "#000"}
          />
        </Button>

        <Button
          testID="user-drawer-button"
          className={`absolute top-[60px] left-[30px] w-16 h-16 shadow-md ${loading ? "bg-transparent" : "bg-white"}`}
          onPress={() => {
            if (!loading) {
              navigation.toggleDrawer({
                latitude: currentRegion.latitude,
                longitude: currentRegion.longitude,
              });
            }
          }}
          style="secondary"
        >
          <Icon
            name="menu"
            size={24}
            color={loading ? "transparent" : "#000"}
          />
        </Button>

        {mapType === "user" && (
          <Button
            testID="order-button"
            className={`absolute bottom-[40px] right-[30px] w-[100px] h-16 shadow-md ${loading ? "opacity-0" : ""}`}
            onPress={() => {
              if (!loading) {
                navigation.navigate("OrderMenu", {
                  latitude: currentRegion.latitude,
                  longitude: currentRegion.longitude,
                });
              }
            }}
            style="primary"
            text={bottomRightButtonText}
          />
        )}
      </>
    </View>
  );
};

export default SharedMap;
