const nodEmailer = require("nodemailer");
const currentDate = new Date();




exports.signUp = (myEmail)=>{
    
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
                        subject: "Sending email from Nodejs Server",
                        html: `<h3> Thank you for signing up</h3>
                        <p>please confirm your email if probably is not correct ${myEmail} </p>
                        <p>This is the time you sign up : ${currentDate.toDateString()}</P>
                        <p> ${currentDate.getTime()}</p>
                        `
                        }
                        transporter.sendMail(mailOptions, (err, info)=>{
                            if(err) throw err;
                        });
}