// const message = require("../../src/utils/message")

const socket=io()
const $forminputbutton=document.querySelector('input')
const $formsendbutton=document.querySelector('button')
const $formsubmitbutton=document.querySelector('#messageform')
const $sendlocationbutton=document.querySelector('#send-location')
const $message=document.querySelector('#message')
const messagetemplate=document.querySelector('#message-template').innerHTML
const locationmessagetemplate=document.querySelector('#locationmessage-template').innerHTML
const sidebartemplate=document.querySelector('#sidebar-template').innerHTML
//require('../../src/utils/message.js')
const autoscroll=()=>{
    const $newMessage=$message.lastElementChild
    const newMessageStyles=getComputedStyle($newMessage)
    const newMessageMargin=parseInt(newMessageStyles.marginBottom)
    const newMessageHeight=$newMessage.offsetHeight+newMessageMargin
    const visibleHeight=$message.offsetHeight
    const containerHeight=$message.scrollHeight
    const scrollOffset=$message.scrollTop+visibleHeight
    if(containerHeight-newMessageHeight<=scrollOffset){
        $message.scrollTop=$message.scrollHeight
    }
}
socket.on('message',(message)=>{
    // console.log(message)
    const html=Mustache.render(messagetemplate,{
            username:message.username,
            message:message.message,
            createdat:moment(message.createdat).format('h:mm:a')
    })
    $message.insertAdjacentHTML("beforeend",html)
    autoscroll()
})


socket.on('locationmessage',(msg)=>{
const html=Mustache.render(locationmessagetemplate,{
    username:msg.username,
    url:msg.url,
    createdat:moment(msg.createdat).format('h:mm:a')
})
$message.insertAdjacentHTML("beforeend",html)
autoscroll()
})
socket.on('roomdata',({room,users})=>{
const html= Mustache.render(sidebartemplate,{
room,
users
})
document.querySelector('#sidebar').innerHTML=html

})



document.querySelector('#messageform').addEventListener('submit',(e)=>{
    e.preventDefault()
    
    const message=e.target.elements.message.value
    $formsendbutton.setAttribute('disabled','disabled')

    socket.emit('sendMessage',message,(message)=>{
        console.log('message is'+message)
    })
    $formsendbutton.removeAttribute('disabled')
    $forminputbutton.value=''
    $forminputbutton.focus()
    })
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})
document.querySelector('#send-location').addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('geolocation is supported on your browser')
    }
    $sendlocationbutton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((GeoLocationPosition)=>{
        // console.log(GeoLocationPosition)
        socket.emit('sendLocation',{
            latitude:GeoLocationPosition.coords.latitude,
            longitude:GeoLocationPosition.coords.longitude},()=>{
                console.log('location is shared')
                $sendlocationbutton.removeAttribute('disabled')
            })
     })
 })
 
 socket.emit('join',{username,room },(error)=>{
        if(error){
            alert(error)
            location.href='/'
        } })