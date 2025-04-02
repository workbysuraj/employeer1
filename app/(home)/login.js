import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { width } = useWindowDimensions();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Logged in successfully");
      router.replace("/Home");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <LinearGradient colors={["#7F7FD5", "#E9E4F0"]} style={styles.container}>
      <View style={[styles.formContainer, { padding: width * 0.06, width: width * 0.9 }]}>
        <Text style={[styles.title, { fontSize: width * 0.07 }]}>Login</Text>
        
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={[styles.input, { fontSize: width * 0.045, padding: width * 0.035 }]}
        />
        
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={[styles.input, { fontSize: width * 0.045, padding: width * 0.035 }]}
        />
        
        <Pressable onPress={handleLogin} style={[styles.button, { padding: width * 0.045 }]}>
          <Text style={[styles.buttonText, { fontSize: width * 0.05 }]}>Login</Text>
        </Pressable>
        
        <Pressable onPress={() => router.push("/signup")} style={styles.signupLink}>
          <Text style={[styles.signupText, { fontSize: width * 0.045 }]}>Don't have an account? Sign Up</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
};

export default LoginScreen;

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    width: "100%",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#7F7FD5",
    borderRadius: 6,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  signupLink: {
    marginTop: 15,
  },
  signupText: {
    color: "blue",
    textAlign: "center",
  },
};
