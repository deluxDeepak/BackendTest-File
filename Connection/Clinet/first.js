// Taking input 
const button = document.querySelector('button');

function getinput() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
        input.addEventListener("change", (e) => {
            console.log(`${input.type}: ${e.target.value}`);
        })

    })
}
getinput();

button.addEventListener('click', (e) => {
    e.preventDefault();

    // document.querySelectorAll('input') ek NodeList return karta hai, jo ki array jaisa hota hai. Directly addEventListener us par nahi laga sakte, aapko har input par loop lagana hoga.
    
    
})