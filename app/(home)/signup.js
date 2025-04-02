import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

const Signup = () => {
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 600;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Account created successfully");
      router.replace("/login");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <LinearGradient colors={["#7F7FD5", "#E9E4F0"]} style={{ flex: 1, justifyContent: "center", padding: width * 0.05 }}>
      <View
        style={{
          backgroundColor: "white",
          padding: width * 0.06,
          borderRadius: 10,
          elevation: 5,
          width: isLargeScreen ? "50%" : "100%",
          alignSelf: "center",
        }}
      >
        <Text style={{ fontSize: width * 0.06, fontWeight: "bold", textAlign: "center", marginBottom: width * 0.05 }}>
          Sign Up
        </Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{
            borderWidth: 1,
            borderColor: "gray",
            padding: width * 0.04,
            borderRadius: 8,
            marginBottom: width * 0.04,
            fontSize: width * 0.04,
          }}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{
            borderWidth: 1,
            borderColor: "gray",
            padding: width * 0.04,
            borderRadius: 8,
            marginBottom: width * 0.04,
            fontSize: width * 0.04,
          }}
        />
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={{
            borderWidth: 1,
            borderColor: "gray",
            padding: width * 0.04,
            borderRadius: 8,
            marginBottom: width * 0.05,
            fontSize: width * 0.04,
          }}
        />
        <Pressable
          onPress={handleSignUp}
          style={{
            padding: width * 0.045,
            backgroundColor: "#7F7FD5",
            borderRadius: 6,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "600", fontSize: width * 0.045 }}>Sign Up</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/login")} style={{ marginTop: width * 0.04, alignItems: "center" }}>
          <Text style={{ color: "blue", fontSize: width * 0.04 }}>Already have an account? Login</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
};

export default Signup;
