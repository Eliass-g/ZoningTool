import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const appUrl = import.meta.env.VITE_APP_URL;

const initialState = {
  parcels: [],
  mounted: false,
  selectedParcels: [],
  status: {
    parcels: "idle",
    update: "idle",
    delete: "idle",
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

        state.parcels = state.parcels.map((parcel) => {
          const update = action.payload.find((u) => u.id === parcel.id);
          if (!update || update.zoningTyp === update.orgZoningTyp)
            return parcel;

          return {
            ...parcel, // Keep all existing properties
            orgZoningTyp: parcel.orgZoningTyp ?? parcel.zoningTyp, // Set original zoning
            zoningTyp: update.zoningTyp, // Update to new zoning
          };
        });

        state.status.update = "succeeded";
      })
      .addCase(updateZoningType.rejected, (state) => {
        state.status.parcels = "failed";
      })
      .addCase(deleteZoningType.pending, (state) => {
        state.status.parcels = "loading";
      })
      .addCase(deleteZoningType.fulfilled, (state, action) => {
        state.parcels = state.parcels.map((parcel) => {
          const del = action.payload.find((u) => u === parcel.id);
          if (!del) return parcel;
          return {
            ...parcel,
            zoningTyp: parcel.orgZoningTyp,
            orgZoningTyp: null,
          };
        });
        state.status.delete = "succeeded";
      })
      .addCase(deleteZoningType.rejected, (state) => {
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
    const response = await axios({
      url: `${appUrl}/api/zoning/update`,
      method: "POST",
      data: parcels,
    });
    return response.data;
  }
);

export const deleteZoningType = createAsyncThunk(
  "zoning/deleteZoningType",
  async (parcelIds) => {
    const response = await axios({
      url: `${appUrl}/api/zoning/delete`,
      method: "DELETE",
      data: parcelIds,
    });
    return response.data;
  }
);

export const { setParcels, toggleSelectParcel, clearSelected } =
  zoningSlice.actions;
export default zoningSlice.reducer;
