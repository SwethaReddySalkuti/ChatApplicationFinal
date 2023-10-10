const uuid = require('uuid');
const bcrypt = require('bcrypt');
const {createTransport} = require('nodemailer');

const User = require('../models/user');
const Forgotpassword = require('../models/forgotpassword');

const transporter = createTransport({         // creating instance
    host:"smtp-relay.sendinblue.com",
    port:587,
    auth : {
        user : "salkutiswethareddy@gmail.com",
        pass : "xsmtpsib-277812e098f86ecddde4335821812cb4c9dae3b89ba110cd8835488a48af0e9e-Uqsv7XTtnk5VFBfg"
    }
});


const forgotpassword = async (req, res) => {
    try {
        const { email } =  req.body;
        const user = await User.findOne({where : { email }});
        console.log(user);
        if(user)
        {
            const id = uuid.v4();       // unique 32 bit alpha-numeric string //version 4
            user.createForgotpassword({ id , active: true })
                .catch(err => {
                    throw new Error(err)
                })

            

            const msg = {
                to: email, //  Recipient
                from: 'salkutiswethareddy@gmail.com', //  Sender
                subject: 'Sending Password Reset Mail using SendGrid',
                text: 'Pls reset password using below link',
                html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
            }

            transporter
            .sendMail(msg, function(err,response)
            {
                if(err)
                {
                    console.log(err)
                }
                else
                {
                    return res.status(response[0].statusCode).json({message: 'Reset password link is sent to your mail ', sucess: true})
                }
  
                

            })
        }
        else 
        {
            throw new Error('User does not exist')
        }
    } catch(err){
        console.error(err)
        return res.json({ message: err, sucess: false });
    }

}

const resetpassword = (req, res) => {
    const id =  req.params.id;
    Forgotpassword.findOne({ where : { id }}).then(forgotpasswordrequest => {
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                        }
                                    </script>

                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()

        }
    })
}

const updatepassword = (req, res) => {

    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        Forgotpassword.findOne({ where : { id: resetpasswordid }}).then(resetpasswordrequest => {
            User.findOne({where: { id : resetpasswordrequest.userId}}).then(user => {
                
                if(user) {

                    const saltRounds = 5;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({message: 'Successfuly updated the new password'})
                            })
                        });
                    });
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
            })
        })
    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}


module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword
}