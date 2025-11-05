import React from "react";
import { useMemo } from "react";
import { io } from "socket.io-client";


// ========================================================================
// Context ek global state management ka tarika hai. Iska use tab karte hain jab ek value (jaise socket) ko pure React component tree me share karna ho without prop drilling (har child me props bhejne ki zarurat nahi hoti).


// ->Ye ek context object banata hai.
// ->SocketProvider usko value deta hai.
// ->Baaki components useContext hook se us value ko consume karte hain.
const SocketContext = React.createContext(null);
// ==============================================================================

export const useSocket = () => {
    return React.useContext(SocketContext);
}


// Isse pure app me socket use kar sakte hai 
export const SocketProvider = (props) => {


    // useMemo ek performance optimization hook hai. Ye ek value ko memoize karta hai (yaani cache me store karta hai), taki har render pe dobara compute na ho.

    // ->Normally agar aap const socket = io(...) likhte, to har render me naya socket connection ban jata.
    // ->useMemo ensure karta hai ki ye connection sirf ek baar banega (kyunki dependency array [] empty hai).
    // ->Har re-render me wahi cached socket return hoga.

    // useMemo → expensive computation ya resource (jaise socket connection) ko baar-baar create hone se bachata hai.



    const socket = useMemo(() => io("http://localhost:8001"), []);





    return (
        <SocketContext.Provider value={{ socket }}>
            {props.children}

        </SocketContext.Provider>
    )
}