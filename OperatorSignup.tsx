import React, { useState, useEffect } from "react";
import { Text, ScrollView, View } from "react-native";
// ------------- FIREBASE IMPORTS ----------------
import { auth, createUserWithEmailAndPassword } from "../../services/Firebase";
// -----------------------------------------------
import { TextField } from "../../ui/TextField";
import { Button } from "../../ui/Button";
import { MessageBox } from "../../ui/MessageBox";
import { useTranslation } from "react-i18next";
import FirestoreManager, { DBUser } from "../../services/FirestoreManager";
import * as ImagePicker from "expo-image-picker";

const firestoreManager = new FirestoreManager();

export default function OperatorSignUp({ navigation }: any) {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [photoID, setPhotoID] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [strength, setStrength] = useState("");

  useEffect(() => {
    validatePassword(password);
  }, [password]);

  const validatePassword = (input: string) => {
    let newSuggestions = [];
    if (input.length < 8) {
      newSuggestions.push(t("password-suggestions.length"));
    }
    if (!/\d/.test(input)) {
      newSuggestions.push(t("password-suggestions.number"));
    }
    if (!/[A-Z]/.test(input) || !/[a-z]/.test(input)) {
      newSuggestions.push(t("password-suggestions.upper-lower"));
    }
    if (!/[^A-Za-z0-9]/.test(input)) {
      newSuggestions.push(t("password-suggestions.special"));
    }
    setSuggestions(newSuggestions);
    if (newSuggestions.length === 0) {
      setStrength(t("password-suggestions.very-strong"));
    } else if (newSuggestions.length <= 1) {
      setStrength(t("password-suggestions.strong"));
    } else if (newSuggestions.length <= 2) {
      setStrength(t("password-suggestions.moderate"));
    } else if (newSuggestions.length <= 3) {
      setStrength(t("password-suggestions.weak"));
    } else {
      setStrength(t("password-suggestions.too-weak"));
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhotoID(result.assets[0].uri);
    }
  };

  const signUpWithEmail = async () => {
    if (
      userName &&
      email &&
      password &&
      phoneNumber &&
      yearsOfExperience &&
      photoID &&
      location
    ) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          if (auth.currentUser != null) {
            const user: DBUser = {
              name: userName,
              email: email,
              role: "operator",
              createdAt: new Date(),
            };

            firestoreManager.createUser(auth.currentUser.uid, user);
            navigation.navigate("OperatorDrawer");
          }
        })
        .catch((error) => {
          setError("Sign Up failed. Please check your credentials.");
        });
    } else {
      setError("Please fill all fields.");
    }
  };

  const getStrengthColor = () => {
    switch (strength) {
      case t("password-suggestions.too-weak"):
        return "red";
      case t("password-suggestions.weak"):
        return "orange";
      case t("password-suggestions.moderate"):
        return "yellow";
      case t("password-suggestions.strong"):
        return "yellowgreen";
      case t("password-suggestions.very-strong"):
        return "green";
      default:
        return "#ccc";
    }
  };

  const getStrengthWidth = () => {
    switch (strength) {
      case t("password-suggestions.very-strong"):
        return "100%";
      case t("password-suggestions.strong"):
        return "75%";
      case t("password-suggestions.moderate"):
        return "50%";
      case t("password-suggestions.weak"):
        return "25%";
      default:
        return "0%";
    }
  };

  const { t } = useTranslation();

  return (
    <ScrollView
      className="flex-1 bg-white px-8 mt-10"
      contentContainerStyle={{
        // this is necessary for ScrollView, cannot be done through Nativewind
        alignItems: "center",
        justifyContent: "center",
      }}
      testID="sign-up-screen"
    >
      <Text
        className="text-4xl font-bold mb-8 text-center pt-5"
        testID="signup-title"
      >
        {"Operator Sign Up"}
      </Text>

      <View className="flex flex-col gap-3">
        <TextField
          placeholder={t("signup.username")}
          value={userName}
          onChangeText={setUserName}
          type="text"
          testID="username-input"
          maxLength={40}
        />

        <TextField
          placeholder={t("signup.email")}
          value={email}
          onChangeText={setEmail}
          type="email"
          testID="email-input"
          maxLength={30}
        />

        <TextField
          placeholder={t("signup.password")}
          value={password}
          onChangeText={setPassword}
          type="password"
          testID="password-input"
          maxLength={50}
        />

        <TextField
          placeholder={t("signup.phone-number", {
            defaultValue: "Enter your phone number",
          })}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          type="text"
          testID="phone-number-input"
          maxLength={20}
        />
      </View>

      <View className="w-full my-8 flex flex-col items-center bg-gray-100 p-4 rounded-lg">
        <Text testID="pw-strength" className="text-lg text-center">
          {strength}
        </Text>
        <View className="w-full h-4 bg-gray-300 rounded-lg m-2">
          <View
            className="h-full rounded-lg"
            style={{
              width: getStrengthWidth(),
              backgroundColor: getStrengthColor(),
            }}
          />
        </View>
        <View>
          {suggestions.map((suggestion, index) => (
            <Text key={index} className="text-red-500 m-1">
              {suggestion}
            </Text>
          ))}
        </View>
      </View>
      <Button
        text={"Upload Photo ID"}
        onPress={pickImage}
        style="secondary"
        testID="upload-photo-button"
      />
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#ccc",
          marginVertical: 20,
        }}
      />
      <Button
        text={t("signup.signup-button")}
        onPress={signUpWithEmail}
        style="primary"
        testID="sign-up-button"
      />

      {error && (
        <MessageBox
          message={error}
          style="error"
          onClose={() => setError("")}
          testID="signup-error-message"
          className="mt-8"
        />
      )}
    </ScrollView>
  );
}
