import { StyleSheet, Text, View, ScrollView } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const AttendanceCriteria = () => {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <LinearGradient colors={["#7F7FD5", "#E9E4F0"]} style={styles.container}>
        <View style={styles.contentWrapper}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <Entypo name="calendar" size={hp("3%") } color="black" />
            <Text style={styles.headerText}>Attendance Criteria</Text>
          </View>

          {/* Attendance Criteria Details */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Attendance Policies</Text>
            <Text style={styles.infoText}>
              Employees are expected to maintain a minimum of 90% attendance. Late arrivals and early departures will be recorded accordingly.
            </Text>
          </View>
          
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Leave Management</Text>
            <Text style={styles.infoText}>
              Each employee is entitled to 12 paid leaves per year. Additional leaves may result in deductions unless approved by the employer.
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Work Hours</Text>
            <Text style={styles.infoText}>
              Standard work hours are from 9:00 AM to 6:00 PM. Overtime work is subject to additional compensation based on company policies.
            </Text>
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

export default AttendanceCriteria;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: hp("2%"),
  },
  contentWrapper: {
    paddingHorizontal: wp("5%"),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp("2%"),
  },
  headerText: {
    fontSize: hp("2.5%"),
    fontWeight: "bold",
    marginLeft: wp("2%"),
  },
  infoBox: {
    backgroundColor: "white",
    padding: hp("2%"),
    borderRadius: wp("3%"),
    marginVertical: hp("1%"),
  },
  infoTitle: {
    fontSize: hp("2%"),
    fontWeight: "bold",
    marginBottom: hp("0.5%"),
  },
  infoText: {
    fontSize: hp("1.8%"),
    color: "gray",
  },
});
