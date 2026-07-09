import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ReportHeader from "../components/reports/ReportHeader";
import ReportStats from "../components/reports/ReportStats";
import ExportButton from "../components/reports/ExportButton";
import ReportFilter from "../components/reports/ReportFilter";
import ReportTable from "../components/reports/ReportTable";

import {
  fetchReports,
  deleteReport,
} from "../redux/slices/reportSlice";


export default function ReportsPage() {

  const dispatch = useDispatch();


  const {
    reports = [],
    loading,
    error,
  } = useSelector(
    (state) => state.reports
  );


  const [searchTerm, setSearchTerm] =
    useState("");

  const [dateFilter, setDateFilter] =
    useState("All");


  useEffect(() => {

    dispatch(fetchReports());

  }, [dispatch]);



  const filteredReports = useMemo(() => {

    return reports.filter((report) => {


      const searchMatch =
        (
          report.beneficiaryName || ""
        )
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        );



      let dateMatch = true;


      if(dateFilter !== "All"){

        const reportDate =
          new Date(report.createdAt);

        const today =
          new Date();


        const difference =
          (
            today - reportDate
          ) /
          (
            1000 *
            60 *
            60 *
            24
          );


        if(dateFilter === "7 Days"){

          dateMatch =
            difference <= 7;

        }


        if(dateFilter === "30 Days"){

          dateMatch =
            difference <= 30;

        }

      }


      return (
        searchMatch &&
        dateMatch
      );

    });


  }, [
    reports,
    searchTerm,
    dateFilter
  ]);




  const handleDelete = async (id)=>{

    const confirmDelete =
      window.confirm(
        "Delete this report?"
      );


    if(!confirmDelete)
      return;


    await dispatch(
      deleteReport(id)
    );


    dispatch(
      fetchReports()
    );

  };



  return (

    <div className="flex flex-col gap-6">


      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <ReportHeader />

        <ExportButton
          reports={reports}
        />

      </div>



      {/* Stats */}

      <ReportStats
        reports={reports}
      />



      {/* Filter */}

      <ReportFilter

        searchTerm={searchTerm}

        dateFilter={dateFilter}

        onSearchChange={
          setSearchTerm
        }

        onDateChange={
          setDateFilter
        }

      />



      {
        error && (

          <div className="rounded-xl bg-red-100 p-4 text-red-700">

            {error}

          </div>

        )
      }



      {/* Table */}

      <ReportTable

        reports={
          filteredReports
        }

        loading={
          loading
        }

        onDelete={
          handleDelete
        }

      />


    </div>

  );

}