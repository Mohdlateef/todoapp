
const isEmailValidate = ({ key }) => {
  const isEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
      key
    );
  return isEmail;
};

const uservalidation=({name,email,username,password})=>{

    return new Promise((res,rej)=>{
   if(!name||!email||!username||!password)
   {
  
    rej("Missing user cradentials")
   }
   else if(typeof name !== "string")
   {
    rej("name should be in string format")
   }
   else if(!isEmailValidate({key:email}))
   { 
    rej("format of email is incorrect")
   }
        // console.log("uservalidation",email,name,username,password);
        res();
    })
    
}
const loginvalidation=({loginId,password})=>

{
  return new Promise((res,rej)=>{
  if(!loginId||!password)
  {
    rej("missing user cradentials")
  }
  if(typeof loginId!=='string')
  {
    rej("login id should ne string format");
  }
  if(typeof password!=='string')
  {
    rej ("password should be string");
  }
  res();
})}
module.exports={uservalidation,loginvalidation,isEmailValidate}