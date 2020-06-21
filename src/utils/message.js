const generatemessage=(username,message)=>{
    return {
        username,
        message,
        createdAt:new Date().getTime()
}
}
const locationmessage=(username,url)=>{
    return{
        username,
        url,
        createdat:new Date().getTime()
    }
}

module.exports={
    generatemessage,
    locationmessage
}