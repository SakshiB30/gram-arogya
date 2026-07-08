import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Users,
  User,
  Baby,
  Plus,
} from "lucide-react";

import {
  fetchBeneficiaries,
  deleteBeneficiary,
} from "../redux/slices/beneficiarySlice";


const BeneficiaryPage = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const {
    beneficiaries,
    loading,
    error,
  } = useSelector(
    (state) => state.beneficiaries
  );


  useEffect(() => {
    dispatch(fetchBeneficiaries());
  }, [dispatch]);



  const getStatusColor = (status) => {

    switch(status?.toLowerCase()) {

      case "active":
        return "bg-green-100 text-green-700";

      case "inactive":
        return "bg-red-100 text-red-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }

  };



  const handleDelete = async(id)=>{

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this beneficiary?"
    );


    if(!confirmDelete) return;


    try{

      await dispatch(
        deleteBeneficiary(id)
      ).unwrap();


      dispatch(fetchBeneficiaries());

    }
    catch(err){

      alert(err);

    }

  };



  const total = beneficiaries.length;


  const pregnantWomen =
    beneficiaries.filter(
      (b)=>b.category==="PREGNANT_WOMAN"
    ).length;



  const children =
    beneficiaries.filter(
      (b)=>b.category==="CHILD"
    ).length;



  const stats = [

    {
      title:"Total Beneficiaries",
      value:total,
      icon:Users,
      color:"bg-blue-100 text-blue-600"
    },


    {
      title:"Pregnant Women",
      value:pregnantWomen,
      icon:User,
      color:"bg-orange-100 text-orange-600"
    },


    {
      title:"Children Under 5",
      value:children,
      icon:Baby,
      color:"bg-green-100 text-green-600"
    }

  ];





  return (

    <div className="min-h-screen bg-gray-100 p-6">


      {/* Header */}

      <div className="flex justify-between items-center mb-8">


        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Beneficiaries
          </h1>


          <p className="text-gray-500 mt-1">
            Manage registered beneficiaries
          </p>

        </div>



        <button

          onClick={()=>
            navigate("/app/beneficiaries/add")
          }

          className="
          flex items-center gap-2
          bg-blue-600
          hover:bg-blue-700
          text-white
          px-5 py-2
          rounded-lg
          shadow
          "

        >

          <Plus size={18}/>
          Add Beneficiary

        </button>


      </div>






      {/* Stats */}

      <div className="
      grid 
      grid-cols-1
      md:grid-cols-3
      gap-6
      mb-8
      ">


        {
          stats.map((item)=>(

            <div
            key={item.title}
            className="
            bg-white
            rounded-2xl
            shadow
            p-6
            "
            >

              <div className="flex justify-between">


                <div>

                  <p className="text-gray-500">
                    {item.title}
                  </p>


                  <h2 className="text-3xl font-bold mt-2">
                    {item.value}
                  </h2>

                </div>



                <div
                className={`
                h-12 w-12
                rounded-full
                flex
                items-center
                justify-center
                ${item.color}
                `}
                >

                  <item.icon size={24}/>

                </div>


              </div>


            </div>

          ))
        }


      </div>







      {/* Main Card */}

      <div className="
      bg-white
      rounded-2xl
      shadow
      overflow-hidden
      ">



        {
          loading &&

          <div className="
          flex justify-center
          items-center
          py-16
          ">

            <div
            className="
            h-10 w-10
            border-4
            border-blue-500
            border-t-transparent
            rounded-full
            animate-spin
            "
            />

          </div>

        }






        {
          !loading && error &&

          <div className="p-6">

            <div className="
            bg-red-100
            text-red-700
            p-4
            rounded-lg
            ">

              {error}

            </div>

          </div>

        }






        {
          !loading &&
          !error &&
          beneficiaries.length===0 &&


          <div className="
          text-center
          py-16
          ">


            <h2 className="
            text-xl
            font-semibold
            ">

              No Beneficiaries Found

            </h2>


            <p className="text-gray-500 mt-2">

              Add your first beneficiary

            </p>


            <button

            onClick={()=>
              navigate("/app/beneficiaries/add")
            }

            className="
            mt-5
            bg-blue-600
            text-white
            px-5 py-2
            rounded-lg
            "

            >

              Add Beneficiary

            </button>


          </div>


        }







        {
          !loading &&
          !error &&
          beneficiaries.length>0 &&


          <div className="overflow-x-auto">


          <table className="min-w-full">


          <thead className="bg-gray-50">


          <tr>


          <th className="px-6 py-4 text-left">
            #
          </th>


          <th className="px-6 py-4 text-left">
            Name
          </th>


          <th className="px-6 py-4 text-left">
            Age/Gender
          </th>


          <th className="px-6 py-4 text-left">
            Village
          </th>


          <th className="px-6 py-4 text-left">
            Category
          </th>


          <th className="px-6 py-4 text-left">
            Status
          </th>


          <th className="px-6 py-4 text-center">
            Actions
          </th>


          </tr>


          </thead>





          <tbody>


          {
            beneficiaries.map(
              (beneficiary,index)=>(


              <tr
              key={beneficiary.id}
              className="
              border-t
              hover:bg-gray-50
              "
              >



              <td className="px-6 py-4">
                {index+1}
              </td>



              <td className="px-6 py-4">

                <p className="font-semibold">
                  {beneficiary.name}
                </p>

                <p className="text-sm text-gray-500">
                  {beneficiary.phone}
                </p>

              </td>




              <td className="px-6 py-4">

                {beneficiary.age} yrs,
                {" "}
                {beneficiary.gender}

              </td>



              <td className="px-6 py-4">

                {beneficiary.village}

              </td>



              <td className="px-6 py-4">

                {beneficiary.category}

              </td>




              <td className="px-6 py-4">

              <span
              className={`
              px-3 py-1
              rounded-full
              text-xs
              font-semibold
              ${getStatusColor(
                beneficiary.status
              )}
              `}
              >

                {beneficiary.status}

              </span>

              </td>





              <td className="
              px-6 py-4
              text-center
              ">


              <div className="flex justify-center gap-2">


              <button

              onClick={()=>
                navigate(
                `/app/beneficiaries/${beneficiary.id}`
                )
              }

              className="
              bg-blue-100
              text-blue-700
              px-3 py-2
              rounded-lg
              "

              >

                View

              </button>





              <button

              onClick={()=>
                navigate(
                `/app/beneficiaries/edit/${beneficiary.id}`
                )
              }

              className="
              bg-yellow-100
              text-yellow-700
              px-3 py-2
              rounded-lg
              "

              >

                Edit

              </button>





              <button

              onClick={()=>
                handleDelete(
                  beneficiary.id
                )
              }

              className="
              bg-red-100
              text-red-700
              px-3 py-2
              rounded-lg
              "

              >

                Delete

              </button>



              </div>


              </td>



              </tr>


              )
            )
          }



          </tbody>


          </table>


          </div>


        }



      </div>



    </div>

  );

};


export default BeneficiaryPage;