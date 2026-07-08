import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import visitService from "../../services/visitService";


/* ===========================
   GET ALL VISITS
=========================== */

export const fetchVisits = createAsyncThunk(
  "visits/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await visitService.getAllVisits();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch visits"
      );
    }
  }
);


/* ===========================
   GET VISIT BY ID
=========================== */

export const fetchVisitById = createAsyncThunk(
  "visits/fetchById",
  async (id,{rejectWithValue})=>{
    try{
      return await visitService.getVisitById(id);
    }
    catch(error){
      return rejectWithValue(
        error.response?.data || "Failed to fetch visit"
      );
    }
  }
);



/* ===========================
   CREATE VISIT
=========================== */

export const createVisit = createAsyncThunk(
  "visits/create",
  async (visitData, thunkAPI) => {
    try {
      return await visitService.createVisit(visitData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Failed to create visit"
      );
    }
  }
);



/* ===========================
   UPDATE VISIT
=========================== */

export const updateVisit = createAsyncThunk(
  "visits/update",
  async ({ id, visitData }, thunkAPI) => {
    try {
      return await visitService.updateVisit(
        id,
        visitData
      );

    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Failed to update visit"
      );
    }
  }
);



/* ===========================
   DELETE VISIT
=========================== */

export const deleteVisit = createAsyncThunk(
  "visits/delete",
  async (id, thunkAPI) => {
    try {

      await visitService.deleteVisit(id);

      return id;

    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Failed to delete visit"
      );
    }
  }
);



/* ===========================
   INITIAL STATE
=========================== */

const initialState = {

  visits: [],

  selectedVisit: null,

  loading:false,

  error:null,

};



/* ===========================
   SLICE
=========================== */


const visitSlice = createSlice({

  name:"visits",

  initialState,


  reducers:{


    clearVisitError:(state)=>{
      state.error=null;
    },


    clearSelectedVisit:(state)=>{
      state.selectedVisit=null;
    },


  },



  extraReducers:(builder)=>{

    builder



    /* ===========================
       FETCH ALL
    =========================== */


    .addCase(fetchVisits.pending,(state)=>{
      state.loading=true;
      state.error=null;
    })


    .addCase(fetchVisits.fulfilled,(state,action)=>{

      state.loading=false;

      state.visits=action.payload;

    })


    .addCase(fetchVisits.rejected,(state,action)=>{

      state.loading=false;

      state.error=action.payload;

    })



    /* ===========================
       FETCH BY ID
    =========================== */


    .addCase(fetchVisitById.pending,(state)=>{
      state.loading=true;
      state.error=null;
    })


    .addCase(fetchVisitById.fulfilled,(state,action)=>{

      state.loading=false;

      state.selectedVisit=action.payload;

    })


    .addCase(fetchVisitById.rejected,(state,action)=>{

      state.loading=false;

      state.error=action.payload;

    })



    /* ===========================
       CREATE
    =========================== */


    .addCase(createVisit.pending,(state)=>{

      state.loading=true;

      state.error=null;

    })


    .addCase(createVisit.fulfilled,(state,action)=>{

      state.loading=false;

      state.visits.push(action.payload);

    })


    .addCase(createVisit.rejected,(state,action)=>{

      state.loading=false;

      state.error=action.payload;

    })



    /* ===========================
       UPDATE
    =========================== */


    .addCase(updateVisit.pending,(state)=>{

      state.loading=true;

      state.error=null;

    })


    .addCase(updateVisit.fulfilled,(state,action)=>{

      state.loading=false;


      const index = state.visits.findIndex(
        (visit)=>visit.id === action.payload.id
      );


      if(index !== -1){

        state.visits[index]=action.payload;

      }


      if(
        state.selectedVisit &&
        state.selectedVisit.id === action.payload.id
      ){

        state.selectedVisit=action.payload;

      }


    })


    .addCase(updateVisit.rejected,(state,action)=>{

      state.loading=false;

      state.error=action.payload;

    })



    /* ===========================
       DELETE
    =========================== */


    .addCase(deleteVisit.pending,(state)=>{

      state.loading=true;

      state.error=null;

    })


    .addCase(deleteVisit.fulfilled,(state,action)=>{

      state.loading=false;


      state.visits =
        state.visits.filter(
          (visit)=>visit.id !== action.payload
        );


      if(
        state.selectedVisit?.id === action.payload
      ){

        state.selectedVisit=null;

      }

    })


    .addCase(deleteVisit.rejected,(state,action)=>{

      state.loading=false;

      state.error=action.payload;

    });


  }

});



export const {
  clearVisitError,
  clearSelectedVisit

} = visitSlice.actions;


export default visitSlice.reducer;