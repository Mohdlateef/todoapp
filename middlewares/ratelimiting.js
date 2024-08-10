const acessmodel=require("../models/acessmodel")
const ratelimiting=async (req,res,next)=>{

const sid=req.session.id;
// console.log(sid ,6)

try {
    const acessDb=await acessmodel.findOne({sessionid:sid})

if(!acessDb)
{
    const acessobj=new acessmodel({
        sessionid:sid,
        time:Date.now(),
    });

    await acessobj.save();
    next();


}
const timeDiff=((Date.now()-acessDb.time)/(1000*60));
if(timeDiff<1)
{
return res.status(400).json("to many request please wait for some time")
}
await acessmodel.findOneAndUpdate({sessionid:sid},{time:Date.now()})

next();
} catch (error) {
    console.log(error)
   return res.status(500).json("backend issue")

}}


module.exports=ratelimiting;