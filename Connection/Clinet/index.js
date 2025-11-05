// // To fetch the data from api Backend 

// // How to fetch the data from front end 
// // Select the element 
// const root = document.getElementById('root');
import axios from "axios";


// const fetchData = async () => {

//     try {
//         const response = await fetch("http://localhost:3000/");
//         console.log(response);

//         // You're trying to use both .text() and .json() on the same response, which is invalid — you can only use one (and only once).

//         // If response is in palin text 
//         const data = await response.text() //Get plain text 
//         const element = document.createElement("h2");
//         element.innerText = data;
//         root.appendChild(element);
//         // If the response is in json fromate (send from the server )
//         // const dataJson = await response.json() //Get json dta 
//         // console.log(data);
//     } catch (error) {
//         console.log("Error: ", error.message)

//     }
// }
// fetchData();



// ******************************************************
// Yehan for ke bahar hai element div {isme overwrite ho reha hai }*
// const root = document.getElementById('root');
// const fetchData = async () => {

//     try {
//         const element = document.createElement("div");
//         element.className = "newclass";

//         const response = await axios.get("http://localhost:3000/user")
//         const Array_data = response.data.data;
//         console.log(Array_data);

//         for (let index = 0; index < Array_data.length; index++) {
//             console.log(Array_data[index]); //Ye ek object ayega 
//             const objData = Array_data[index];

//             element.innerHTML = `
//             <h1>${objData.name}</h1>
//             <h2>${objData.email}</h2>
//             <p>${response.data.collageName}</p>
//             `
//         }
//         root.appendChild(element);
//     } catch (error) {
//         console.log("Error: ", error.message)
//     }
// }
// fetchData();


// 1.Solution =>Sab ander le lo******************************************************
// const root = document.getElementById('root');
// const fetchData = async () => {

//     try {
//         const response = await axios.get("http://localhost:3000/user")
//         const Array_data = response.data.data;
//         console.log(Array_data);

//         for (let index = 0; index < Array_data.length; index++) {
//             console.log(Array_data[index]); //Ye ek object ayega 
//             const objData = Array_data[index];

//             const element = document.createElement("div");
//             element.className = "newclass";

//             element.innerHTML = `
//             <h1>${objData.name}</h1>
//             <h2>${objData.email}</h2>
//             <p>${response.data.collageName}</p>
//             `
//             root.appendChild(element);
//         }
        
//     } catch (error) {
//         console.log("Error: ", error.message)
//     }
// }
// fetchData();













const root = document.getElementById('root');
const fetchData = async () => {

    try {
        const element = document.createElement("div");
        element.className = "newclass";

        const response = await axios.get("http://localhost:3000/user")
        const Array_data = response.data.data;
        console.log(Array_data);

        for (let index = 0; index < Array_data.length; index++) {
            console.log(Array_data[index]); //Ye ek object ayega 
            const objData = Array_data[index];

            element.innerHTML += `
            <h1>${objData.name}</h1>
            <h2>${objData.email}</h2>
            <p>${response.data.collageName}</p>
            `
        }
        root.appendChild(element);
    } catch (error) {
        console.log("Error: ", error.message)
    }
}
fetchData();






// *****************************************************************************





