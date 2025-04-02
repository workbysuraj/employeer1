import { StyleSheet, Text, View, FlatList, Pressable, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebaseConfig";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("🚨 No user logged in!");
      setLoading(false);
      return;
    }

    const employerId = user.uid;
    console.log("📌 Fetching employees for employerId:", employerId);

    const employeesRef = collection(db, "employees");
    const q = query(employeesRef, where("employerId", "==", employerId));

    // Realtime updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        console.log("🚨 No employees found for employerId:", employerId);
        setEmployees([]);
      } else {
        const employeeList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEmployees(employeeList);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 15 }}>
      {/* Header with "+" Button */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Employee List</Text>
        <Pressable onPress={() => router.push("/adddetails")} style={styles.addButton}>
          <AntDesign name="plus" size={24} color="white" />
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4b6cb7" style={{ marginTop: 20 }} />
      ) : employees.length > 0 ? (
        <FlatList
          data={employees}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.employeeCard}
              onPress={() =>
                router.push(
                  `/employeeDetails?id=${item.employeeId}&name=${item?.employeeName || "N/A"}&designation=${item?.designation || "Not Specified"}&salary=${item?.salary || "Not Available"}&address=${encodeURIComponent(item?.address || "No Address Provided")}`
                )
              }
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item?.employeeName?.charAt(0) || "?"}</Text>
              </View>
              <View>
                <Text style={styles.name}>{item?.employeeName || "Unnamed Employee"}</Text>
                <Text style={styles.details}>{item?.designation || "Not Specified"} ({item.employeeId})</Text>
                <Text style={styles.details}>💰 Salary: ₹{item?.salary ? Number(item.salary).toLocaleString("en-IN") : "Not Available"}</Text>
                <Text style={styles.details}>📍 {item?.address || "No Address Provided"}</Text>
              </View>
            </Pressable>
          )}
        />
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>No Employees Found</Text>
      )}
    </View>
  );
};

export default EmployeeList;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#4b6cb7",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  employeeCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#f3f3f3",
    borderRadius: 10,
    elevation: 3, // For shadow effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4b6cb7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  avatarText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  details: {
    color: "gray",
    marginTop: 3,
  },
});
