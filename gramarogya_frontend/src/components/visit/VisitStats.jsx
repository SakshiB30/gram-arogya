const VisitStats = ({
    total,
    completed,
    pending,
    cancelled
})=>{


const stats=[

{
title:"Total Visits",
value:total
},

{
title:"Completed",
value:completed
},

{
title:"Pending",
value:pending
},

{
title:"Cancelled",
value:cancelled
}

];



return (

<div className="
grid
grid-cols-1
md:grid-cols-4
gap-6
mb-8
">


{
stats.map(
(stat)=>(

<div

key={stat.title}

className="
bg-white
rounded-2xl
shadow
p-6
"

>


<p className="
text-gray-500
text-sm
">

{stat.title}

</p>



<h2 className="
text-3xl
font-bold
text-gray-800
mt-3
">

{stat.value}

</h2>



</div>

)

)

}



</div>

);


};


export default VisitStats;