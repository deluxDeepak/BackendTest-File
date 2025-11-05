import React from "react";
import { useMemo } from "react";


const PeerContext = React.createContext(null);


export const usePeer = () => React.createContext(PeerContext);

export const PeerProvider = (props) => {




    // The RTCPeerConnection interface represents a WebRTC connection between the local computer and a remote peer.
    // ->Ek peer create karta hai 
    const peer = useMemo(() =>
        new RTCPeerConnection({
            // You can pass the stun server details here 
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" }
            ]
        })
        , [])




    const createOffer = async () => {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        return offer;
    }


    return (
        <PeerContext.Provider value={{ peer, createOffer }}>
            {props.children}
        </PeerContext.Provider>
    )
}

