import React from 'react'
import { useSocket } from '../provider/Socket';
import { useEffect, useCallback } from 'react';
import { usePeer } from '../provider/peer';


const Roompage = () => {

  // <SocketContext.Provider value={{ socket }}>
  //   {props.children}

  // </SocketContext.Provider>
  const { socket } = useSocket();


  const { peer, createOffer } = usePeer();


  // Heavy use function ko usecallback hook me wrap kar dena chiye 
  const handleNewUserJoined = useCallback(async (data) => {
    const { emailId } = data;
    console.log("New User EmailId", emailId);

    const offer = await createOffer();
    socket.emit('call-user', { emailId, offer });

  }, [createOffer, socket])



  useEffect(() => {
    socket.on('user-joined', handleNewUserJoined)
  }, [socket]);


  return (
    <div className='room-page-container'>Roompage</div>
  )
}

export default Roompage