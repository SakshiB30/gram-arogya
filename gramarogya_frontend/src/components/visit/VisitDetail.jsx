import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
 fetchVisitById
}
from "../../redux/slices/visitSlice";



const VisitDetail =()=>{


const {id}=useParams();

const dispatch=useDispatch();

const navigate=useNavigate();



const {
 selectedVisit,
 loading,
 error
}=useSelector(
 state=>state.visit
);





useEffect(()=>{

 dispatch(
  fetchVisitById(id)
 );

},[dispatch,id]);







const statusStyle=(status)=>{


switch(status?.toLowerCase()){


case "completed":

return "bg-green-100 text-green-700";


case "pending":

return "bg-yellow-100 text-yellow-700";


case "cancelled":

return "bg-red-100 text-red-700";


default:

return "bg-gray-100 text-gray-700";


}


};





if(loading){

return(

<div className="
min-h-screen
flex
justify-center
items-center
bg-gray-100
">

Loading...

</div>

)

}





if(error){

return(

<div className="
m-6
bg-red-100
text-red-700
p-5
rounded-xl
">

{error}

</div>

)

}





if(!selectedVisit)
return null;






return(

<div className="
min-h-screen
bg-gray-100
p-6
">


<div className="
max-w-4xl
mx-auto
">





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
">

Visit Details

</h1>


<p className="text-gray-500">

Complete beneficiary visit information

</p>


</div>




<button

onClick={()=>
navigate("/app/visit")
}

className="
bg-white
px-5
py-3
rounded-xl
shadow
"

>

← Back

</button>



</div>







<div className="
bg-white
rounded-3xl
shadow-xl
p-8
">



<div className="
flex
justify-between
mb-8
">


<div>

<h2 className="
text-xl
font-semibold
">

Visit Information

</h2>


<p className="text-gray-500">

ID : {selectedVisit.id}

</p>


</div>




<span

className={`
px-4
py-2
rounded-full
font-semibold
${statusStyle(selectedVisit.status)}
`}

>

{selectedVisit.status}

</span>



</div>







<div className="
grid
md:grid-cols-2
gap-6
">


<div className="
bg-gray-50
p-5
rounded-2xl
">


<p className="text-gray-500">

Beneficiary ID

</p>


<h3 className="text-lg font-bold">

{selectedVisit.beneficiaryId}

</h3>


</div>





<div className="
bg-gray-50
p-5
rounded-2xl
">


<p className="text-gray-500">

Visit Type

</p>


<h3 className="text-lg font-bold">

{selectedVisit.visitType}

</h3>


</div>






<div className="
bg-gray-50
p-5
rounded-2xl
md:col-span-2
">


<p className="text-gray-500">

Notes

</p>


<p className="mt-3">

{
selectedVisit.notes ||
"No notes available"
}

</p>


</div>




</div>






<div className="
flex
justify-end
mt-8
">


<button

onClick={()=>
navigate(
`/app/visit/edit/${selectedVisit.id}`
)
}

className="
bg-blue-600
text-white
px-6
py-3
rounded-xl
"

>

Edit Visit

</button>


</div>





</div>






</div>


</div>


)


}


export default VisitDetail;