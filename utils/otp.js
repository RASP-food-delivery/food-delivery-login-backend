const nodemailer = require("nodemailer");
const { randomBytes } = require("node:crypto")

const generateOtp = () => {
    return randomBytes(3).toString('hex');
}

const sendOtp = (email, OTP) =>{
    const transporter = nodemailer.createTransport({
        service : "gmail", 
        auth : {
            user : process.env.EMAIL_SERVICE_USER,
            pass : process.env.EMAIL_SERVICE_PASS,
        },
    })

    const mailoptions = {
        from : process.env.EMAIL_SERVICE_USER, 
        to : email,
        subject : "OTP FOR CAMPDEL",
        text : `Your OTP IS : ${OTP}`
    }

    transporter.sendMail(mailoptions, (error, info) => {
        if(error){
            console.log(error);
        }
        else {
            console.log("Email sent : " + info.response)
        }
    })
};


const sendOtpV = () =>
{
    
}
module.exports = { generateOtp, sendOtp }