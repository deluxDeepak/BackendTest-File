import React, { useEffect, useState } from 'react'
import {io} from 'socket.io-client'

// Agar tum direct component ke andar io() call karoge, to React har render pe naya connection bana dega.
// Isse multiple duplicate connections ho sakte hain.
// Isliye useEffect me connection bana ke cleanup karna best practice hai.


const Socket = () => {

  const [msg,setmsg]=useState("");


  const SocketConnect=()=>{
    // Instance create karna hua 
    const socket=io("http://localhost:3000");


    // Ab connection ceate karenge 
    // connect sirf ek notification event hai jo tumhe batata hai ki connection successful ho gaya.{Hata denge tab bhi mast chalega }
    socket.on("connect",()=>{
      console.log("✅Connected to the Server",socket.id);
    })

    // Server se msg Recive karna 
    socket.on("message",(msg)=>{
      console.log("Message from the server",msg);
      setmsg(msg);
    })

    // Server ko msg bhejna 
    socket.emit("clintMessage","Helow I am Deepak");



    socket.on("disconnect",()=>{
      console.log("❌ Disconnected to Server");
    })
  }

  useEffect(()=>{
    SocketConnect();

  },[])
    
  return (
    <div>
      <h1>Msg From the Server : {msg}</h1>
    </div>
  )
}

export default Socket