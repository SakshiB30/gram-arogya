import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { createVisit } from "../../redux/slices/visitSlice";


const AddVisit = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const [formData,setFormData] = useState({
    beneficiaryId:"",
    visitType:"",
    status:"Pending",
    notes:""
  });


  const [loading,setLoading] = useState(false);



  const handleChange=(e)=>{

    setFormData(prev=>({
      ...prev,
      [e.target.name]:e.target.value
    }));

  };



  const handleSubmit=async(e)=>{

    e.preventDefault();

    setLoading(true);


    try{

      await dispatch(
        createVisit(formData)
      ).unwrap();


      navigate("/app/visit");


    }
    catch(err){

      alert(
        err || "Failed to create visit"
      );

    }
    finally{

      setLoading(false);

    }

  };



return (

<div className="
min-h-screen
bg-gray-100
flex
items-center
justify-center
p-6
">


<div className="
bg-white
w-full
max-w-2xl
rounded-3xl
shadow-lg
p-8
">


<h1 className="
text-3xl
font-bold
text-gray-800
">

Add New Visit

</h1>


<p className="
text-gray-500
mt-2
mb-8
">

Create beneficiary visit record

</p>




<form
onSubmit={handleSubmit}
className="space-y-6"
>



<div>

<label className="block mb-2 font-medium">

Beneficiary ID

</label>


<input

type="text"

name="beneficiaryId"

value={formData.beneficiaryId}

onChange={handleChange}

required

placeholder="Enter Beneficiary ID"

className="
w-full
border
rounded-xl
px-4
py-3
outline-none
focus:ring-2
focus:ring-blue-500
"

/>

</div>





<div>

<label className="block mb-2 font-medium">

Visit Type

</label>


<select

name="visitType"

value={formData.visitType}

onChange={handleChange}

required

className="
w-full
border
rounded-xl
px-4
py-3
"

>

<option value="">
Select Visit Type
</option>

<option>
Home Visit
</option>

<option>
Follow Up
</option>

<option>
Vaccination
</option>

<option>
ANC Checkup
</option>

<option>
PNC Visit
</option>


</select>


</div>





<div>

<label className="block mb-2 font-medium">

Status

</label>


<select

name="status"

value={formData.status}

onChange={handleChange}

className="
w-full
border
rounded-xl
px-4
py-3
"

>


<option>
Pending
</option>

<option>
Completed
</option>

<option>
Cancelled
</option>


</select>


</div>





<div>

<label className="block mb-2 font-medium">

Notes

</label>


<textarea

rows="4"

name="notes"

value={formData.notes}

onChange={handleChange}

className="
w-full
border
rounded-xl
px-4
py-3
"

/>


</div>





<div className="
flex
justify-end
gap-4
">


<button

type="button"

onClick={()=>
navigate("/app/visit")
}

className="
px-6
py-3
border
rounded-xl
"

>

Cancel

</button>



<button

disabled={loading}

className="
bg-blue-600
text-white
px-6
py-3
rounded-xl
"

>

{
loading?
"Saving..."
:
"Save Visit"
}


</button>


</div>


</form>


</div>


</div>

);


};


export default AddVisit;