import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Alert,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import Checkbox from "expo-checkbox";
import { Color, FontFamily } from "../constants/GlobalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import Redux (for backward compatibility)
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../Redux/Slices/UserSlice";

// Import new API service and utilities
import apiService from "../services/api";
import { handleApiMutation } from "../services/apiUtils";

import { Header } from "../components/UIComponents";

const { height, width } = Dimensions.get("window");

export default function Address_Profile({ navigation, route }) {
  const dispatch = useDispatch();
  const { profile } = useSelector(state => state.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [address, setaddress] = useState("");
  const [address2, setaddress2] = useState("");
  const [permanentaddress, setpermanentaddress] = useState("");
  const [permanentaddress2, setpermanentaddress2] = useState("");
  const [pincode, setpincode] = useState("");
  const [permanentpincode, setpermanentpincode] = useState("");
  const [selecteddistrict, setselecteddistrict] = useState("");
  const [permanentselecteddistrict, setpermanentselecteddistrict] = useState("");
  const [Postoffice, setPostoffice] = useState("");
  const [PermanentPostoffice, setPermanentPostoffice] = useState("");
  //   Track Changes
  const [isUpdated, setIsUpdated] = useState(false);
  const [state, setstate] = useState("");
  const [permanentstate, setpermanentstate] = useState("");
  const [isSelected, setSelection] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const heightInterpolation = useRef(new Animated.Value(0)).current;

  // For scrolling to bottom when needed
  const scrollViewRef = useRef(null);

  const handlecheckmark = () => {
    setSelection(!isSelected);
    if (!isSelected) {
      // Set permanent address fields to current address
      setpermanentaddress(address);
      setpermanentaddress2(address2);
      setpermanentstate(state);
      setPermanentPostoffice(Postoffice);
      setpermanentpincode(pincode);
      setpermanentselecteddistrict(selecteddistrict);
    } else {
      // Clear permanent address fields
      setpermanentaddress("");
      setpermanentaddress2("");
      setpermanentstate("");
      setPermanentPostoffice("");
      setpermanentpincode("");
      setpermanentselecteddistrict("");
    }

    // Animate the content expansion/collapse
    Animated.timing(heightInterpolation, {
      toValue: !isSelected ? 0 : contentHeight,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  // Fetch location when pincode is set from data
  useEffect(() => {
    if (pincode?.length === 6) {
      fetchLocation(pincode);
    }
  }, [pincode]);

  // Fetch location when permanent pincode is set from data
  useEffect(() => {
    if (permanentpincode?.length === 6) {
      fetchLocationPermanent(permanentpincode);
    }
  }, [permanentpincode]);

  // Sync permanent address fields when checkbox is checked
  useEffect(() => {
    if (isSelected) {
      setpermanentaddress(address);
      setpermanentaddress2(address2);
      setpermanentstate(state);
      setPermanentPostoffice(Postoffice);
      setpermanentpincode(pincode);
      setpermanentselecteddistrict(selecteddistrict);
    }
  }, [address, address2, state, Postoffice, pincode, selecteddistrict, isSelected]);

  // Update content height animation when isSelected changes
  useEffect(() => {
    Animated.timing(heightInterpolation, {
      toValue: isSelected ? 0 : contentHeight,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [isSelected, contentHeight]);

  // Handle Pincode Change
  const handlePincodeChange = text => {
    const numericText = text.replace(/[^0-9]/g, ""); // Remove non-numeric characters
    setpincode(numericText);

    if (numericText.length === 6) {
      fetchLocation(numericText);
    } else {
      setstate("");
      setselecteddistrict("");
      setPostoffice("");
    }
  };

  // Handle Permanent Pincode Change
  const handlePincodeChangePermanent = text => {
    const numericText = text.replace(/[^0-9]/g, ""); // Remove non-numeric characters
    setpermanentpincode(numericText);

    if (numericText.length === 6) {
      fetchLocationPermanent(numericText);
    } else {
      setpermanentstate("");
      setpermanentselecteddistrict("");
      setPermanentPostoffice("");
    }
  };

  // Fetch location data for pincode
  const fetchLocation = async enteredPincode => {
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${enteredPincode}`);
      const data = await response.json();

      if (data[0].Status === "Success") {
        setstate(data[0].PostOffice[0].State);
        setselecteddistrict(data[0].PostOffice[0].District);
        setPostoffice(data[0].PostOffice[0].Name);
      } else {
        ToastAndroid.showWithGravityAndOffset(
          "Invalid Pincode",
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
          0, // xOffset (0 keeps it centered horizontally)
          100 // yOffset (increase to move it down, decrease for higher placement)
        );
        setpincode("");
        setstate("");
        setselecteddistrict("");
        setPostoffice("");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch location data.");
    }
  };

  // Fetch location data for permanent pincode
  const fetchLocationPermanent = async enteredPincode => {
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${enteredPincode}`);
      const data = await response.json();

      if (data[0].Status === "Success") {
        setpermanentstate(data[0].PostOffice[0].State);
        setpermanentselecteddistrict(data[0].PostOffice[0].District);
        setPermanentPostoffice(data[0].PostOffice[0].Name);
      } else {
        ToastAndroid.showWithGravityAndOffset(
          "Invalid Pincode",
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
          0, // xOffset (0 keeps it centered horizontally)
          100 // yOffset (increase to move it down, decrease for higher placement)
        );
        setpermanentpincode("");
        setpermanentstate("");
        setpermanentselecteddistrict("");
        setPermanentPostoffice("");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch location data.");
    }
  };

  const [changedFields, setChangedFields] = useState([]);
  useEffect(() => {
    let changes = [];

    if (address !== profile?.currentAddress?.addressLine1) changes.push("Current Address");
    if (address2 !== profile?.currentAddress?.addressLine2) changes.push("Current Address");
    if (pincode !== profile?.currentAddress?.pincode) changes.push("Current Pincode");
    if (Postoffice !== profile?.currentAddress?.postOffice) changes.push("Current Post Office");
    if (state !== profile?.currentAddress?.state) changes.push("Current State");
    if (selecteddistrict !== profile?.currentAddress?.district) changes.push("Current District");
    if (permanentaddress !== profile?.permanentAddress?.addressLine1)
      changes.push("Permanent Address");
    if (permanentaddress2 !== profile?.permanentAddress?.addressLine2)
      changes.push("Permanent Address");
    if (permanentpincode !== profile?.permanentAddress?.pincode) changes.push("Permanent Pincode");
    if (PermanentPostoffice !== profile?.permanentAddress?.postOffice)
      changes.push("Permanent Post Office");
    if (permanentstate !== profile?.permanentAddress?.state) changes.push("Permanent State");
    if (permanentselecteddistrict !== profile?.permanentAddress?.district)
      changes.push("Permanent District");

    setChangedFields(changes);
    setIsUpdated(changes?.length > 0);
  }, [
    address,
    address2,
    pincode,
    Postoffice,
    state,
    selecteddistrict,
    permanentaddress,
    permanentaddress2,
    permanentpincode,
    PermanentPostoffice,
    permanentstate,
    permanentselecteddistrict,
  ]);

  // Fetch Data
  //   useEffect(() => {
  //     const fetchData = async () => {
  //       const token = await AsyncStorage.getItem("AccessToken");
  //       if (token && !profile) {
  //         // dispatch(fetchProfile(token));
  //       }
  //     };

  //     fetchData();
  //   }, [dispatch]);

  // **New Effect to Sync Data After `setData`**
  useEffect(() => {
    if (profile) {
      setaddress(profile?.currentAddress?.addressLine1 || "");
      setaddress2(profile?.currentAddress?.addressLine2 || "");
      setstate(profile?.currentAddress?.state || "");
      setselecteddistrict(profile?.currentAddress?.district || "");
      setPostoffice(profile?.currentAddress?.postOffice || "");
      setpincode(profile?.currentAddress?.pincode || "");
      setpermanentaddress(profile?.permanentAddress?.addressLine1 || "");
      setpermanentaddress2(profile?.permanentAddress?.addressLine2 || "");
      setpermanentstate(profile?.permanentAddress?.state || "");
      setpermanentselecteddistrict(profile?.permanentAddress?.district || "");
      setPermanentPostoffice(profile?.permanentAddress?.postOffice || "");
      setpermanentpincode(profile?.permanentAddress?.pincode || "");
      setSelection(profile?.isPermanentAddressSame);
    }
  }, [profile]); // Only run when `data` is updated

  // Use the new API service to update the profile address
  const handleAddressUpdate = async addressData => {
    try {
      setLoadingSubmit(true);

      // Use the API mutation helper with better error handling
      await handleApiMutation(apiService.profile.updateProfile, {
        args: [addressData],
        successMessage: "Address updated successfully",
        onSuccess: data => {
          // Still dispatch Redux action for compatibility
          dispatch(updateProfile(addressData));
          setIsUpdated(false);
          setChangedFields([]);
        },
      });
    } catch (error) {
      Alert.alert("Update Failed", "Something went wrong. Please try again.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleUpdate = async () => {
    // Validate fields before proceeding
    if (!validateFields()) {
      return;
    }

    const updatedData = {
      currentAddress: {
        addressLine1: address,
        addressLine2: address2,
        postOffice: Postoffice,
        state: state,
        district: selecteddistrict,
        pincode: pincode,
      },
      // Conditionally add `permanentAddress` only if `isSelected` is true
      ...(!isSelected && {
        permanentAddress: {
          addressLine1: permanentaddress,
          addressLine2: permanentaddress2,
          postOffice: PermanentPostoffice,
          state: permanentstate,
          district: permanentselecteddistrict,
          pincode: permanentpincode,
        },
      }),

      isPermanentAddressSame: isSelected,
    };

    // Call our new API service function
    await handleAddressUpdate(updatedData);
  };

  const [errors, setErrors] = useState({
    address: false,
    pincode: false,
    permanentAddress: false,
    permanentPincode: false,
  });

  // Validate fields before submission
  const validateFields = () => {
    let isValid = true;
    const newErrors = {
      address: false,
      pincode: false,
      permanentAddress: false,
      permanentPincode: false,
    };

    // Validate Address Line 1
    if (!address || address.trim() === "") {
      newErrors.address = true;
      ToastAndroid.showWithGravityAndOffset(
        "Address Line 1 is required",
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        0,
        100
      );
      isValid = false;
    }

    // Validate Pincode
    if (!pincode || pincode.length !== 6) {
      newErrors.pincode = true;
      ToastAndroid.showWithGravityAndOffset(
        "Valid 6-digit Pincode is required",
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        0,
        100
      );
      isValid = false;
    }

    // Validate Permanent Address if Not Same as Present
    if (!isSelected) {
      if (!permanentaddress || permanentaddress.trim() === "") {
        newErrors.permanentAddress = true;
        ToastAndroid.showWithGravityAndOffset(
          "Permanent Address Line 1 is required",
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
          0,
          100
        );
        isValid = false;
      }

      if (!permanentpincode || permanentpincode.length !== 6) {
        newErrors.permanentPincode = true;
        ToastAndroid.showWithGravityAndOffset(
          "Valid 6-digit Permanent Pincode is required",
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
          0,
          100
        );
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const getInputStyle = fieldName => {
    return [styles.input, errors[fieldName] && styles.inputError];
  };

  // Helper function to prevent consecutive spaces in text inputs
  const preventConsecutiveSpaces = text => {
    // Replace multiple consecutive spaces with a single space
    return text.replace(/\s{2,}/g, " ");
  };

  //Main Return Structure
  return (
    <View style={styles.container}>
      <Header title="Address" onBackPress={() => navigation.goBack()} rightComponent={null} />
      {loading ? (
        <View style={styles.loadingcontainer}>
          <AddressSkeletonLoading />
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef}
          >
            <View style={[styles.section, { marginBottom: isUpdated ? 80 : 20 }]}>
              <View style={styles.sub}>
                {/* Present Address */}
                <View style={[styles.fieldWrapper]}>
                  <Text style={[styles.fieldtTitle]}>
                    Present Address <Text style={styles.mandatoryAsterisk}>*</Text>
                  </Text>
                  <View style={styles.inputWithButton}>
                    <TextInput
                      style={getInputStyle("address")}
                      value={address}
                      onChangeText={text => {
                        setaddress(
                          preventConsecutiveSpaces(text.replace(/[^a-zA-Z0-9\s,./-]/g, ""))
                        );
                        if (errors.address) setErrors({ ...errors, address: false });
                      }}
                      keyboardType="default"
                      multiline
                      maxLength={40}
                      placeholder="Address Line 1"
                      placeholderTextColor={"gray"}
                      editable={!loadingSubmit}
                    />
                  </View>
                </View>
                <View style={[styles.fieldWrapper]}>
                  <View style={styles.inputWithButton}>
                    <TextInput
                      style={[styles.input]}
                      value={address2}
                      onChangeText={text =>
                        setaddress2(
                          preventConsecutiveSpaces(text.replace(/[^a-zA-Z0-9\s,./-]/g, ""))
                        )
                      }
                      keyboardType="default"
                      multiline
                      maxLength={40}
                      editable={!loadingSubmit}
                      placeholder="Address Line 2 (Optional)"
                      placeholderTextColor={"gray"}
                    />
                  </View>
                </View>
                {/* Pincode */}
                <View style={styles.fieldWrapper}>
                  <Text style={[styles.fieldtTitle]}>
                    Pincode <Text style={styles.mandatoryAsterisk}>*</Text>
                  </Text>
                  <TextInput
                    style={getInputStyle("pincode")}
                    value={pincode}
                    onChangeText={text => {
                      handlePincodeChange(text);
                      if (errors.pincode) setErrors({ ...errors, pincode: false });
                    }}
                    keyboardType="numeric"
                    maxLength={6}
                    placeholder="Pincode"
                    placeholderTextColor={"gray"}
                    editable={!loadingSubmit}
                  />
                </View>

                {/* State */}
                <View style={styles.fieldWrapper}>
                  <Text style={[styles.fieldtTitle]}>State</Text>
                  <Text style={[styles.buttonText2, !state && { color: "gray" }]}>
                    {state ? state : "State"}
                  </Text>
                </View>

                {/* District */}
                <View style={styles.fieldWrapper}>
                  <Text style={[styles.fieldtTitle]}>District</Text>
                  <Text style={[styles.buttonText2, !selecteddistrict && { color: "gray" }]}>
                    {selecteddistrict ? selecteddistrict : "District"}
                  </Text>
                </View>

                {/* Post Office */}
                <View style={styles.fieldWrapper}>
                  <Text style={[styles.fieldtTitle]}>Post Office</Text>
                  <Text style={[styles.buttonText2, !Postoffice && { color: "gray" }]}>
                    {Postoffice ? Postoffice : "Post Office"}
                  </Text>
                </View>
              </View>
              <View style={[styles.sub, { flex: 1 }]}>
                {/* Permanent Address */}
                <View style={[styles.fieldWrapper, { marginBottom: isSelected ? 0 : 5 }]}>
                  <View style={styles.checkboxContainer}>
                    <Text style={[styles.fieldtTitle, { top: 2 }]}>
                      Permanent Address (Same as Present!){" "}
                      <Text style={styles.mandatoryAsterisk}>*</Text>
                    </Text>
                    <Checkbox
                      style={styles.checkbox}
                      value={isSelected}
                      onValueChange={handlecheckmark}
                      color={isSelected ? Color.headingColor : Color.headingColor}
                    />
                  </View>
                </View>
                <Animated.View
                  style={{
                    height: heightInterpolation,
                    overflow: "hidden",
                    minHeight: 0,
                  }}
                >
                  {/* Hidden View to Measure Content */}
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      opacity: 0,
                    }}
                    onLayout={event => {
                      const newHeight = event.nativeEvent.layout.height;
                      if (newHeight !== contentHeight) {
                        setContentHeight(newHeight);
                      }
                    }}
                  >
                    {/* ✅ Fields to Measure */}
                    <View style={[styles.inputWithButton, { marginBottom: 5 }]}>
                      <TextInput
                        style={[styles.input]}
                        editable={!loadingSubmit}
                        value={permanentaddress}
                        onChangeText={text => {
                          setpermanentaddress(
                            preventConsecutiveSpaces(text.replace(/[^a-zA-Z0-9\s,./-]/g, ""))
                          );
                          if (errors.permanentAddress)
                            setErrors({ ...errors, permanentAddress: false });
                        }}
                        keyboardType="default"
                        multiline
                        maxLength={40}
                        placeholder="Address Line 1"
                        placeholderTextColor={"gray"}
                      />
                    </View>

                    <View style={[styles.inputWithButton, { marginBottom: 5 }]}>
                      <TextInput
                        style={[styles.input]}
                        editable={!loadingSubmit}
                        value={permanentaddress2}
                        onChangeText={text =>
                          setpermanentaddress2(
                            preventConsecutiveSpaces(text.replace(/[^a-zA-Z0-9\s,./-]/g, ""))
                          )
                        }
                        keyboardType="default"
                        multiline
                        maxLength={40}
                        placeholder="Address Line 2"
                        placeholderTextColor={"gray"}
                      />
                    </View>

                    {/* Pincode */}
                    <View style={styles.fieldWrapper}>
                      <Text style={[styles.fieldtTitle]}>
                        Pincode <Text style={styles.mandatoryAsterisk}>*</Text>
                      </Text>
                      <TextInput
                        style={getInputStyle("permanentPincode")}
                        value={permanentpincode}
                        onChangeText={text => {
                          handlePincodeChangePermanent(text);
                          if (errors.permanentPincode)
                            setErrors({ ...errors, permanentPincode: false });
                        }}
                        keyboardType="numeric"
                        maxLength={6}
                        placeholder="Pincode"
                        placeholderTextColor={"gray"}
                        editable={!isSelected}
                      />
                    </View>

                    {/* State */}
                    <View style={[styles.fieldWrapper]}>
                      <Text style={[styles.fieldtTitle]}>State</Text>
                      <Text style={[styles.buttonText2, !permanentstate && { color: "gray" }]}>
                        {permanentstate ? permanentstate : "State"}
                      </Text>
                    </View>

                    {/* District */}
                    <View style={styles.fieldWrapper}>
                      <Text style={[styles.fieldtTitle]}>District</Text>
                      <Text
                        style={[
                          styles.buttonText2,
                          !permanentselecteddistrict && { color: "gray" },
                        ]}
                      >
                        {permanentselecteddistrict ? permanentselecteddistrict : "District"}
                      </Text>
                    </View>

                    {/* Post Office */}
                    <View style={styles.fieldWrapper}>
                      <Text style={[styles.fieldtTitle]}>Post Office</Text>
                      <Text style={[styles.buttonText2, !PermanentPostoffice && { color: "gray" }]}>
                        {PermanentPostoffice ? PermanentPostoffice : "Post Office"}
                      </Text>
                    </View>
                  </View>

                  {/* Visible Content */}
                  {contentHeight > 0 && (
                    <View style={{ paddingVertical: 0 }}>
                      <View style={[styles.inputWithButton, { marginBottom: 5 }]}>
                        <TextInput
                          style={[styles.input]}
                          editable={!isSelected}
                          value={permanentaddress}
                          onChangeText={text => {
                            setpermanentaddress(
                              preventConsecutiveSpaces(text.replace(/[^a-zA-Z0-9\s,./-]/g, ""))
                            );
                            if (errors.permanentAddress)
                              setErrors({ ...errors, permanentAddress: false });
                          }}
                          keyboardType="default"
                          multiline
                          maxLength={40}
                          placeholder="Address Line 1"
                          placeholderTextColor={"gray"}
                        />
                      </View>

                      <View style={[styles.inputWithButton, { marginBottom: 5 }]}>
                        <TextInput
                          style={[styles.input]}
                          editable={!isSelected}
                          value={permanentaddress2}
                          onChangeText={text =>
                            setpermanentaddress2(
                              preventConsecutiveSpaces(text.replace(/[^a-zA-Z0-9\s,./-]/g, ""))
                            )
                          }
                          keyboardType="default"
                          multiline
                          maxLength={40}
                          placeholder="Address Line 2"
                          placeholderTextColor={"gray"}
                        />
                      </View>

                      {/* Pincode */}
                      <View style={styles.fieldWrapper}>
                        <Text style={[styles.fieldtTitle]}>
                          Pincode <Text style={styles.mandatoryAsterisk}>*</Text>
                        </Text>
                        <TextInput
                          style={[styles.input]}
                          value={permanentpincode}
                          onChangeText={handlePincodeChangePermanent}
                          keyboardType="numeric"
                          maxLength={6}
                          placeholder="Pincode"
                          placeholderTextColor={"gray"}
                          editable={!isSelected}
                        />
                      </View>

                      {/* State */}
                      <View style={[styles.fieldWrapper]}>
                        <Text style={[styles.fieldtTitle]}>State</Text>
                        <Text style={[styles.buttonText2, !permanentstate && { color: "gray" }]}>
                          {permanentstate ? permanentstate : "State"}
                        </Text>
                      </View>

                      {/* District */}
                      <View style={styles.fieldWrapper}>
                        <Text style={[styles.fieldtTitle]}>District</Text>
                        <Text
                          style={[
                            styles.buttonText2,
                            !permanentselecteddistrict && { color: "gray" },
                          ]}
                        >
                          {permanentselecteddistrict ? permanentselecteddistrict : "District"}
                        </Text>
                      </View>

                      {/* Post Office */}
                      <View style={styles.fieldWrapper}>
                        <Text style={[styles.fieldtTitle]}>Post Office</Text>
                        <Text
                          style={[styles.buttonText2, !PermanentPostoffice && { color: "gray" }]}
                        >
                          {PermanentPostoffice ? PermanentPostoffice : "Post Office"}
                        </Text>
                      </View>
                    </View>
                  )}
                </Animated.View>
              </View>
            </View>
          </ScrollView>
          {/* Update Button */}
          {changedFields?.length > 0 && (
            <TouchableOpacity
              style={styles.floatingUpdateButton}
              onPress={handleUpdate}
              disabled={loadingSubmit}
            >
              {loadingSubmit ? (
                <ActivityIndicator size="small" color={Color.colorWhite} />
              ) : (
                <Ionicons name="checkmark" size={24} color="white" />
              )}
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}

// Skeleton Loading Component
const AddressSkeletonLoading = () => {
  const [fadeAnim] = useState(new Animated.Value(0.3));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  const renderSkeletonField = () => (
    <View style={styles.fieldWrapper}>
      <Animated.View style={[styles.skeletonFieldTitle, { opacity: fadeAnim }]} />
      <Animated.View style={[styles.skeletonInput, { opacity: fadeAnim }]} />
    </View>
  );

  return (
    <View style={styles.skeletonContainer}>
      {/* Present Address */}
      <View style={styles.sub}>
        {renderSkeletonField()}
        {renderSkeletonField()}
        {renderSkeletonField()}
        {renderSkeletonField()}
        {renderSkeletonField()}
        {renderSkeletonField()}
      </View>

      {/* Permanent Address */}
      <View style={styles.sub}>
        {renderSkeletonField()}
        {renderSkeletonField()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.bcBackground,
  },
  loadingcontainer: {
    flex: 1,
    backgroundColor: Color.bcBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  floatingUpdateButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: Color.headingColor, // Changed from bcHeader to bcHighlight
    width: 56, // Changed from 60 to 56
    height: 56, // Changed from 60 to 56
    borderRadius: 28, // Changed from 30 to 28
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4, // Changed from 5 to 4
  },
  section: {
    flex: 1,
    marginVertical: 10,
  },
  sub: {
    marginVertical: 8, // Changed from different value
    padding: 14, // Changed from 8 to 14
    backgroundColor: Color.colorWhite, // Changed from bcNotification to colorWhite
    borderRadius: 15, // Changed from 10 to 15
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  fieldtTitle: {
    marginBottom: 6, // Changed from 4 to 6
    fontSize: 13, // Kept at 13
    fontFamily: FontFamily.Inter_Medium, // Changed from Inter_Regular to Inter_Medium
    color: "#666", // Changed from gray to #666
    flexDirection: "row",
  },
  input: {
    padding: 12, // Increased from 8 to 12 to match Personal Info
    borderRadius: 12, // Increased from 10 to 12 to match Personal Info
    backgroundColor: Color.colorWhite, // Changed from bcNotification to colorWhite
    borderWidth: 1, // Changed from 0.8 to 1
    borderColor: "#E8E8E8", // Changed from E0E0E0 to E8E8E8
    width: "100%",
    fontFamily: FontFamily.Inter_Regular,
    fontSize: 15, // Added fontSize to match Personal Info
  },
  scrollContainer: {
    backgroundColor: Color.bcBackground,
    paddingHorizontal: 10,
  },
  //Mandetory mark
  fieldWrapper: {
    marginBottom: 4, // Reduced from 5
    borderRadius: 10,
  },

  flexInput: {
    flex: 1,
    paddingVertical: 8,
  },
  mandatoryAsterisk: {
    color: "red",
    marginLeft: 5,
    position: "absolute",
    right: 0,
    top: 8,
    fontSize: 12,
    zIndex: 2,
  },
  //Edit button for fields
  inputWithButton: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalView: {
    alignItems: "center",
    backgroundColor: "#FFF9FF",
    padding: 10,
    minHeight: 200,
    width: width * 1,
    overflow: "hidden",
  },
  modalheader: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  closeicon: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  // For add city
  addCity: {
    color: Color.headingColor,
    fontSize: 14,
    fontFamily: FontFamily.Montserrat_Regular,
    marginLeft: 5,
  },
  // Center content with image and text
  centeredContent: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
  },
  noFoundImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  noFoundText: {
    fontSize: 14,
    fontFamily: FontFamily.Montserrat_Regular,
    color: "#888",
    marginTop: 8,
  },

  // City Item
  cityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  cityInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: 16,
    fontFamily: FontFamily.Montserrat_SemiBold,
  },
  cityDetails: {
    fontSize: 14,
    color: "#888",
    fontFamily: FontFamily.Montserrat_Regular,
  },
  //Dropdown
  dropdownContainer: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    marginTop: 10,
  },
  dropdown: {
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  // checkbox
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkbox: {
    width: 20,
    height: 20,
  },
  button: {
    backgroundColor: Color.headingColor,
    padding: 10,
    paddingHorizontal: 15,
    width: 50,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  buttonText2: {
    fontSize: 15, // Increased from 14 to 15
    color: "#333",
    fontFamily: FontFamily.Inter_Regular,
    padding: 12, // Increased from 8 to 12
    borderRadius: 12, // Increased from 10 to 12
    backgroundColor: Color.colorWhite, // Changed from bcNotification
    width: "100%",
    borderWidth: 1, // Changed from 0.8
    borderColor: "#E8E8E8", // Changed from E0E0E0
  },
  skeletonContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 10,
  },
  skeletonFieldTitle: {
    height: 14,
    width: "40%",
    backgroundColor: "#E1E9EE",
    borderRadius: 5,
    marginBottom: 8,
  },
  skeletonInput: {
    height: 40,
    width: "100%",
    backgroundColor: "#E1E9EE",
    borderRadius: 10,
  },
  inputError: {
    borderColor: "#ff4d6d",
    borderWidth: 1,
    backgroundColor: "rgba(255, 77, 109, 0.05)",
  },
});
