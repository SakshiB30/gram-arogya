import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import searchService from "../../services/searchService";


// =======================
// GLOBAL SEARCH API
// =======================

export const searchAll = createAsyncThunk(
  "search/searchAll",
  async (keyword, { rejectWithValue }) => {

    try {

      const data = await searchService.searchAll(keyword);

      return data;

    } catch (error) {

      return rejectWithValue(
        error.response?.data?.message ||
        "Search failed"
      );

    }

  }
);



const initialState = {

  results: [],

  loading: false,

  error: null,

};



const searchSlice = createSlice({

  name: "search",

  initialState,


  reducers: {

    clearSearch: (state) => {

      state.results = [];

      state.error = null;

    },

  },


  extraReducers: (builder) => {


    builder

    // =====================
    // SEARCH START
    // =====================

    .addCase(searchAll.pending, (state) => {

      state.loading = true;

      state.error = null;

    })


    // =====================
    // SEARCH SUCCESS
    // =====================

    .addCase(searchAll.fulfilled, (state, action) => {

      state.loading = false;

      state.results = action.payload;

    })


    // =====================
    // SEARCH FAILED
    // =====================

    .addCase(searchAll.rejected, (state, action) => {

      state.loading = false;

      state.error = action.payload;

    });


  },

});


export const {
  clearSearch,

} = searchSlice.actions;


export default searchSlice.reducer;