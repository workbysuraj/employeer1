import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Pressable, useWindowDimensions } from "react-native";
import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { getAuth } from "firebase/auth";
import { useRouter } from "expo-router";

const SummaryReport = () => {
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 600;

  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchAttendanceReport = async () => {
      if (!user) return;
      setLoading(true);
      try {
        console.log("Fetching attendance summary...");

        const attendanceRef = collection(db, "attendance");
        const q = query(attendanceRef, where("employerId", "==", user.uid));
        const attendanceSnapshot = await getDocs(q);

        if (attendanceSnapshot.empty) {
          console.log("No attendance data found.");
          setAttendanceSummary([]);
          setLoading(false);
          return;
        }

        let attendanceData = {};
        attendanceSnapshot.docs.forEach((doc) => {
          const { employeeId, status } = doc.data();

          if (!attendanceData[employeeId]) {
            attendanceData[employeeId] = {
              employeeId,
              name: "",
              designation: "",
              present: 0,
              absent: 0,
              halfday: 0,
              holiday: 0,
              nonWorking: 0,
            };
          }

          if (status === "P") attendanceData[employeeId].present += 1;
          if (status === "A") attendanceData[employeeId].absent += 1;
          if (status === "HD") attendanceData[employeeId].halfday += 1;
          if (status === "H") attendanceData[employeeId].holiday += 1;
          if (status === "NW") attendanceData[employeeId].nonWorking += 1;
        });

        const employeesRef = collection(db, "employees");
        const employeesSnapshot = await getDocs(query(employeesRef, where("employerId", "==", user.uid)));

        employeesSnapshot.docs.forEach((doc) => {
          const { employeeName, designation } = doc.data();
          const employeeId = doc.id;

          if (attendanceData[employeeId]) {
            attendanceData[employeeId].name = employeeName;
            attendanceData[employeeId].designation = designation;
          }
        });

        setAttendanceSummary(Object.values(attendanceData));
      } catch (error) {
        console.error("🔥 Error fetching attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceReport();
  }, [user]);

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#4b6cb7" />
      ) : attendanceSummary.length > 0 ? (
        attendanceSummary.map((item) => (
          <Pressable
            key={item.employeeId}
            style={[styles.reportCard, isLargeScreen && styles.reportCardLarge]}
          >
            <View style={{
              flexDirection:'column'
            }}>
            <View style={[styles.avatar, { width: width * 0.12, height: width * 0.12 }]}>
              <Text style={[styles.avatarText, { fontSize: width * 0.05 }]}>{item?.employeeId?.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { fontSize: width * 0.045 }]}>{item?.name}</Text>
              <Text style={[styles.details, { fontSize: width * 0.04 }]}>
                {item?.designation} ({item?.employeeId})
              </Text>
            </View>

            </View>
            

            <View style={[styles.attendanceBox, { padding: width * 0.02 }]}>
              <Text style={[styles.attendanceText, { fontSize: width * 0.035 }]}>P: {item?.present || 0}</Text>
              <Text style={[styles.attendanceText, { fontSize: width * 0.035 }]}>A: {item?.absent || 0}</Text>
              <Text style={[styles.attendanceText, { fontSize: width * 0.035 }]}>HD: {item?.halfday || 0}</Text>
              <Text style={[styles.attendanceText, { fontSize: width * 0.035 }]}>H: {item?.holiday || 0}</Text>
              <Text style={[styles.attendanceText, { fontSize: width * 0.035 }]}>NW: {item?.nonWorking || 0}</Text>
            </View>
          </Pressable>
        ))
      ) : (
        <Text style={[styles.noData, { fontSize: width * 0.05 }]}>No Attendance Data Available</Text>
      )}
    </ScrollView>
  );
};

export default SummaryReport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
  },
  reportCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#f3f3f3",
    borderRadius: 10,
  },
  reportCardLarge: {
    padding: 20,
  },
  avatar: {
    borderRadius: 50,
    backgroundColor: "#4b6cb7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  avatarText: {
    color: "white",
    fontWeight: "bold",
  },
  name: {
    fontWeight: "bold",
  },
  details: {
    color: "gray",
    marginTop: 3,
  },
  attendanceBox: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#A1FFCE",
    borderRadius: 5,
  },
  attendanceText: {
    fontWeight: "bold",
  },
  noData: {
    textAlign: "center",
    marginTop: 20,
    fontWeight: "bold",
    color: "gray",
  },
});
