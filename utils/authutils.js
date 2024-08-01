const uservalidation=({name,email,username,password})=>{
    return new Promise((res,rej)=>{
   if(!name||!email||!username||!password)
   {
    rej("Missing user cradentials")
   }
        console.log("uservalidation",email,name,username,password);
        res();
    })
}
module.exports={uservalidation}