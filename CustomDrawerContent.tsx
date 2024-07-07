import React from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { View, Text, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

/**
 *  Custom Drawer Content Component that displays the user's name, email, and photo.
 * It also displays a badge if the user is an operator.
 *
 * @component
 * @param {string} name - The user's name.
 * @param {string} email - The user's email.
 * @param {string} photoURL - The user's photo URL.
 * @param {boolean} isOperator - Whether the user is an operator.
 * @param {any} props - The props passed to the component.q
 */
export const CustomDrawerContent = ({
  name,
  email,
  photoURL,
  isOperator,
  ...props
}: any) => {
  return (
    <DrawerContentScrollView className=" " {...props}>
      <View className="flex flex-col items-center justify-center p-4">
        {photoURL ? (
          <Image
            source={{ uri: photoURL }}
            style={{
              marginBottom: 10,
              width: 50,
              height: 50,
              borderRadius: 25,
            }}
          />
        ) : (
          <Icon
            size={50}
            name="account"
            style={{ marginBottom: 10, borderRadius: 10 }}
          />
        )}
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>{name}</Text>
        <Text style={{ color: "gray" }}>{email}</Text>

        {isOperator && (
          <View className="flex flex-row items-center justify-center p-2 bg-blue-800 mt-1 rounded-xl">
            <Text className="text-sm text-white">Operator</Text>
          </View>
        )}
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};
