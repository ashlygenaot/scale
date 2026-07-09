import Climb from "../models/Climb.js";
import Session from "../models/Session.js";


export const getAnalytics = async (req,res)=>{

try {

const userId = req.user.id;


// sessions
const sessions = await Session.countDocuments({
    user:userId
});


// climbs
const climbs = await Climb.find({
    user:userId
});



const totalClimbs = climbs.length;


const sends = climbs.filter(
    c => c.status === "send" || c.status === "flash"
).length;



const projects = climbs.filter(
    c => c.status === "project"
).length;



const sendRate =
totalClimbs === 0
? 0
: Math.round((sends / totalClimbs) * 100);



// highest grade
const grades = climbs
.map(c=>c.grade)
.filter(Boolean);



res.json({

success:true,

stats:{
    sessions,
    totalClimbs,
    sends,
    projects,
    sendRate
},

grades

});


}catch(error){

res.status(500).json({
message:error.message
});

}


};