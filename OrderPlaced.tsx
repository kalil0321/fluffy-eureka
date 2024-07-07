import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import "../global.css";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types/RootStackParamList";
import Icon from "react-native-vector-icons/Fontisto";
import TriangleBackground from "../../components/TriangleBackground";
import { Animated } from "react-native";
import { secureRandom } from "../../utils/random";
import FirestoreManager from "../../services/FirestoreManager";
import { Item } from "../../types/Item";
import { OrderLocation } from "../../types/Order";
import { images } from "../../types/ProductButtons";

import { useTranslation } from "react-i18next";

const OrderPlaced = ({
  navigation,
  route,
}: {
  navigation: any;
  route: RouteProp<RootStackParamList, "OrderPlaced">;
}) => {
  const { orderId } = route.params;
  const { t } = useTranslation();

  const [fadeAnim] = useState(new Animated.Value(0));
  const firestoreManager = new FirestoreManager();

  const [orderedItem, setOrderedItem] = useState<Item>();
  const [placedAt, setPlacedAt] = useState<Date>(new Date());
  const [userLocation, setUserLocation] = useState<OrderLocation>({
    latitude: -999,
    longitude: -999,
  });

  useEffect(() => {
    const fetchOrder = async () => {
      const order = await firestoreManager.readData("orders", orderId);
      setOrderedItem(order.getItem());
      setPlacedAt(order.getOrderDate());
      setUserLocation(order.getUsrLocation());
    };

    fetchOrder();
  }, [orderId]);

  const [arrivalTime, setArrivalTime] = useState<number>(0);

  useEffect(() => {
    // Generate a random arrival time between 10 and 25 minutes
    const additionalMinutes: number = 10 + secureRandom() * 15;
    const arrivalTime = placedAt.getTime() + additionalMinutes * 60 * 1000;
    setArrivalTime(arrivalTime);
    firestoreManager.updateData(
      "orders",
      orderId,
      "deliveryDate",
      new Date(arrivalTime)
    );
  }, [placedAt]);

  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    // Update the completion percentage every 50ms
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - placedAt.valueOf();
      const totalDuration = arrivalTime - placedAt.valueOf();
      const newCompletion = Math.min(100, (elapsed / totalDuration) * 100);

      setCompletion(newCompletion);

      if (newCompletion >= 100) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [placedAt, arrivalTime]);

  useEffect(() => {
    if (completion >= 100) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [completion]);

  const getFormattedArrivalTime = (arrivalDate: Date): string => {
    const formattedDate: string = arrivalDate.toLocaleString("en-CH", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return `${t("order-placed.arriving-at")} ${formattedDate}`;
  };

  return (
    <View
      className="flex flex-col gap-3 w-full h-full p-4 justify-center items-center"
      testID="order-placed-screen"
    >
      <TriangleBackground color="#A0D1E4" bottom={-200} />
      <View className="flex w-full flex-col items-center">
        <Text className=" text-3xl font-bold" testID="order-placed-message">
          {t("order-placed.on-its-way")}
        </Text>
        <View className="my-2 flex items-start">
          <Text className="text-lg my-2" testID="arrival-time">
            {getFormattedArrivalTime(new Date(arrivalTime))}
          </Text>
        </View>

        {/* Loading bar and helicopter icon */}
        <View className="w-11/12 bg-gray-200 rounded-lg relative">
          <View
            className="bg-blue-800 h-2 rounded-lg"
            style={{ width: `${Math.min(completion, 100)}%` }}
            testID="loading-bar"
          ></View>
          <View
            style={{
              position: "absolute",
              left: `${Math.min(completion, 100)}%`,
              transform: [{ translateX: -40 }],
            }}
          >
            <Icon name="helicopter-ambulance" size={50} color="#000000" />
          </View>
        </View>

        <View
          className="p-4 rounded-lg mt-24  w-11/12 justify-center items-center"
          style={{ backgroundColor: "#FFFBF1" }}
        >
          <Text className="text-2xl font-semibold" testID="order-summary">
            {t("order-placed.order-summary")}
          </Text>
          <Text className="text-xl my-2" testID="ordered-item-name">
            {orderedItem ? t(orderedItem.getName() as any) : "Loading..."}
          </Text>
          <Image
            className="w-64 h-64 rounded-lg"
            testID="ordered-item-image"
            source={
              orderedItem
                ? images[orderedItem.getId()]
                : require("../../../assets/icons/question_mark_icon.jpg")
            }
          />
        </View>

        <Animated.View
          className="w-11/12 p-4 rounded-lg mt-2 justify-center items-center"
          style={{
            opacity: fadeAnim,
          }}
        >
          <Text className="text-lg font-semibold" testID="order-complete">
            {t("order-placed.order-complete")}
          </Text>
          <Text className="text-lg" testID="order-complete-message">
            {t("order-placed.thanks")}
          </Text>

          <TouchableOpacity
            className="bg-blue-700 mt-4 w-4/5 rounded-lg p-2 text-white items-center"
            onPress={() => navigation.navigate("UserDrawer")}
            style={{
              opacity: completion >= 100 ? 1 : 0,
            }}
          >
            <Text className="text-white">Continue</Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          className="mt-4"
          testID="view-order-history"
          onPress={() =>
            navigation.navigate("OrderHistory", {
              historyOp: false,
            })
          }
        >
          <Text className="text-black underline">
            {t("order-placed.view-order-history")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderPlaced;
