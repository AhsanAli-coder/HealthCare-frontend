import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  speciality: "",
  availableOnly: false,
  lastSubmitted: null,
};

const doctorSearchSlice = createSlice({
  name: "doctorSearch",
  initialState,
  reducers: {
    setDoctorSearchName: (state, action) => {
      state.name = action.payload;
    },
    setDoctorSearchSpeciality: (state, action) => {
      state.speciality = action.payload;
    },
    setDoctorSearchAvailableOnly: (state, action) => {
      state.availableOnly = Boolean(action.payload);
    },
    submitDoctorSearch: (state) => {
      state.lastSubmitted = {
        name: state.name.trim(),
        speciality: state.speciality.trim(),
        availableOnly: state.availableOnly,
        at: new Date().toISOString(),
      };
    },
    resetDoctorSearch: () => initialState,
  },
});

export const {
  setDoctorSearchName,
  setDoctorSearchSpeciality,
  setDoctorSearchAvailableOnly,
  submitDoctorSearch,
  resetDoctorSearch,
} = doctorSearchSlice.actions;

export default doctorSearchSlice.reducer;
