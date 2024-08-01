
const isemailregix = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };


const uservalidation=({name,email,username,password})=>{
    return new Promise((res,rej)=>{
   if(!name||!email||!username||!password)
   {
  
    rej("Missing user cradentials")
   }
   else if(typeof name==String)
   {
    rej("name should be in string format")
   }
   else if(typeof email==String)
   { 
    rej("email should be in string format")
   }
        console.log("uservalidation",email,name,username,password);
        res();
    })
    
}
module.exports={uservalidation}