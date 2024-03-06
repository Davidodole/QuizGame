const nodEmailer = require("nodemailer");
const currentDate = new Date();



exports.Login = (myEmail)=>{
    // setting a email transporter 
    const transporter = nodEmailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.API_GMAIL,
            pass: process.env.API_PASSWORD,
        }
        });
        const mailOptions = {
        from: {
            name: "TechGenius",
            address: process.env.API_GMAIL,
        },
        to: myEmail,
        subject: "You've Just Login",
        html: `<h3>Detect New Login</h3>
        <p>If you didn't perform this login</p>
        <p>please report this to the web developer: ${process.env.API_GMAIL}</p>
        <p> ${currentDate.toDateString()}</P>
        <p> ${currentDate.getTime()}</p>
        `
        }
        transporter.sendMail(mailOptions, (err, info)=>{
            if(err) throw err;
        });
}