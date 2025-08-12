import { createSlice } from "@reduxjs/toolkit";
import apiService from "../../services/api";

const initialState = {
  profile: {},
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    registerUser: (state, action) => {
      state.profile = action.payload;
      // console.log("User Registered : ", state.profile);
    },
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
      // console.log("Profile Updated :", state.profile);
    },
    addBehalfUser: (state, action) => {
      if (Object.keys(state.profile).includes("behalfUsers")) {
        state.profile.behalfUsers.push(action.payload);
      } else {
        state.profile.behalfUsers = [action.payload];
      }
      // console.log("Behalf Users : ", state.profile.behalfUsers);
    },
    deleteBehalfUser: (state, action) => {
      state.profile.behalfUsers = state.profile.behalfUsers?.filter(
        user => user._id !== action.payload
      );
      // console.log("New Behalf Users :", state.profile.behalfUsers);
    },
    clearUser: state => {
      state.profile = {};
      // console.log("User data cleared");
    },
  },
});

export default userSlice.reducer;

export const { registerUser, updateProfile, addBehalfUser, deleteBehalfUser, clearUser } =
  userSlice.actions;
