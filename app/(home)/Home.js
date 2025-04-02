import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  BackHandler,
  Alert,
  SafeAreaView,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, MaterialCommunityIcons, SimpleLineIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAuth, signOut } from "firebase/auth";
import { useFocusEffect } from "@react-navigation/native";
import { useWindowDimensions } from "react-native";

const routes = {
  employees: "/(home)/employees",
  markAttendance: "/(home)/markattendance",
  attendanceReport: "/(home)/AttendanceReport",
  summaryReport: "/(home)/summary",
  attendanceCriteria: "/(home)/attendanceCriteria",
  increasedWorkflow: "/(home)/increasedworkflow",
  costSaving: "/(home)/costsaving",
  employeePerformance: "/(home)/employeeperformance",
};

const Home = () => {
  const router = useRouter();
  const auth = getAuth();
  const { width } = useWindowDimensions();

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth);
            router.replace("/login");
          } catch (error) {
            console.error("Logout failed:", error);
          }
        },
      },
    ]);
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert("Exit App", "Are you sure you want to exit?", [
          { text: "Cancel", style: "cancel" },
          { text: "Exit", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => backHandler.remove();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <LinearGradient colors={["#7F7FD5", "#E9E4F0"]} style={{ flex: 1, paddingBottom: 20 }}>
          <View style={{ padding: width * 0.04 }}>
            {/* Header */}
            <View style={styles.headerContainer}>
              <MaterialCommunityIcons name="account-group" size={width * 0.07} color="black" />
              <Text style={[styles.headerText, { fontSize: width * 0.045 }]}>
                Employee Management
              </Text>
              <Pressable onPress={handleLogout}>
                <SimpleLineIcons name="logout" size={width * 0.07} color="black" />
              </Pressable>
            </View>

            {/* Employee Management Buttons */}
            <View style={styles.buttonRow}>
              {[
                { label: "Employee List", route: routes.employees, icon: "users" },
                { label: "Mark Attendance", route: routes.markAttendance, icon: "calendar-check" },
              ].map((item, index) => (
                <Pressable key={index} onPress={() => router.push(item.route)} style={styles.mainButton}>
                  <View style={styles.iconContainer}>
                    <FontAwesome5 name={item.icon} size={width * 0.06} color="black" />
                  </View>
                  <Text style={[styles.buttonText, { fontSize: width * 0.04 }]}>{item.label}</Text>
                </Pressable>
              ))}
            </View>

            {/* Reports Section */}
            <View style={styles.reportSection}>
              {[
                { label: "Attendance Report", route: routes.attendanceReport, icon: "file-invoice" },
                { label: "Summary Report", route: routes.summaryReport, icon: "clipboard-list" },
              ].map((item, index) => (
                <Pressable key={index} onPress={() => router.push(item.route)} style={styles.reportButton}>
                  <View style={styles.iconContainer}>
                    <FontAwesome5 name={item.icon} size={width * 0.06} color="black" />
                  </View>
                  <Text style={[styles.reportText, { fontSize: width * 0.045 }]}>{item.label}</Text>
                  <SimpleLineIcons name="arrow-right" size={width * 0.06} color="black" />
                </Pressable>
              ))}
            </View>

            {/* Attendance Criteria Section */}
            <Text style={[styles.sectionTitle, { fontSize: width * 0.05 }]}>Key Attendance Benefits</Text>
            <View style={styles.criteriaContainer}>
              {[
                { label: "Attendance Criteria", route: routes.attendanceCriteria, icon: "clipboard-check" },
                { label: "Increased Workflow", route: routes.increasedWorkflow, icon: "chart-line" },
                { label: "Cost Saving", route: routes.costSaving, icon: "piggy-bank" },
                { label: "Employee Performance", route: routes.employeePerformance, icon: "medal" },
              ].map((item, index) => (
                <Pressable key={index} style={styles.criteriaBox} onPress={() => router.push(item.route)}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={width * 0.08}
                    color={index % 2 === 0 ? "#FF9800" : "#4CAF50"} // Alternating colors
                  />
                  <Text style={[styles.criteriaText, { fontSize: width * 0.04 }]}>{item.label}</Text>
                </Pressable>
              ))}
            </View>

          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    fontWeight: "600",
  },
  buttonRow: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mainButton: {
    backgroundColor: "#D3CCE3",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    marginTop: 7,
    fontWeight: "600",
  },
  reportSection: {
    marginTop: 20,
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 7,
  },
  reportButton: {
    backgroundColor: "#BE93C5",
    borderRadius: 6,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  reportText: {
    marginLeft: 10,
    fontWeight: "600",
    flex: 1,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
    color: "#333",
  },
  criteriaContainer: {
    marginTop: 15,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  criteriaBox: {
    width: "45%",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    elevation: 3,
  },
  criteriaText: {
    marginTop: 10,
    fontWeight: "600",
    textAlign: "center",
    color: "#555",
  },
});
