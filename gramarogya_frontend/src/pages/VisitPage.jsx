import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  fetchVisits,
} from "../redux/slices/visitSlice";

import VisitStats from "../components/visit/VisitStats";
import VisitTable from "../components/visit/VisitTable";


const VisitPage = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const {
    visits,
    loading,
    error
  } = useSelector(
    (state)=>state.visit
  );



  useEffect(()=>{

    dispatch(fetchVisits());

  },[dispatch]);



  const total =
    visits.length;


  const completed =
    visits.filter(
      visit =>
      visit.status?.toLowerCase()
      === "completed"
    ).length;



  const pending =
    visits.filter(
      visit =>
      visit.status?.toLowerCase()
      === "pending"
    ).length;



  const cancelled =
    visits.filter(
      visit =>
      visit.status?.toLowerCase()
      === "cancelled"
    ).length;



return (

<div className="
min-h-screen
bg-gray-100
p-6
">


{/* Header */}

<div className="
flex
justify-between
items-center
mb-8
">


<div>

<h1 className="
text-4xl
font-bold
text-gray-800
">

Visits

</h1>


<p className="
text-gray-500
mt-2
">

Manage beneficiary visit records

</p>


</div>



<button

onClick={()=>
navigate("/app/visit/add")
}

className="
bg-blue-600
hover:bg-blue-700
text-white
px-6
py-3
rounded-xl
shadow
"

>

+ New Visit

</button>


</div>




{/* Statistics */}

<VisitStats

total={total}

completed={completed}

pending={pending}

cancelled={cancelled}

/>




{/* Table */}

<VisitTable

visits={visits}

loading={loading}

error={error}

/>



</div>

);


};


export default VisitPage;