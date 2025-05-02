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
  reducers: {},
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
      })
      .addCase(updateZoningType.pending, (state) => {
        state.status.parcels = "loading";
      })
      .addCase(updateZoningType.fulfilled, (state, action) => {
        console.log(action.payload);
        state.parcels = state.parcels.map(parcel => {
          const update = action.payload.find(u => u.id === parcel.id);
          if (!update) return parcel;
          
          return {
            ...parcel, // Keep all existing properties
            orgZoningTyp: parcel.orgZoningTyp ?? parcel.zoningTyp, // Set original zoning
            zoningTyp: update.zoningTyp     // Update to new zoning
          };
        });
        console.log(state.parcels);
        state.status.parcels = "succeeded";
      })
      .addCase(updateZoningType.rejected, (state) => {
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

export const updateZoningType = createAsyncThunk(
  "zoning/updateZoningType",
  async (parcels) => {
    console.log(parcels);
    const response = await axios({
      url: `${appUrl}/api/zoning/update`,
      method: "POST",
      data: parcels,
    });
    return response.data;
  }
);

export const { setParcels, toggleSelectParcel, clearSelected } =
  zoningSlice.actions;
export default zoningSlice.reducer;
