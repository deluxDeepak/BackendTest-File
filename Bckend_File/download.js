// const express = require('express');
// const axios = require('axios');
// const ytdl = require('ytdl-core');
// const { exec } = require('child_process');
// const app = express();

// app.get('/generate', async (req, res) => {
//     const link = req.query.url;
//     if (!link) return res.send("URL missing");

//     try {
//         // YouTube
//         if (link.includes('youtube.com') || link.includes('youtu.be')) {
//             const info = await ytdl.getInfo(link);
//             const format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });
//             return res.redirect(format.url);
//         }

//         // Vimeo, Facebook, HLS => yt-dlp
//         else if (link.includes('vimeo.com') || link.includes('facebook.com') || link.includes('.m3u8')) {
//             exec(`yt-dlp -g "${link}"`, (err, stdout, stderr) => {
//                 if (err) return res.status(500).send("Error: " + stderr);
//                 return res.redirect(stdout.trim());
//             });
//         }

//         // Direct file
//         else if (/\.(mp4|pdf|jpg|png|zip|mp3)$/.test(link)) {
//             return res.redirect(link);  // Direct download
//         }

//         // Shortened/Redirect URLs
//         else {
//             const response = await axios.get(link, { maxRedirects: 5 });
//             return res.redirect(response.request.res.responseUrl);
//         }

//     } catch (error) {
//         res.status(500).send("Something went wrong: " + error.message);
//     }
// });

// app.listen(3000, () => {
//     console.log('Server started on http://localhost:3000');
// });



// const express = require('express');
// const YTDlpWrap = require('yt-dlp-wrap').default;
// const ytDlpWrap = new YTDlpWrap();

// const app = express();

// app.get('/generate', async (req, res) => {
//     const link = req.query.url;
//     if (!link) return res.status(400).send("Missing URL");

//     let result = '';

//     try {
//         const execPromise = ytDlpWrap.execStream([
//             '-g',  // Get direct video/audio URL
//             link
//         ]);

//         execPromise.stdout.on('data', (data) => {
//             result += data.toString();
//         });

//         execPromise.stdout.on('end', () => {
//             const downloadLink = result.trim();
//             if (downloadLink) {
//                 return res.redirect(downloadLink);
//             } else {
//                 return res.status(500).send("Could not extract download link.");
//             }
//         });

//         execPromise.stderr.on('data', (err) => {
//             console.error("yt-dlp error:", err.toString());
//         });

//     } catch (err) {
//         console.error("Error running yt-dlp:", err);
//         return res.status(500).send("Something went wrong.");
//     }
// });

// app.listen(3000, () => {
//     console.log('🚀 Server running on http://localhost:3000');
// });




// const express = require('express');
// const YTDlpWrap = require('yt-dlp-wrap').default;

// // The node:path module provides utilities for working with file and directory paths. It can be accessed using
// const path = require('path');

// const app = express();

// // Give correct path to yt-dlp.exe
// const ytDlpPath = path.join(__dirname, 'yt-dlp.exe');
// const ytDlpWrap = new YTDlpWrap(ytDlpPath);

// app.get('/generate', async (req, res) => {
//     const link = req.query.url;
//     if (!link) return res.status(400).send("Missing URL");

//     try {
//         const output = await ytDlpWrap.exec(['-g', link]);

//         const realURL = output.trim().split('\n')[0];
//         console.log("🎯 Download URL:", realURL);

//         if (realURL) {
//             res.redirect(realURL);
//         } else {
//             res.status(500).send("Could not extract download link.");
//         }
//     } catch (err) {
//         console.error("Error:", err);
//         res.status(500).send("Error: " + err.message);
//     }
// });

// app.listen(3000, () => {
//     console.log("🚀 Server running at http://localhost:3000");
// });




// const express = require('express');
// const YTDlpWrap = require('yt-dlp-wrap').default;
// const path = require('path');

// const app = express();

// // Path to yt-dlp.exe (adjust as needed)
// const ytDlpPath = path.join(__dirname, 'yt-dlp.exe');
// const ytDlpWrap = new YTDlpWrap(ytDlpPath);

// app.get('/generate', async (req, res) => {
//     const link = req.query.url;
//     if (!link) return res.status(400).send("❌ Missing YouTube URL");

//     try {
//         const output = await ytDlpWrap.exec(['-g', link]);

//         // Ye chal reha hai 
//         // console.log("🎥 Formats:", output);


//         const links = output.trim().split('\n'); // always split output
//         console.log("✅ Direct download link(s):", links);
//         // const realURL = output[0];  // Direct stream link

//         if (links) {
//             res.redirect(links);  // Open in browser
//         } else {
//             res.status(500).send("❌ No link extracted");
//         }
//     } catch (err) {
//         console.error("💥 yt-dlp error:", err);
//         res.status(500).send("Error: " + err.message);
//     }
// });

// app.listen(3000, () => {
//     console.log("🚀 Server started at http://localhost:3000");
// });


// const YTDlpWrap = require('yt-dlp-wrap').default;
// const ytDlpWrap = new YTDlpWrap("D:\\Backend\\Bckend_File\\yt-dlp.exe");

// const getDownloadLink = async (link) => {
//     try {
//         const output = await ytDlpWrap.execPromise([
//             //  '--user-agent', '"Mozilla/5.0..."',
//             // '--user-agent', 'Mozilla/5.0',
//             '--no-playlist',
//             '--no-check-certificate',
//             '--cookies', 'cookies.txt',
//             '-g', link]);  // FIXED

//         const links = output.trim().split('\n'); // Now will work
//         console.log("✅ Direct download link(s):", links);

//         return links[0]; // Main download link
//     } catch (err) {
//         console.error("❌ yt-dlp error:", err);
//     }
// };

// getDownloadLink("https://faphouse2.com/videos/9KEuSX#dmVwPVNlYXJjaCBwYWdlJnNtdD1zZWFyY2gtcmVzdWx0cw==");
// https://xhamster1.desi/videos/indian-porn-star-sanjana-gang-bang-video-7inch-huge-cock-raj-and-new-bodybuilder-boy-hardcore-fuck-xhaHeF6



const { exec } = require('child_process');

const getDownloadLink = (url) => {
    exec(`python D:/Backend/Bckend_File/getlink.py "${url}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Exec error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`⚠️ Stderr: ${stderr}`);
        }
        console.log(`✅ Download Link: ${stdout.trim()}`);
    });
};

// Example
getDownloadLink("https://xhaccess.com/videos/desi-indian-bhabhi-ko-hotel-me-meeting-sari-me-full-entertainment-xhEcZCB");
