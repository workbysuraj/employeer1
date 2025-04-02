import { Pressable, StyleSheet, Text, View, ActivityIndicator, useWindowDimensions } from "react-native";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { collection, getDocs, query, where, setDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebaseConfig";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const statusOptions = ["P", "A", "HD", "H", "NW"];

const MarkAttendance = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [currentDate, setCurrentDate] = useState(moment());
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch Employees from Firestore (Filtered by employerId)
  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) return;

      const employerId = user.uid;
      const employeesRef = collection(db, "employees");
      const q = query(employeesRef, where("employerId", "==", employerId));
      const employeesSnapshot = await getDocs(q);

      const employeesList = employeesSnapshot.docs.map((doc) => ({
        employeeId: doc.id,
        ...doc.data(),
      }));

      setEmployees(employeesList);
    } catch (error) {
      console.error("🔥 Error fetching employee data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Attendance from Firestore (Filtered by employerId)
  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) return;

      const employerId = user.uid;
      const attendanceRef = collection(db, "attendance");
      const q = query(
        attendanceRef,
        where("date", "==", currentDate.format("YYYY-MM-DD")),
        where("employerId", "==", employerId)
      );
      const attendanceSnapshot = await getDocs(q);

      let attendanceRecords = {};
      attendanceSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        attendanceRecords[data.employeeId] = data.status;
      });

      setAttendance(attendanceRecords);
    } catch (error) {
      console.error("🔥 Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  useEffect(() => {
    fetchAttendanceData();
  }, [currentDate]);

  const formatDate = (date) => date.format("MMMM D, YYYY");

  const goToNextDay = () => setCurrentDate(moment(currentDate).add(1, "days"));
  const goToPrevDay = () => setCurrentDate(moment(currentDate).subtract(1, "days"));

  const markAttendance = async (employeeId, status) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) return;

      const employerId = user.uid;
      const attendanceId = `${employerId}_${employeeId}_${currentDate.format("YYYY-MM-DD")}`;
      const attendanceRef = doc(db, "attendance", attendanceId);

      await setDoc(attendanceRef, {
        employerId,
        employeeId,
        date: currentDate.format("YYYY-MM-DD"),
        status,
      });

      setAttendance((prev) => ({
        ...prev,
        [employeeId]: status,
      }));
    } catch (error) {
      console.error("🔥 Error marking attendance:", error);
    }
  };

  return (
    <View style={[styles.container, { padding: width * 0.05 }]}>
      {/* Date Navigation */}
      <View style={styles.dateNav}>
        <AntDesign onPress={goToPrevDay} name="left" size={width * 0.06} color="black" />
        <Text style={[styles.dateText, { fontSize: width * 0.05 }]}>{formatDate(currentDate)}</Text>
        <AntDesign onPress={goToNextDay} name="right" size={width * 0.06} color="black" />
      </View>

      {/* Employee List with Attendance */}
      {loading ? (
        <ActivityIndicator size="large" color="#4b6cb7" />
      ) : employees.length > 0 ? (
        employees.map((employee) => (
          <View key={employee.employeeId} style={[styles.employeeCard, { padding: width * 0.04 }]}>
            {/* Employee Info */}
            <View style={styles.employeeInfo}>
              <View style={[styles.avatar, { width: width * 0.15, height: width * 0.15 }]}>
                <Text style={[styles.avatarText, { fontSize: width * 0.06 }]}>
                  {employee?.employeeName?.charAt(0) || "?"}
                </Text>
              </View>
              <View>
                <Text style={[styles.name, { fontSize: width * 0.05 }]}>{employee?.employeeName || "N/A"}</Text>
                <Text style={[styles.details, { fontSize: width * 0.04 }]}>
                  {employee?.designation || "Not Specified"} ({employee?.employeeId})
                </Text>
              </View>
            </View>

            {/* Attendance Options */}
            <View style={styles.attendanceOptions}>
              {statusOptions.map((status) => (
                <Pressable
                  key={status}
                  style={[
                    styles.statusButton,
                    { paddingVertical: width * 0.02, paddingHorizontal: width * 0.04 },
                    attendance[employee.employeeId] === status && styles.activeStatus,
                  ]}
                  onPress={() => markAttendance(employee.employeeId, status)}
                >
                  <Text style={[styles.statusText, { fontSize: width * 0.045 }]}>{status}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20, fontSize: width * 0.05 }}>No Employees Found</Text>
      )}
    </View>
  );
};

export default MarkAttendance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  dateNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    marginBottom: 20,
  },
  dateText: {
    fontWeight: "bold",
  },
  employeeCard: {
    backgroundColor: "#f3f3f3",
    borderRadius: 10,
    marginBottom: 10,
  },
  employeeInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
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
  attendanceOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statusButton: {
    borderRadius: 5,
    backgroundColor: "#ccc",
  },
  activeStatus: {
    backgroundColor: "#4b6cb7",
  },
  statusText: {
    color: "white",
    fontWeight: "bold",
  },
});
