import { StyleSheet, Text, View, ScrollView } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const CostSaving = () => {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <LinearGradient colors={["#7F7FD5", "#E9E4F0"]} style={styles.gradient}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <Entypo name="wallet" size={wp("6%")} color="black" />
            <Text style={styles.headerText}>Cost Saving</Text>
          </View>

          {/* Content */}
          <View style={styles.contentBox}>
            <Text style={styles.contentText}>
              Implementing efficient employee management systems leads to
              significant cost savings. By automating attendance tracking and
              payroll calculations, businesses can reduce administrative costs
              and eliminate errors.
            </Text>
            <Text style={styles.contentText}>
              Additionally, optimizing workflows helps in reducing overtime and
              unnecessary expenses, making resource allocation more effective.
            </Text>
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

export default CostSaving;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingVertical: hp("5%"),
  },
  container: {
    paddingHorizontal: wp("5%"),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp("3%"),
  },
  headerText: {
    fontSize: wp("5.5%"),
    fontWeight: "bold",
    marginLeft: wp("2%"),
  },
  contentBox: {
    backgroundColor: "white",
    padding: wp("4%"),
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  contentText: {
    fontSize: wp("4.5%"),
    color: "black",
    marginBottom: hp("1%"),
    lineHeight: hp("3%"), // Improved readability
  },
});
