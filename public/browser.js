// const { response } = require("express");

window.onload=genrateTodos;
const iteam_list=document.getElementById("item_list")
function genrateTodos(){
  axios.get("/read_iteams").then((response)=>{
    console.log(response.data.tododb)
    const listiteams=response.data.tododb;
    listiteams.map((iteam)=>{
     const newiteamlists=document.createElement("li");
     newiteamlists.classList="newIteamLists"
     const li=document.createElement("p");
     li.innerText="hey"
    //  newiteamlists.appendChild(li);
     console.log(newiteamlists)
       newiteamlists.innerHTML=`<p id="edit_text">${iteam.todo}</p>
        <button id=${iteam._id} class="Edit_btn">Edit</button> <button id= ${iteam._id} class="Delete_btn">delete</button>`
   iteam_list.appendChild(newiteamlists);
    })})

  }


  document.addEventListener("click",(event)=>{
    

    // editTodos
if(event.target.classList=="Edit_btn")
{

 const editText=prompt("enter New data");
 const _id=event.target.id;
axios.post("/edit_iteam",{editText,_id}).then((res)=>{
    console.log(res)
}).catch((error)=>{
    console.log(error)
})
}
if(event.target.classList=="Delete_btn")
{
    console.log("delte")
   const _id=event.target.id;
   console.log(_id)
   axios.post("/delete_iteam",{_id}).then((res)=>{
    console.log(res)
   }).catch((error)=>{
    console.log(error)
   })
}
  })
  






