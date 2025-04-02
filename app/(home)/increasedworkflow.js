import { StyleSheet, Text, View, ScrollView } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useWindowDimensions } from "react-native";

const IncreasedWorkflow = () => {
  const { width } = useWindowDimensions();

  return (
    <ScrollView>
      <LinearGradient colors={["#7F7FD5", "#E9E4F0"]} style={{ flex: 1 }}>
        <View style={{ padding: width * 0.04 }}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <Ionicons name="speedometer" size={width * 0.06} color="black" />
            <Text style={[styles.headerText, { fontSize: width * 0.05 }]}>
              Increased Workflow
            </Text>
          </View>

          {/* Content Section */}
          <View style={[styles.contentSection, { padding: width * 0.05 }]}>
            <Text style={[styles.description, { fontSize: width * 0.045 }]}>
              Efficient workflows streamline operations, reduce redundancies, and
              improve overall productivity. An optimized workflow allows employees
              to focus on high-priority tasks.
            </Text>
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

export default IncreasedWorkflow;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  headerText: {
    fontWeight: "bold",
    marginLeft: 10,
  },
  contentSection: {
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 20,
  },
  description: {
    textAlign: "center",
  },
});
