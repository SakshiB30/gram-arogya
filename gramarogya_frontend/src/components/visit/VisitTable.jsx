import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
deleteVisit,
fetchVisits
}
from "../../redux/slices/visitSlice";



const VisitTable = ({
visits,
loading,
error
})=>{


const dispatch = useDispatch();
const navigate = useNavigate();

const getStatusColor=(status)=>{

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

const handleDelete = async(id)=>{

if(!window.confirm(
"Are you sure you want to delete this visit?"
))
return;



try{

await dispatch(
deleteVisit(id)
).unwrap();


dispatch(fetchVisits());


}
catch(err){

alert(err);

}


};



if(loading){

return (

<div className="
bg-white
rounded-2xl
p-10
text-center
">

Loading...

</div>

)

}



if(error){

return (

<div className="
bg-red-100
text-red-700
p-5
rounded-xl
">

{error}

</div>

)

}



if(visits.length===0){

return (

<div className="
bg-white
rounded-2xl
p-10
text-center
">

<h2 className="
text-xl
font-semibold
">

No Visits Found

</h2>


<p className="
text-gray-500
mt-2
">

Create your first visit.

</p>


</div>

)

}



return (

<div className="
bg-white
rounded-2xl
shadow
overflow-hidden
">


<div className="
overflow-x-auto
">


<table className="
min-w-full
divide-y
divide-gray-200
">


<thead className="bg-gray-50">

<tr>

<th className="px-6 py-4 text-left">
#
</th>


<th className="px-6 py-4 text-left">
Beneficiary
</th>


<th className="px-6 py-4 text-left">
Type
</th>


<th className="px-6 py-4 text-left">
Status
</th>


<th className="px-6 py-4 text-left">
Notes
</th>


<th className="px-6 py-4 text-center">
Actions
</th>


</tr>

</thead>



<tbody>


{
visits.map(
(visit,index)=>(


<tr
key={visit.id}
className="
hover:bg-gray-50
"
>


<td className="px-6 py-4">
{index+1}
</td>


<td className="px-6 py-4 font-semibold">
{visit.beneficiaryId}
</td>


<td className="px-6 py-4">
{visit.visitType}
</td>



<td className="px-6 py-4">

<span
className={`
px-3
py-1
rounded-full
text-xs
font-semibold
${getStatusColor(visit.status)}
`}
>

{visit.status}

</span>

</td>



<td className="px-6 py-4">
{visit.notes || "-"}
</td>



<td className="
px-6
py-4
text-center
">


<div className="
flex
justify-center
gap-2
">


<button

onClick={()=>
navigate(`/app/visit/${visit.id}`)
}

className="
bg-blue-100
text-blue-700
px-4
py-2
rounded-lg
"

>

View

</button>



<button

onClick={()=>
navigate(`/app/visit/edit/${visit.id}`)
}

className="
bg-yellow-100
text-yellow-700
px-4
py-2
rounded-lg
"

>

Edit

</button>



<button

onClick={()=>
handleDelete(visit.id)
}

className="
bg-red-100
text-red-700
px-4
py-2
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


</div>

);


};


export default VisitTable;