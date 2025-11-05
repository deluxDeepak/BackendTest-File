import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import { SocketProvider } from './provider/Socket.jsx'
import Roompage from "./pages/Roompage.jsx"
import { PeerProvider } from "./provider/peer.jsx"


function App() {


  return (

    <div className="App">
      <SocketProvider>
        <PeerProvider>
          <Routes>

            {/* Pure app me socket.io use kar sakte hai  */}
            <Route path="/" element={<Home></Home>}></Route>
            <Route path="/room/:roomId" element={<Roompage />}></Route>
          </Routes>
        </PeerProvider>
      </SocketProvider>
    </div>


  )
}

export default App
