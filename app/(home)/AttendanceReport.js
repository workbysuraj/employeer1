import { StyleSheet, Text, View, ScrollView, Pressable, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { useRouter } from "expo-router";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const AttendanceReport = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const employerId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!employerId) {
        console.error("⚠️ Employer not logged in.");
        setError("You must be logged in to view employees.");
        setLoading(false);
        return;
      }

      try {
        console.log("🔍 Fetching employees for employer:", employerId);
        setError(null);

        const q = query(collection(db, "employees"), where("employerId", "==", employerId));
        const employeesSnapshot = await getDocs(q);

        if (employeesSnapshot.empty) {
          console.log("ℹ️ No employees found.");
          setEmployees([]);
        } else {
          const employeeList = employeesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setEmployees(employeeList);
        }
      } catch (error) {
        console.error("🔥 Error fetching employees:", error);
        setError("Failed to fetch employees. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [employerId]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Attendance Report</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4b6cb7" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : employees.length > 0 ? (
        employees.map((employee) => (
          <Pressable
            key={employee.id}
            style={styles.employeeCard}
            onPress={() =>
              router.push(
                `/attendanceDetails?employeeId=${employee.employeeId}&name=${encodeURIComponent(employee.employeeName)}`
              )
            }
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{employee.employeeName?.charAt(0)}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                {employee.employeeName}
              </Text>
              <Text style={styles.details} numberOfLines={1}>
                {employee.designation || "No Designation"}
              </Text>
            </View>
          </Pressable>
        ))
      ) : (
        <Text style={styles.noData}>No Employees Found</Text>
      )}
    </ScrollView>
  );
};

export default AttendanceReport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: wp("5%"),
    paddingTop: hp("2%"),
  },
  header: {
    fontSize: wp("5.5%"),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: hp("2%"),
  },
  employeeCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp("4%"),
    marginVertical: hp("1%"),
    backgroundColor: "#f3f3f3",
    borderRadius: 10,
  },
  avatar: {
    width: wp("12%"),
    height: wp("12%"),
    borderRadius: wp("6%"),
    backgroundColor: "#4b6cb7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp("4%"),
  },
  avatarText: {
    color: "white",
    fontSize: wp("5%"),
    fontWeight: "bold",
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: wp("4.5%"),
    fontWeight: "bold",
  },
  details: {
    color: "gray",
    fontSize: wp("4%"),
    marginTop: hp("0.5%"),
  },
  noData: {
    textAlign: "center",
    marginTop: hp("2%"),
    fontSize: wp("4.5%"),
    color: "gray",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: wp("4.5%"),
  },
});
