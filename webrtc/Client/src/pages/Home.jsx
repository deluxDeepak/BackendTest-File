import React from 'react'
import { useSocket } from '../provider/Socket'
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



const Home = () => {

    const { socket } = useSocket();
    // Backend me ye likha hai 
    // socket.on("joined-room", data => {})
    // socket.emit('joined-room',{roomId:"1",emailId:"example@gamil.com"});


    const [email, setEmail] = useState("");
    const [roomId, setRoomId] = useState("");


    // Jab onclick kam karega tab ye use karenge 
    const handleJoinRoom = () => {
        socket.emit('joined-room', { emailId: email, roomId });


    }


    // ====================After room joined logic ================
    // redirect after room joined 

    const navigate=useNavigate();

    const handleRoomJoined = ({ roomId }) => {
        // yehan se redirect karna hai isko 
        // useNavigate hook ka use karke 
        console.log("You haved joined this room sucessfully", roomId);
        navigate(`/room/${roomId}`);


    }

    useEffect(() => {
        socket.on("joinedyour-room", handleRoomJoined);

        return () => {
            socket.off("joinedyour-room", handleRoomJoined);
        };
    }, [socket]);
    // ============================================-========================




    return (
        <div className='homepage-container'>
            <div className='input-container'>
                <input
                    value={email} onChange={e => setEmail(e.target.value)} type="text" placeholder='Enter your email here'
                />
                <input
                    value={roomId} onChange={e => setRoomId(e.target.value)} type="text" placeholder='Enter Room Code'
                />
                <button onClick={handleJoinRoom}>Enter Room</button>
            </div>
        </div>
    )
}

export default Home