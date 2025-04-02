import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // ✅ Import Firebase Auth
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const AddDetails = () => {
  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [dob, setDob] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [salary, setSalary] = useState("");
  const [address, setAddress] = useState("");
  const [designation, setDesignation] = useState("");

  const handleRegister = async () => {
    const trimmedEmployeeId = employeeId.trim();

    if (!name || !trimmedEmployeeId || !designation || !mobileNo || !dob || !joiningDate || !salary || !address) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    if (/\s/.test(employeeId)) {
      Alert.alert("Error", "Employee ID cannot contain spaces.");
      return;
    }

    if (!/^\d{10}$/.test(mobileNo)) {
      Alert.alert("Error", "Please enter a valid 10-digit phone number.");
      return;
    }

    if (isNaN(salary) || salary <= 0) {
      Alert.alert("Error", "Please enter a valid salary amount.");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "No employer logged in.");
      return;
    }

    const employerId = user.uid;

    try {
      const employeeQuery = query(collection(db, "employees"), where("employeeId", "==", trimmedEmployeeId));
      const querySnapshot = await getDocs(employeeQuery);

      if (!querySnapshot.empty) {
        Alert.alert("Error", "Employee ID already exists. Please choose a different ID.");
        return;
      }

      const employeeData = {
        employeeName: name,
        employeeId: trimmedEmployeeId,
        designation: designation,
        phoneNumber: mobileNo,
        dateOfBirth: dob,
        joiningDate: joiningDate,
        activeEmployee: true,
        salary: Number(salary),
        address: address,
        employerId: employerId,
        createdAt: new Date(),
      };

      await addDoc(collection(db, "employees"), employeeData);
      Alert.alert("Success", "Employee added successfully!");

      setName("");
      setEmployeeId("");
      setDob("");
      setMobileNo("");
      setSalary("");
      setAddress("");
      setJoiningDate("");
      setDesignation("");
    } catch (error) {
      Alert.alert("Error", "Failed to add employee");
      console.error("🔥 Error adding employee: ", error);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ padding: wp("5%") }}>
        <Text style={styles.headerText}>Add a New Employee</Text>

        {["Full Name (First and Last Name)", "Employee ID", "Designation", "Mobile Number", "Date of Birth", "Joining Date", "Salary", "Address"].map((label, index) => (
          <View key={index} style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
              value={
                label === "Full Name (First and Last Name)" ? name :
                label === "Employee ID" ? employeeId :
                label === "Designation" ? designation :
                label === "Mobile Number" ? mobileNo :
                label === "Date of Birth" ? dob :
                label === "Joining Date" ? joiningDate :
                label === "Salary" ? salary :
                address
              }
              onChangeText={(text) => {
                if (label === "Full Name (First and Last Name)") setName(text);
                else if (label === "Employee ID") setEmployeeId(text.replace(/\s/g, ""));
                else if (label === "Designation") setDesignation(text);
                else if (label === "Mobile Number") setMobileNo(text);
                else if (label === "Date of Birth") setDob(text);
                else if (label === "Joining Date") setJoiningDate(text);
                else if (label === "Salary") setSalary(text.replace(/[^0-9]/g, ""));
                else setAddress(text);
              }}
              style={styles.input}
              placeholder={`Enter ${label}`}
              placeholderTextColor={"gray"}
              keyboardType={label === "Mobile Number" || label === "Salary" ? "numeric" : "default"}
              maxLength={label === "Mobile Number" ? 10 : undefined}
            />
          </View>
        ))}

        <Pressable onPress={handleRegister} style={styles.button}>
          <Text style={styles.buttonText}>Add Employee</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default AddDetails;

const styles = StyleSheet.create({
  headerText: {
    fontSize: wp("5%"),
    fontWeight: "bold",
  },
  inputContainer: {
    marginVertical: hp("1.5%"),
  },
  label: {
    fontSize: wp("4.2%"),
    fontWeight: "bold",
  },
  input: {
    padding: hp("1.5%"),
    borderColor: "#D0D0D0",
    borderWidth: 1,
    marginTop: hp("1%"),
    borderRadius: 5,
    fontSize: wp("4%"),
  },
  button: {
    backgroundColor: "#ABCABA",
    padding: hp("2%"),
    marginTop: hp("3%"),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
    fontSize: wp("4.5%"),
  },
});
