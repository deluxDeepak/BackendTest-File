const eventEmmiter=require('events');

// Create the instanse 
const myEmitter=new eventEmmiter();

// Agar ek event ke liye multiple .on() listeners hain, to jab  .emit() karte ho, us event ke saare listeners sequentially execute hote hain.
myEmitter.on("greet",(name)=>{
    console.log(`My name is ${name}`);

})
myEmitter.on("greet",(age)=>{
    console.log(`My age is ${age}`);

})
myEmitter.emit("greet", "Deepak");  // 🔹 "greet" trigger hua
// → listener #1 chalega: name = "Deepak"
// → listener #2 chalega: age = "Deepak"

myEmitter.emit("greet", 34);        // 🔹 "greet" trigger hua
// → listener #1 chalega: name = 34
// → listener #2 chalega: age = 34

// Solution ***************8
myEmitter.on("geet1",(name,age)=>{
    console.log(`My name is ${name}`);
    console.log(`My age is ${age}`);
})
myEmitter.emit("greet1","Deepak",12);
