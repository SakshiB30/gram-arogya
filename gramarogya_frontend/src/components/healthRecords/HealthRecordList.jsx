import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  fetchHealthRecords,
  deleteHealthRecord,
} from "../../redux/slices/healthRecordSlice";

import HealthRecordHeader from "./HealthRecordHeader";
import HealthRecordSearch from "./HealthRecordSearch";
import HealthRecordTable from "./HealthRecordTable";


const HealthRecordList = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const {
    healthRecords,
    loading,
    error
  } = useSelector(
    (state) => state.healthRecords
  );


  const [search, setSearch] = useState("");



  // Fetch health records
  useEffect(() => {

    dispatch(fetchHealthRecords());

  }, [dispatch]);





  // Delete Health Record
  const handleDelete = async (id) => {

    if (!window.confirm("Delete this health record?")) {
      return;
    }


    const result = await dispatch(
      deleteHealthRecord(id)
    );


    if (deleteHealthRecord.fulfilled.match(result)) {

      alert("Health record deleted successfully");


      // refresh list
      dispatch(fetchHealthRecords());

    } 
    else {

      alert(
        result.payload || 
        "Delete failed"
      );

    }

  };





  // Search filter
  const filteredRecords = healthRecords.filter(
    (record) => {

      const beneficiary =
        record?.beneficiaryName
        ?.toLowerCase() || "";


      const diagnosis =
        record?.diagnosis
        ?.toLowerCase() || "";


      return (
        beneficiary.includes(
          search.toLowerCase()
        )
        ||
        diagnosis.includes(
          search.toLowerCase()
        )
      );

    }
  );





  return (

    <div className="p-6">


      <HealthRecordHeader

        onAdd={() =>
          navigate(
            "/app/health-records/add"
          )
        }

      />



      <HealthRecordSearch

        search={search}

        setSearch={setSearch}

      />




      {
        error && (

          <div className="alert alert-danger mt-3">

            {error}

          </div>

        )
      }





      <HealthRecordTable

        records={filteredRecords}

        loading={loading}



        onView={(record) =>
          navigate(
            `/app/health-records/${record.id}`
          )
        }



        onEdit={(record) =>
          navigate(
            `/app/health-records/edit/${record.id}`
          )
        }



        onDelete={(record) =>
          handleDelete(record.id)
        }

      />



    </div>

  );

};


export default HealthRecordList;