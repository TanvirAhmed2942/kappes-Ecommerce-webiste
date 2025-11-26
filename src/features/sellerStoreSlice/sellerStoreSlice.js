import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  storeName: "",
  storeLogo: "",
};

const sellerStoreSlice = createSlice({
  name: "storeInfo",
  initialState,
  reducers: {
    setStoreInfo: (state, action) => {
      state.storeName = action.payload.storeName;
      state.storeLogo = action.payload.storeLogo;
    },
  },
});

//selector
export const getStoreInfo = (state) => {
  return state.sellerStore;
};

export const { setStoreInfo } = sellerStoreSlice.actions;

export default sellerStoreSlice.reducer;
