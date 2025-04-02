import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const EmployeePerformance = () => {
  const router = useRouter();

  // Handle navigation to detailed performance pages
  // const handleNavigation = (category) => {
  //   router.push(`/performanceDetails?category=${category}`);
  // };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <LinearGradient colors={["#7F7FD5", "#E9E4F0"]} style={styles.gradient}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <Ionicons name="bar-chart" size={26} color="black" />
            <Text style={styles.headerText}>Employee Performance</Text>
          </View>

          {/* Performance Criteria */}
          <View style={styles.section}>
            {[
              { icon: "speedometer", label: "Productivity Levels", key: "productivity" },
              { icon: "people", label: "Team Collaboration", key: "collaboration" },
              { icon: "checkmark-done-circle", label: "Task Completion Rate", key: "completion" },
              { icon: "trophy", label: "Achievements & Rewards", key: "achievements" },
            ].map((item) => (
              <Pressable key={item.key} style={styles.card} >
                <Ionicons name={item.icon} size={26} color="black" />
                <Text style={styles.cardText}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

export default EmployeePerformance;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    padding: 12,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: "#D3CCE3",
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    elevation: 5, // Adds a shadow effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 15,
  },
});
