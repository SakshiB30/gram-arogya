import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, CalendarDays } from "lucide-react";

export default function GenerateReport() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    reportType: "",
    fromDate: "",
    toDate: "",
  });


  const [loading, setLoading] = useState(false);



  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };



  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);


    // Backend API integration later
    console.log("Generate Report:", formData);


    setTimeout(() => {

      setLoading(false);

      navigate("/app/reports");

    }, 1000);

  };



  return (

    <div className="flex justify-center">

      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-sm">


        {/* Header */}
        <div className="flex items-center gap-3 border-b px-6 py-5">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">

            <FileText
              size={20}
              className="text-blue-600"
            />

          </div>


          <div>

            <h1 className="text-xl font-bold text-slate-900">

              Generate Report

            </h1>


            <p className="text-sm text-slate-500">

              Create healthcare reports from system data.

            </p>

          </div>

        </div>




        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >


          {/* Report Type */}
          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">

              Report Type

            </label>


            <select
              name="reportType"
              value={formData.reportType}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
            >

              <option value="">
                Select Report Type
              </option>

              <option value="Beneficiary">
                Beneficiary Report
              </option>

              <option value="Health">
                Health Record Report
              </option>

              <option value="Visit">
                Visit Report
              </option>

              <option value="Inventory">
                Inventory Report
              </option>

            </select>

          </div>




          {/* Date Range */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">


            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">

                From Date

              </label>


              <div className="relative">

                <CalendarDays
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />


                <input
                  type="date"
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-3 outline-none focus:border-blue-500"
                />

              </div>

            </div>



            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">

                To Date

              </label>


              <div className="relative">

                <CalendarDays
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />


                <input
                  type="date"
                  name="toDate"
                  value={formData.toDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-3 outline-none focus:border-blue-500"
                />

              </div>

            </div>


          </div>




          {/* Buttons */}
          <div className="flex justify-end gap-3 border-t pt-5">


            <button
              type="button"
              onClick={() =>
                navigate("/app/reports")
              }
              className="rounded-lg border px-5 py-2 font-medium text-slate-700 hover:bg-slate-50"
            >

              Cancel

            </button>



            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >

              {loading
                ? "Generating..."
                : "Generate Report"
              }

            </button>


          </div>


        </form>


      </div>

    </div>

  );
}