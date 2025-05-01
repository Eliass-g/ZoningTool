import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const appUrl = import.meta.env.VITE_APP_URL;

const initialState = {
  parcels: [],
  selectedParcels: [],
  status: {
    parcels: "idle",
  },
};

const zoningSlice = createSlice({
  name: "zoning",
  initialState,
  reducers: {
    setParcels: (state, action) => {
      state.parcels = action.payload;
    },
    toggleSelectParcel: (state, action) => {
      const id = action.payload;
      if (state.selectedParcels.includes(id)) {
        state.selectedParcels = state.selectedParcels.filter(
          (pid) => pid !== id
        );
      } else {
        state.selectedParcels.push(id);
      }
    },
    clearSelected: (state) => {
      state.selectedParcels = [];
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getParcels.pending, (state) => {
        state.status.parcels = "loading";
      })
      .addCase(getParcels.fulfilled, (state, action) => {
        state.parcels = action.payload;
        state.status.parcels = "succeeded";
      })
      .addCase(getParcels.rejected, (state) => {
        state.status.parcels = "failed";
      });
  },
});

export const getParcels = createAsyncThunk("zoning/getParcels", async () => {
  const response = await axios({
    url: `${appUrl}/api/zoning/parcel`,
    method: "GET",
  });
  return response.data;
});

export const { setParcels, toggleSelectParcel, clearSelected } =
  zoningSlice.actions;
export default zoningSlice.reducer;
