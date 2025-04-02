import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { useLocalSearchParams } from "expo-router";
import moment from "moment";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const AttendanceDetails = () => {
  const { employeeId, name } = useLocalSearchParams();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const employerId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        if (!employerId) {
          console.error("⚠️ Employer not logged in.");
          setLoading(false);
          return;
        }

        console.log("🔍 Fetching attendance for Employee ID:", employeeId);

        const q = query(collection(db, "attendance"), where("employeeId", "==", employeeId));
        const attendanceSnapshot = await getDocs(q);

        if (attendanceSnapshot.empty) {
          console.log("ℹ️ No attendance records found.");
          setAttendance([]);
        } else {
          const attendanceList = attendanceSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setAttendance(
            attendanceList.sort((a, b) =>
              new Date(b.date?.seconds ? b.date.toDate() : b.date) -
              new Date(a.date?.seconds ? a.date.toDate() : a.date)
            )
          );
        }
      } catch (error) {
        console.error("🔥 Error fetching attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [employeeId, employerId]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Attendance Report for {name}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4b6cb7" />
      ) : attendance.length > 0 ? (
        attendance.map((record) => (
          <View key={record.id} style={styles.attendanceCard}>
            <Text style={styles.date}>
              {record.date
                ? moment(record.date?.seconds ? record.date.toDate() : record.date).format("DD MMM YYYY")
                : "No Date"}
            </Text>
            <Text style={[styles.status, {
              color: record.status === "Present"
                ? "green"
                : record.status === "Absent"
                ? "red"
                : "blue",
            }]}>
              {record.status === "H" ? "Holiday" : record.status}
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.noData}>No Attendance Data Available</Text>
      )}
    </ScrollView>
  );
};

export default AttendanceDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: wp("5%"),
    paddingTop: hp("2%"),
  },
  header: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: hp("2%"),
  },
  attendanceCard: {
    padding: wp("4%"),
    marginVertical: hp("1%"),
    backgroundColor: "#f3f3f3",
    borderRadius: 10,
  },
  date: {
    fontSize: wp("4%"),
    fontWeight: "bold",
  },
  status: {
    fontSize: wp("4%"),
    marginTop: hp("0.5%"),
    fontWeight: "bold",
  },
  noData: {
    textAlign: "center",
    marginTop: hp("2%"),
    fontSize: wp("4%"),
    color: "gray",
  },
});
