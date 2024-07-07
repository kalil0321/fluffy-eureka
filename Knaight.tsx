import React, { useState, useRef, useEffect } from "react";
import { FlatList, View, Text, ActivityIndicator, Alert } from "react-native";
import OpenAI from "openai";
import { TextField } from "../ui/TextField";
import { Button } from "../ui/Button";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Octicons";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
type Message = {
  id: string;
  text: string;
  sender: "user" | "assistant";
};
const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100); // Adding a slight delay
  };

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Icon
          name="trash"
          onPress={handleClearChat}
          size={26}
          style={{
            marginRight: 15,
          }}
          testID="clear-chat-button"
        />
      ),
    });
  }, [navigation]);

  const storeMessages = async (messages: Message[]) => {
    try {
      const jsonValue = JSON.stringify(messages);
      await AsyncStorage.setItem("@messages", jsonValue);
    } catch (e) {
      console.error("Error storing messages: ", e);
    }
  };

  const loadMessages = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@messages");
      const messages = JSON.parse(jsonValue || "[]");
      setMessages(messages);
    } catch (e) {
      console.error("Error loading messages: ", e);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []); // call only once, when component is loaded
  useEffect(() => {
    scrollToBottom();
    storeMessages(messages);
  }, [messages]); // call every time messages change

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };
    setMessages([...messages, newMessage]);
    setInput("");
    setLoading(true);
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `
      You are a helpful assistant in a hiking app built by EPFL bachelor students. 
      Your primary role is to provide health tips related to hiking, answer questions about hiking gear, 
      and offer advice on hiking safety and best practices. Additionally, you can inform users about the various hiking items we sell. 
      Always maintain a friendly and supportive tone, and politely decline any requests not related to hiking or health tips. 
      If a user asks about purchasing items, provide information about our products and their benefits. Our items include first aid kits, flashlights, thermal blankets, and power banks.
      The first aid kit constains bandages, plasters, rubbing alcohol, asthma pump and costs 20 CHF. The flashlight has 1000 lumens and is powered by two AA batteries, it costs 15 CHF.
      The thermal blanket is made of reflective material to contain body heat and costs 10 CHF. The power bank has a 20000 mAh capacity as well as USB-C, lightning and USB-A connections, it costs 30 CHF.
      You are not authorized to negotiate prices or make any deals or sales. If a user asks about purchasing items, provide information about our products and their benefits and direct them to the order button on the map.
    `,
          },
          ...messages.map((msg) => ({ role: msg.sender, content: msg.text })),
          { role: "user", content: input },
        ],
        model: "gpt-3.5-turbo",
      });
      const responseMessage: Message = {
        id: Date.now().toString(),
        text: completion.choices[0].message.content as string,
        sender: "assistant",
      };
      setMessages((prevMessages) => [...prevMessages, responseMessage]);
    } catch (error) {
      console.error("Error sending message: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    Alert.alert(
      "Clear chat",
      "Are you sure you want to delete your chat history? It cannot be recovered.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => setMessages([]) },
      ],
      { cancelable: false }
    );
  };
  return (
    <View className="flex-1 p-2 bg-white">
      <FlatList
        className="flex-1 mb-6"
        ref={flatListRef}
        testID="messages-list"
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            className={`${
              item.sender === "user"
                ? "self-end bg-[#48A6C9] rounded p-2 my-1 ml-[15%]"
                : "self-start bg-[#f1f0f0] rounded p-2 my-1 mr-[15%]"
            }`}
          >
            <Text
              className={`${
                item.sender === "user"
                  ? "text-white text-lg"
                  : "text-black text-lg"
              }`}
            >
              {item.text}
            </Text>
          </View>
        )}
        onContentSizeChange={scrollToBottom}
        onLayout={scrollToBottom}
      />

      {loading && (
        <ActivityIndicator className="my-2" testID="loading-indicator" />
      )}

      <View className="flex-row items-center pb-4">
        <TextField
          className="flex-1 border border-gray-300 rounded-full p-2 mr-2"
          value={input}
          onChangeText={setInput}
          type="text"
          placeholder="Type a message..."
          testID="message-input"
          maxLength={1000}
        />
        <Button
          className="max-w-[25%]"
          text="Send"
          onPress={handleSend}
          style="primary"
          testID="send-button"
        />
      </View>
    </View>
  );
};
export default ChatScreen;
