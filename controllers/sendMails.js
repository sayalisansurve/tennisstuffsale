const nodemailer=require('nodemailer');

function sendEmail(toEmail, subject,text,url, templateFile) {
        // if (error) console.log(error)
        // console.log("sendEmail");
        var transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
            user:'sayalisansurve@gmail.com',
            // pass:'xwphlrqbsjdvbcun'
            pass:'qowtddtxssvobsho'
        }
        });
        var mailOptions = {
            from: 'sayalisansurve@gmail.com',
            to: toEmail,
            subject: subject,
            text:text,
            // html:`<p>To reset your password <a href=${url}>  ${url}  </a>here</p>`
            html:`<p>To reset your password <a href='${url}'>  ${url}  </a>here</p>`
            
        };       
     
        // info =  transporter.sendMail({
        //     from: 'sayalisansurve@gmail.com', // sender address
        //     to:toEmail, // list of receivers
        //     subject: subject, // Subject line
        //     text:text, // plain text body
        //     html: "<b>Hello world?</b>", // html body
        //   });
        
        transporter.sendMail(mailOptions, function(error, info) {
            // if (error) console.log(error)
            console.log('transporter sendmail')
            if (error){
                        console.log(error);
                    }
                    else
                    {
                        console.log('Email sent:'+ info.response);	
                    }
        });
    };

    module.exports.sendResetEmail=async(email,token)=>{
        var url="http:/localhost:3000";
    }
    module.exports.sendVerifyEmail=async(email,token,url)=>{
        // var url="http:/localhost:3000/user/verifyEmail?token=" +token;
        // console.log(url); 
        sendEmail('sandeepsurvekop@yahoo.co.in',"Email verification",`Click this link to verify `,url)


        // text: `Click this link to verify :${url}`
        // html:`<h3>
        // Click this link to verify :${url}
        // </h3>`
    }