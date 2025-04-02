import { StyleSheet, Text, View, ScrollView } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const EmployeeDetails = () => {
  const params = useLocalSearchParams();
  console.log("Received Params:", params); // Debugging Log

  const { id, name, designation, salary, address } = params || {};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Employee Details</Text>

      <View style={styles.detailBox}>
        <Text style={styles.detail}>🆔 ID: {id || "N/A"}</Text>
        <Text style={styles.detail}>👤 Name: {name || "N/A"}</Text>
        <Text style={styles.detail}>💼 Designation: {designation || "Not Specified"}</Text>
        <Text style={styles.detail}>
          💰 Salary: ₹{salary ? Number(salary).toLocaleString("en-IN") : "Not Available"}
        </Text>
        <Text style={styles.detail}>
          📍 Address: {address ? decodeURIComponent(address) : "No Address Provided"}
        </Text>
      </View>
    </ScrollView>
  );
};

export default EmployeeDetails;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  detailBox: {
    width: "100%",
    backgroundColor: "#f3f3f3",
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  detail: {
    fontSize: 18,
    marginVertical: 8,
    textAlign: "left",
    fontWeight: "500",
  },
});
