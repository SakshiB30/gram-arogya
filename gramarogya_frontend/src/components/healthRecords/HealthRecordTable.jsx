import { Eye, Edit, Trash2 } from "lucide-react";

const HealthRecordTable = ({
  records,
  loading,
  onView,
  onEdit,
  onDelete,
}) => {

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-10">
        <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }


  if (!records || records.length === 0) {
    return (
      <div className="text-center mt-10">
        <h5 className="text-gray-500 text-lg">
          No Health Records Found
        </h5>
      </div>
    );
  }


  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">

      <table className="w-full text-sm text-left">

        <thead className="bg-gray-900 text-white">

          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Beneficiary</th>
            <th className="px-4 py-3">BP</th>
            <th className="px-4 py-3">Weight</th>
            <th className="px-4 py-3">Temperature</th>
            <th className="px-4 py-3">Hemoglobin</th>
            <th className="px-4 py-3">Diagnosis</th>
            <th className="px-4 py-3">Prescription</th>
            <th className="px-4 py-3">Actions</th>
          </tr>

        </thead>


        <tbody>

          {records.map((record,index)=>(

            <tr
              key={record.id}
              className="border-b hover:bg-gray-50"
            >

              <td className="px-4 py-3">
                {index+1}
              </td>


              <td className="px-4 py-3 font-medium">
                {record.beneficiaryName || "-"}
              </td>


              <td className="px-4 py-3">
                {record.bloodPressure}
              </td>


              <td className="px-4 py-3">
                {record.weight} kg
              </td>


              <td className="px-4 py-3">
                {record.temperature} °F
              </td>


              <td className="px-4 py-3">
                {record.hemoglobin}
              </td>


              <td className="px-4 py-3">

                <span className="
                  bg-green-100 
                  text-green-700 
                  px-3 
                  py-1 
                  rounded-full 
                  text-xs 
                  font-medium
                ">
                  {record.diagnosis}
                </span>

              </td>


              <td className="px-4 py-3">
                {record.prescription || "-"}
              </td>


              <td className="px-4 py-3">

                <div className="flex gap-2">


                  <button
                    onClick={()=>onView(record)}
                    className="
                    p-2 
                    rounded-lg
                    bg-blue-100
                    text-blue-600
                    hover:bg-blue-200
                    "
                  >
                    <Eye size={16}/>
                  </button>



                  <button
                    onClick={()=>onEdit(record)}
                    className="
                    p-2 
                    rounded-lg
                    bg-yellow-100
                    text-yellow-600
                    hover:bg-yellow-200
                    "
                  >
                    <Edit size={16}/>
                  </button>



                  <button
                    onClick={()=>onDelete(record)}
                    className="
                    p-2 
                    rounded-lg
                    bg-red-100
                    text-red-600
                    hover:bg-red-200
                    "
                  >
                    <Trash2 size={16}/>
                  </button>


                </div>

              </td>


            </tr>

          ))}

        </tbody>


      </table>

    </div>
  );
};


export default HealthRecordTable;