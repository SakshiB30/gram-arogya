import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import reportService from "../../services/reportService";


// ==========================
// GET ALL REPORTS
// ==========================
export const fetchReports = createAsyncThunk(
  "reports/getAll",
  async (_, thunkAPI) => {
    try {
      return await reportService.getReports();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);


// ==========================
// GET REPORT BY ID
// ==========================
export const fetchReportById = createAsyncThunk(
  "reports/getById",
  async (id, thunkAPI) => {
    try {
      return await reportService.getReportById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);


// ==========================
// CREATE REPORT
// ==========================
export const createReport = createAsyncThunk(
  "reports/create",
  async (reportData, thunkAPI) => {
    try {
      return await reportService.createReport(reportData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);


// ==========================
// UPDATE REPORT
// ==========================
export const updateReport = createAsyncThunk(
  "reports/update",
  async ({ id, reportData }, thunkAPI) => {
    try {
      return await reportService.updateReport(
        id,
        reportData
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);


// ==========================
// DELETE REPORT
// ==========================
export const deleteReport = createAsyncThunk(
  "reports/delete",
  async (id, thunkAPI) => {
    try {
      await reportService.deleteReport(id);
      return id;

    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);



const initialState = {

  reports: [],

  selectedReport: null,

  loading: false,

  success: false,

  error: null,

};



const reportSlice = createSlice({

  name: "reports",

  initialState,


  reducers: {

    resetReportState: (state) => {

      state.loading = false;
      state.success = false;
      state.error = null;
      state.selectedReport = null;

    },

  },


  extraReducers: (builder) => {

    builder


    // ======================
    // FETCH ALL
    // ======================
    .addCase(fetchReports.pending, (state) => {

      state.loading = true;

    })

    .addCase(fetchReports.fulfilled, (state, action) => {

      state.loading = false;

      state.reports = action.payload;

    })

    .addCase(fetchReports.rejected, (state, action) => {

      state.loading = false;

      state.error = action.payload;

    })


    // ======================
    // FETCH BY ID
    // ======================
    .addCase(fetchReportById.pending, (state)=>{

      state.loading = true;

    })

    .addCase(fetchReportById.fulfilled,(state,action)=>{

      state.loading = false;

      state.selectedReport = action.payload;

    })

    .addCase(fetchReportById.rejected,(state,action)=>{

      state.loading = false;

      state.error = action.payload;

    })


    // ======================
    // CREATE
    // ======================
    .addCase(createReport.fulfilled,(state,action)=>{

      state.loading = false;

      state.success = true;

      state.reports.push(action.payload);

    })


    // ======================
    // UPDATE
    // ======================
    .addCase(updateReport.fulfilled,(state,action)=>{

      state.loading = false;

      state.success = true;


      state.reports =
        state.reports.map((report)=>
          report.id === action.payload.id
          ? action.payload
          : report
        );

    })


    // ======================
    // DELETE
    // ======================
    .addCase(deleteReport.fulfilled,(state,action)=>{

      state.loading = false;

      state.success = true;


      state.reports =
        state.reports.filter(
          (report)=>
            report.id !== action.payload
        );

    })

  },

});


export const {
  resetReportState

} = reportSlice.actions;


export default reportSlice.reducer;