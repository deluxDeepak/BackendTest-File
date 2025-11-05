// Configuration
const cloudinary=require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'dv4oe7lym',
    api_key: '771243241497749',
    api_secret: 'S3MfeQHzo2iXlilSrF6lrgi5_ME' // Click 'View API Keys' above to copy your API secret
});
module.exports=cloudinary;
