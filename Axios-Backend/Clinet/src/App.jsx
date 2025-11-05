import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react';
import UserInput from './Components/UserInput';
import { Link, Route, Routes } from 'react-router';
import Socket from './Components/Socket';


const App = () => {

  // to fetch the data (usestate me denge )
  // =>Dta fetch karke save karna 
  // =>Error handling 
  // =>Loding status show karna 
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://localhost:3000/user");
      setData(response.data);

    } catch (error) {
      // Request failed with status code 404 (ye ayega error matlab url fetching galat hai )
      setError(error.message || "Somthing error");

    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchData();

  },[])


  return (

    <>
    <div>
      {loading && <p>Loading....</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {/* Agr data show karna hai array ka to map use kar sakte hai  */}
      {
        data.map((user,index) => (
          <div key={index}>
            <h1>{`Name of Student: ${user.name}`}</h1>
            <h2>{`Name of Student: ${user.collegeName}`}</h2>
            <h2>{`Name of Student: ${user.registrationNumber}`}</h2>
          </div>

        ))
      }
    </div>

    <UserInput></UserInput>


    <Routes>
      <Route path='/user' element={<Socket></Socket>}>
      </Route>
    </Routes>
  
    <div>

    </div>
    </>

  )
}

export default App