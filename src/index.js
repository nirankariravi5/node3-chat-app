const path=require('path')
const express=require('express')
const http=require('http')
const {addUser,removeuser,getUser,getUserInRoom}=require('./utils/users.js')
const socketio=require('socket.io')
const app=express()
const server=http.createServer(app)
const io=socketio(server)
const port=process.env.PORT|| 3000
const publicDirectorypath=path.join(__dirname,'../public')
const {generatemessage,locationmessage}=require('./utils/message.js')

app.use(express.static(publicDirectorypath))
let count=0
io.on('connection',(socket)=>{
    console.log('new web socket connection')
  
   socket.on('join',(options,callback)=>{
       const {error,user}=addUser({id:socket.id,...options})
       if(error){
           return callback(error)
       }
    socket.join(user.room)
    socket.emit('message',generatemessage('Admin','Welcome!'))
    socket.broadcast.to(user.room).emit('message',generatemessage('Admin',user.username+' has joined'))
   io.to(user.room).emit('roomdata',{
       room:user.room,
       users:getUserInRoom(user.room)
   })
    callback()
   })
    
   
    socket.on('sendMessage',(message,callback)=>{
        const user=getUser(socket.id)
        io.to(user.room).emit('message',generatemessage(user.username,message))
            callback('delivered')
        })
    

socket.on('sendLocation',(data,callback)=>{
const user=getUser(socket.id)
io.to(user.room).emit('locationmessage',locationmessage(user.username,'http://google.com/maps?q='+data.latitude+','+data.longitude))
callback()
})
socket.on('disconnect',()=>{
    const user=removeuser(socket.id)
    if(user){
    io.to(user.room).emit('message',generatemessage('Admin',user.username+'  left'))
    
    io.to(user.room).emit('roomdata',{
        room:user.room,
        users:getUserInRoom(user.room)
    })
    
}

})
})
server.listen(port,()=>{

    console.log('the server is on at '+port)

})