const say = require('say');

// Text to speech
say.speak("Hello Deepak this Test is good for you to take High quality voices \nMultiple languages, Hindi supported \n Customizable pitch, speed, gender");

// Optional callback
say.speak("Hello!", "Microsoft Zira Desktop", 1.0, (err) => {
  if (err) return console.error(err);
  console.log("Text has been spoken!");
});



// const say = require('say');

// // Windows voice names check karne ke liye
// // Control Panel -> Speech Recognition -> Text to Speech -> Voice

// say.speak("नमस्ते, यह एक टेस्ट है।", "Microsoft Hindi", 1.0, (err) => {
//   if (err) console.error(err);
//   else console.log("Spoken!");
// });
