const { exec } = require("child_process");


// Option 1: Full absolute path
exec("D:/Backend/Bckend_File/Calculator.exe ", (error, stdout, stderr) => {
    if (error) {
        console.error("Error:", error.message);
        return;
    }
    // Agr jaosn me bhej rehe hai to parse bhi karna parega directly acces nahi kar sakte hai 
    try {
        const data = JSON.parse(stdout);
        console.log("Name from cpp: ", data.name);
        console.log("Age from cpp : ", data.age);


    } catch (error) {
        console.log("INvalid json output:", error.message);

    }
});





// **************************Calculator ********************************

// const { spawn } = require('child_process');

// // Get CLI args
// const args = process.argv.slice(2);
// const [choice, num1, num2] = args;

// if (!choice || !num1 || !num2) {
//     console.log("Usage: node calculatorRunner.js <choice> <num1> <num2>");
//     process.exit(1);
// }

// const calculator = spawn('Calculator.exe');

// calculator.stdout.on('data', (data) => {
//     console.log(`Output: ${data}`);
// });

// calculator.stderr.on('data', (data) => {
//     console.error(`Error: ${data}`);
// });

// calculator.on('close', (code) => {
//     console.log(`Child process exited with code ${code}`);
// });

// // Delay-based input
// function delayInput(input, delay) {
//     setTimeout(() => {
//         calculator.stdin.write(input + '\n');
//     }, delay);
// }

// delayInput(choice, 500);
// delayInput(num1, 1000);
// delayInput(num2, 1500);
// delayInput('4', 2000); // exit
