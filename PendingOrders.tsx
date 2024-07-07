import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import OrderCard from "../../components/cards/OrderCard";
import { Button } from "../../ui/Button";
import {
  getDistanceOpToUser,
  Order,
  OrderStatus,
  sortOrders,
} from "../../types/Order";
import { Item } from "../../types/Item";
import TriangleBackground from "../../components/TriangleBackground";
import FirestoreManager from "../../services/FirestoreManager";
import { MessageBox } from "../../ui/MessageBox";
import { formatDate } from "../../types/Order";
import { Picker } from "@react-native-picker/picker";
import { TextField } from "../../ui/TextField";
import { useTranslation } from "react-i18next";
import { firestore, collection, onSnapshot } from "../../services/Firebase";
import { auth } from "../../services/Firebase";

// Import the useLocation hook
import useLocation from "../../app/maps/hooks/useLocation";

const PendingOrders = ({ navigation }: any) => {
  const { t } = useTranslation();
  const firestoreManager = new FirestoreManager();
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [searchText, setSearchText] = useState("");
  const [sortingOption, setSortingOption] = useState("ascendingDate");
  const [distance, setDistance] = useState<number>(0);
  const opid = auth.currentUser?.uid;
  const opDisplayName = auth.currentUser?.displayName;
  // Use the useLocation hook to get location data
  const {
    marker: opLocation, // Assuming the marker represents the operator's location
    loading: locationLoading,
    toggleAutoCenter,
  } = useLocation();

  useEffect(() => {
    fetchOrders();
  }, []);
  // ------------ Handle card opening and closing ------------
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleOpenCard = async (order: Order) => {
    if (opLocation) {
      // distance is computed in km
      setDistance(getDistanceOpToUser(opLocation, order.getUsrLocation())); // operator has not yet accepted order so his location is not available within Order
      //console.log("Distance: ", distance);
    }
    setSelectedOrder(order);
  };

  const handleCloseCard = () => {
    setSelectedOrder(null);
  };

  const handleAcceptOrder = async () => {
    if (!selectedOrder) {
      setError(new Error("No order selected"));
      return;
    }

    if (!opid) {
      setError(new Error("Operator ID is undefined"));
      return;
    }

    if (!opLocation) {
      setError(new Error("Operator location is undefined"));
      return;
    }

    if (!opDisplayName) {
      setError(new Error("Operator name is undefined"));
      return;
    }

    try {
      // Note this entire thing
      selectedOrder.setOpId(opid);

      const opLocationTypecasted = {
        latitude: opLocation.latitude,
        longitude: opLocation.longitude,
      };
      selectedOrder.setOpLocation(opLocationTypecasted);

      selectedOrder.setOpName(opDisplayName);

      selectedOrder.initDeliveryDate();

      selectedOrder.setStatus(OrderStatus.Accepted);

      await firestoreManager.writeData("orders", selectedOrder); // push local changes to Order to Firestore
      setSelectedOrder(null);
    } catch (err) {
      setError(err as Error);
    }
  };
  // ---------------------------------------------------------
  const orderListFiltered = sortOrders(
    sortingOption,
    orders.filter(
      (order) =>
        order
          .getItem()
          .getName()
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        order
          .getUsrLocName()
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        formatDate(order.getOrderDate(), false).includes(searchText)
    )
  );

  useEffect(() => {
    const unsub = onSnapshot(
      collection(firestore, "orders"),
      async (snapshot) => {
        fetchOrders();
      }
    );

    return () => unsub();
  }, []);

  const fetchOrders = async () => {
    try {
      const newOrders = await firestoreManager.queryOrder(
        "status",
        OrderStatus.Pending
      );

      if (newOrders === null) {
        setError(new Error("Failed to fetch from database."));
      } else if (newOrders.length === 0) {
        setError(
          new Error("No orders pending orders at the moment, check back later.")
        );
      } else {
        // Sort the orders by date so that the oldest orders are shown first
        /*const sortedOrders = newOrders.sort(
          (a, b) => a.getOrderDate().getTime() - b.getOrderDate().getTime()
        );*/
        setOrders(newOrders);
        setError(null); // Clear the error if the fetch is successful
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setRefreshing(false);
    }
  };

  interface SortingPickerProps {
    sortingOption: string;
    setSortingOption: React.Dispatch<React.SetStateAction<string>>;
  }

  const SortingPicker: React.FC<SortingPickerProps> = ({
    sortingOption,
    setSortingOption,
  }) => {
    const sortingOptions = [
      { label: "Date ↓", value: "descendingDate" },
      { label: "Date ↑", value: "ascendingDate" },
      { label: "Price ↓", value: "descendingPrice" },
      { label: "Price ↑", value: "ascendingPrice" },
    ];

    return (
      <Picker
        style={{
          transform: [{ translateY: -6.5 }],
          color: "black",
          width: 140,
        }}
        // <Picker> is a component from @react-native-picker/picker, and as a result it is NOT comptabile with Nativewind
        selectedValue={sortingOption}
        onValueChange={(itemValue, itemIndex) => setSortingOption(itemValue)}
      >
        {sortingOptions.map((option, index) => (
          <Picker.Item label={option.label} value={option.value} key={index} />
        ))}
      </Picker>
    );
  };

  return (
    <View className="mt-28" testID="pending-orders-screen">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TriangleBackground color="#A0D1E4" bottom={-800} />
      </KeyboardAvoidingView>
      <View className="flex-row">
        <TextField
          className="w-6/12 mx-auto mt-4 bg-white ml-4"
          placeholder="Type here to search"
          onChangeText={setSearchText}
          value={searchText}
          type="text"
          maxLength={100}
        />
        <View className="w-40 mx-auto mt-4 bg-gray-50 ml-4 relative h-12 rounded-full border border-gray-400 pb-8">
          <SortingPicker
            sortingOption={sortingOption}
            setSortingOption={setSortingOption}
          />
        </View>
      </View>

      {error && (
        <MessageBox
          message={error.message}
          style="error"
          onClose={() => setError(null)}
          testID="error-box"
        />
      )}
      <FlatList
        className="mt-4 max-h-[90%] min-h-[90%]"
        data={orderListFiltered}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onClick={() => handleOpenCard(item)}
            opBool={false}
            testId={`order-card-${item.getId()}`}
            onClickTestId={`order-card-${item.getId()}-button`}
            forHistory={false}
          /> // opBool is false because we want to show the user's location name
        )}
        keyExtractor={(item) => item.getId()}
        onEndReached={fetchOrders}
        onEndReachedThreshold={0.1}
        refreshing={refreshing}
        onRefresh={fetchOrders}
        testID="order-list"
      />

      {selectedOrder && (
        <Modal animationType="none" transparent={true}>
          <View className="flex-1 justify-center items-center bg-opacity-100">
            <View className="bg-white border-2 border-gray-500 p-5  shadow-lg w-[300] h-[180] rounded-lg">
              <Text className="text-center font-bold text-xl ">
                {`Would you like to accept the order for ${t(selectedOrder.getItem().getName() as any)}?`}
              </Text>
              <Text className="mt-2 text-lg">{`Trip distance: ${distance.toFixed(2)} km`}</Text>
              <View className="flex-row justify-between mt-4">
                <Button
                  text="Accept Order"
                  onPress={handleAcceptOrder}
                  style="primary"
                  className="shadow-lg w-36"
                />
                <Button
                  text="No"
                  onPress={handleCloseCard}
                  style="primary"
                  className="shadow-lg bg-red-400 w-36"
                  testID="close-card-button"
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default PendingOrders;
