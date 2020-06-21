const users=[]

const addUser=({id,username,room})=>{

    

    if(!username||!room){
        return{
        error: 'username and room are required'
    }
}

        username=username.trim().toLowerCase()
        room=room.trim().toLowerCase()
        const existinguser=users.find((user)=>{
       
            return user.room===room && user.username===username

    })
    // console.log(existinguser)
    if(existinguser){
        return{
            error: 'username already in use'
    }
    }
    const user={id,username,room}
    users.push(user)
    return{user}


}
const removeuser=(id)=>{
    const index=users.findIndex((user)=>user.id===id)
   if(index!==-1){
    return users.splice(index,1)[0]
   }
}

addUser({
    id:45,
    username:' jess',
    room:'PK'
})
addUser({
    id:46,
    username:' pess',
    room:'PK'
})
addUser({
    id:47,
    username:' poss',
    room:'PK'
})
const getUser=((id)=> users.find((user)=>user.id===id))


const getUserInRoom=(room)=> {
    room= room.trim().toLowerCase()
    return users.filter((user)=>user.room===room)
}
 
module.exports=({
    addUser,
    removeuser,
    getUser,
    getUserInRoom
})