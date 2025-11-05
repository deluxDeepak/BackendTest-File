SDP Message Overview
After creating a peer connection, you should exchange SDP (Session Description Protocol), which is a standard format for describing multimedia communication sessions for a peer-to-peer connection.

This text-based protocol acts as a contract between peers, defining not only what media types and codecs are supported, but also specifying network information, security parameters, and session timing details. The protocol follows a structured format where each line begins with a single character identifier followed by an equals sign and the associated value.

The SDP negotiation process is critical for ensuring interoperability between different browsers, devices, and WebRTC implementations. Each peer generates its own SDP based on its local capabilities, available codecs, supported media formats, and network configuration. When these SDPs are exchanged, both peers can determine the intersection of their capabilities and establish the optimal configuration for their communication session.

The SDP includes essential information for making a peer connection, such as Codec, source address, media types of audio and video, and other associated properties,


This SDP example demonstrates the hierarchical structure where session-level information is defined first, followed by media-level descriptions. The version line (v=0) indicates SDP version, while the origin line (o=) contains session identification and versioning information. Media lines (m=) define individual media streams with their respective transport ports and payload types, while attribute lines (a=) provide additional codec-specific information such as payload type mappings and codec parameters.

Modern WebRTC implementations generate much more complex SDPs that include additional attributes for advanced features like simulcast, scalable video coding, redundancy mechanisms, and security parameters. These SDPs also contain bandwidth information, preferred codec orderings, and various WebRTC-specific extensions that enable features like data channels and advanced media routing.





This SDP example demonstrates the hierarchical structure where session-level information is defined first, followed by media-level descriptions. The version line (v=0) indicates SDP version, while the origin line (o=) contains session identification and versioning information. Media lines (m=) define individual media streams with their respective transport ports and payload types, while attribute lines (a=) provide additional codec-specific information such as payload type mappings and codec parameters.

Modern WebRTC implementations generate much more complex SDPs that include additional attributes for advanced features like simulcast, scalable video coding, redundancy mechanisms, and security parameters. These SDPs also contain bandwidth information, preferred codec orderings, and various WebRTC-specific extensions that enable features like data channels and advanced media routing.

Each peer can figure out what types of Codec or media will be delivered by exchanging SDP messages. Let's see a scenario that Alice and Bob want to connect on a video call:

    Alice suggests a peer connection with Bob by creating an SDP Offer that the signaling server will deliver.
    Bob accepts the SDP Offer and responds by creating an SDP Answer that the signaling server will deliver.
    Alice accepts the SDP Answer, and they will prepare to establish a connection between them.

This offer-answer model follows the Session Initiation Protocol (SIP) paradigm, ensuring a structured negotiation process. The offer represents Alice's proposal for the session, including her preferred codecs, media types, and capabilities. Bob's answer serves as both an acceptance of the session and a counter-proposal that specifies which of Alice's offered capabilities he can support and his own preferences within those constraints.

The negotiation process is inherently asymmetric, with the offerer (Alice) taking the initiative and the answerer (Bob) responding within the constraints of the offer. This asymmetry helps resolve conflicts and ensures deterministic outcomes when both peers have different preferences or capabilities. The process also allows for graceful fallbacks when certain features or codecs aren't mutually supported.

The steps above can be drawn like the figure below:

The local peer (Alice) sends a SDP Offer and the remote peer (Bob) return a SDP Answer, and then it's ready for establishing a peer connection.











Create an SDP Answer

After receiving the SDP offer message from the local peer, the remote peer should return an SDP answer message to the local peer. You can create an SDP answer with the RTCPeerConnection.createAnswer() method, which contains information about media sessions, codecs and options supported by browser to reply to the local peer:
const answer = await remotePeerConnection.createAnswer();




The createAnswer method generates an SDP that represents the intersection of the remote peer's capabilities with what was offered by the local peer. Unlike createOffer, which represents maximum capabilities, createAnswer is constrained by the received offer and can only include media types, codecs, and configurations that were explicitly offered or are compatible with the offered session.

The answer generation process involves careful codec negotiation where the answering peer selects from the offered codecs based on its own preferences and capabilities. For each media line in the offer, the answerer must either accept it (potentially with modified parameters), reject it by setting the port to zero, or propose alternative configurations within the constraints of the original offer.

The answerer also has the opportunity to specify additional parameters that weren't fully defined in the offer, such as specific codec configurations, bandwidth limitations, or media format preferences. However, these additions must remain within the bounds of what the offerer proposed, ensuring the final negotiated session is acceptable to both peers.

Now let's assume the local peer received an SDP answer from a signaling server. Then the local peer connection should set the SDP answer message as a remote description and make it clear the peer connection has established:

<!-- SDP answer Ane ke baad remote discription set karega  -->
await localPeerConnection.setRemoteDescription(desc);