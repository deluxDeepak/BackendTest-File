// Taking the input only 
import axios from 'axios'
import { useState } from 'react'

const UserInput = () => {
    const [name, Setname] = useState("")
    const [college, SetCollege] = useState("")
    const [reg, Setreg] = useState("")


    // Bckend ka message store karne ke liye ya dikhane ke liye 
    const [responseMessage,setResponseMessage]=useState("");

    // Varible ka name alag ho sakta hai lekin keys same dena hoga object me 
    const data = {
        name,
        collegeName:college,  //Key backend se match karna chiye 
        RegistrationNumber:reg
    }

    // Jab handleSubmit pe click karenge to (form ka data backend ke pass jana chiye )
    const handleSubmit = async (e) => {
        e.preventDefault();

        const response=await axios.post("http://localhost:3000/user",data);
        setResponseMessage(response.data.message); //json message
    }



    return (
        <div>
            <form action="" onSubmit={handleSubmit}>
                <label htmlFor="">Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => Setname(e.target.value)}
                />

                <label htmlFor="">CollegeName:</label>
                <input
                    type="text"
                    value={college}
                    onChange={(e) => SetCollege(e.target.value)}
                />

                <label htmlFor="">Registration Number:</label>
                <input
                    type="text"
                    value={reg}
                    onChange={(e) => Setreg(e.target.value)}
                />
                <button >Submit</button>
            </form>

            {/* Agr initlly ui pe show nahi karna hai koi button click karne ke baad show karna hai to ye use kar sakte hai  */}
            
            {responseMessage && <h2>{`"Respose Message from the server:"${responseMessage}`}</h2> }

        </div>
    )
}

export default UserInput