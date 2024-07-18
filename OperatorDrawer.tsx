import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { DrawerParamList } from "../../types/DrawerParamList";
import { createDrawerNavigator } from "@react-navigation/drawer";

// Stack Navigation Screens
import { auth, User } from "../../services/Firebase";

// Drawer Navigation Screens
import OrderHistory from "../../app/order/OrderHistory";
import { CustomDrawerContent } from "./CustomDrawerContent";
import FirestoreManager from "../../services/FirestoreManager";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import OperatorMap from "../../app/maps/OperatorMap";
import PendingOrders from "../../app/order/PendingOrders";
import { reload } from "firebase/auth";
import ProfileScreen from "../../app/settings/ProfileScreen";
import Settings from "../../app/settings/Setting";
const Drawer = createDrawerNavigator<DrawerParamList>();
interface OperatorDrawerProps {
  user?: User | null;
}

/**
 * Renders the OperatorDrawer component.
 *
 * @param {OperatorDrawerProps} user - The user props.
 * @returns {JSX.Element} The rendered OperatorDrawer component.
 */
export function OperatorDrawer<OperatorDrawerProps>(user: OperatorDrawerProps) {
  const {
    t
  } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [userId, setUserId] = useState("");
  const [changePFP, setChangePFP] = useState(false);
  const firestoreManager = new FirestoreManager();
  const updateUserProfile = async (user: User) => {
    await reload(user);
    setUserId(user.uid);
    setEmail(user.email || "");
    if (user.displayName) {
      setName(user.displayName || "");
    } else {
      const userData = await firestoreManager.getUser(user.uid);
      if (userData) {
        setName(userData.name || "");
      }
    }
    if (user.photoURL) {
      setPhotoURL(user.photoURL || "");
    } else {
      const userData = await firestoreManager.getUser(user.uid);
      if (userData) {
        setPhotoURL(userData.photoURL || "");
      }
    }
  };
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      updateUserProfile(user);
    }
  }, [changePFP]);
  return <Drawer.Navigator initialRouteName="Map" drawerContent={props => <CustomDrawerContent {...props} name={name} email={email} photoURL={photoURL} isOperator={true} />} screenOptions={{
    drawerActiveTintColor: "black",
    drawerItemStyle: {
      marginVertical: 5
    },
    drawerActiveBackgroundColor: "#f9f9f9",
    drawerInactiveTintColor: "grey",
    drawerInactiveBackgroundColor: "white",
    headerTintColor: "black"
  }}>
      <Drawer.Screen name="Profile" options={{
      drawerIcon: ({
        color,
        size
      }) => <Icon name="account" color={color} size={size} />
    }}>
        {(props: any) => <ProfileScreen {...props} onSaveChanges={() => setChangePFP(!changePFP)} />}
      </Drawer.Screen>
      <Drawer.Screen name="Map" options={{
      headerShown: false,
      headerTransparent: true,
      headerTitle: "",
      drawerIcon: ({
        color,
        size
      }) => <Icon name="map" color={color} size={size} />
    }}>
        {(props: any) => <OperatorMap {...props} />}
      </Drawer.Screen>
      <Drawer.Screen name="Settings" options={{
      drawerLabel: "Settings",
      headerTransparent: false,
      headerTitle: "Settings",
      drawerIcon: ({
        color
      }) => <Icon name="cog-outline" color={color} size={22} />
    }}>
        {(props: any) => <Settings {...props} />}
      </Drawer.Screen>
      <Drawer.Screen name="OrderHistory" options={{
      headerTransparent: true,
      drawerLabel: "Order History",
      headerTitle: "Order History",
      drawerIcon: ({
        color
      }) => <Icon name="history" color={color} size={22} />
    }}>
        {(props: any) => <OrderHistory {...props} route={{
        params: {
          historyOp: true,
          userId: userId
        }
      }} />}
      </Drawer.Screen>
      <Drawer.Screen name="PendingOrders" options={{
      headerTransparent: true,
      drawerLabel: "Pending Orders",
      headerTitle: "Pending Orders",
      drawerIcon: ({
        color
      }) => <Icon name="cart" color={color} size={22} />
    }}>
        {(props: any) => <PendingOrders {...props} />}
      </Drawer.Screen>
    </Drawer.Navigator>;
}