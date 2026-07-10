import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, UserRound, CalendarCheck, Activity, Pill } from "lucide-react";
import { useNavigate } from "react-router-dom";


import {
  searchAll,
  clearSearch,
} from "../../redux/slices/searchSlice";


const GlobalSearch = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const {
    results,
    loading,
  } = useSelector(
    (state) => state.search
  );


  const [keyword, setKeyword] = useState("");
  const [open, setOpen] = useState(false);



  useEffect(() => {

    const timer = setTimeout(() => {

      if(keyword.trim().length > 1){

        dispatch(
          searchAll(keyword)
        );

        setOpen(true);

      }
      else{

        dispatch(clearSearch());

        setOpen(false);

      }

    },500);


    return () => clearTimeout(timer);


  },[keyword,dispatch]);




  const getIcon = (type)=>{

    switch(type){

      case "BENEFICIARY":
        return <UserRound size={18}/>;

      case "VISIT":
        return <CalendarCheck size={18}/>;

      case "HEALTH_RECORD":
        return <Activity size={18}/>;

      case "MEDICINE":
        return <Pill size={18}/>;

      default:
        return <Search size={18}/>;

    }

  };





  const handleClick=(item)=>{

    navigate(item.route);

    setKeyword("");

    setOpen(false);

    dispatch(clearSearch());

  };




return (

<div className="relative w-full max-w-md">


{/* Search Input */}

<div
className="
flex
items-center
gap-3
rounded-full
border
border-slate-200
bg-slate-50
px-4
py-2.5
focus-within:bg-white
focus-within:ring-2
focus-within:ring-blue-500/20
"
>

<Search
size={18}
className="text-slate-400"
/>


<input

type="text"

value={keyword}

onChange={(e)=>setKeyword(e.target.value)}

placeholder="Search beneficiary, visit, medicine..."

className="
w-full
bg-transparent
text-sm
outline-none
text-slate-700
"

/>


{
loading &&
<span className="text-xs text-slate-400">
Searching...
</span>
}


</div>





{/* Dropdown */}

{
open && results.length > 0 && (

<div
className="
absolute
top-14
left-0
right-0
z-50
overflow-hidden
rounded-xl
border
border-slate-200
bg-white
shadow-xl
"
>


{
results.map((item)=>(


<button

key={item.id}

onClick={()=>handleClick(item)}

className="
flex
w-full
items-center
gap-3
px-4
py-3
text-left
hover:bg-slate-50
"

>


<div
className="
flex
h-9
w-9
items-center
justify-center
rounded-full
bg-blue-100
text-blue-600
"
>

{getIcon(item.type)}

</div>



<div>

<p
className="
text-sm
font-medium
text-slate-800
"
>
{item.title}
</p>


<p
className="
text-xs
text-slate-500
"
>
{item.subtitle}
</p>


</div>


</button>


))
}



</div>

)

}



</div>

);


};


export default GlobalSearch;