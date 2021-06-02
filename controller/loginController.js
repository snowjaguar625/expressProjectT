const db = require('../api/DB')
const jwt = require('jsonwebtoken')
var md5 = require('md5');
const nodemailer = require('nodemailer')
const fs = require('fs')


const createToken = (code) => {
    return jwt.sign({ code }, 'dcSav', {
    })
}

const transporter = require('../api/Email')


// Get Email for resetPass

const getEmailforPass = async (req, res, next) => {

    const email = await req.query.email
    const sqlQuery = `SELECT email, user_id, fullname from users WHERE email = '${email}'`
    db.query(sqlQuery, (err, doc) => {
        if (err) {
            console.log(err)
            next()
        }

        if (doc.length) {
            if (doc[0].email == email) {

                //Generate No
                const code = Math.floor(100000 + Math.random() * 900000)
                const userID = doc[0].user_id
                const name = doc[0].fullname

                const sqlSendCode = `INSERT INTO password_reset (user_id, verification_code) VALUES('${userID}', '${code}') ON DUPLICATE KEY UPDATE user_id = '${userID}', verification_code = '${code}';`
                db.query(sqlSendCode, (err, doc) => {
                    if (err) {
                        console.log(err)
                        res.send({ error: 'Refresh and try again' })
                    }

                    let emailTemplate = fs.readFileSync('./emailTemplates/code-send-for-pass.html', { encoding: 'utf-8' });
                    emailTemplate = emailTemplate.replace('[personName]', name)
                    emailTemplate = emailTemplate.replace('[code]', code)

                    //Sending EMail
                    const mailOptions = {
                        from: 'info@fnmotivation.com',
                        to: `${email}`,
                        subject: "FNMotivation Password Recovery",
                        html: emailTemplate
                    }
                    transporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                            console.log(err)
                            res.send({ error: 'Email is not valid' })
                        } else if (!err) {
                            res.send({ doc: doc, userID: userID })
                        }

                    })


                })
            }


        } else {
            res.send({ error: 'No Such Email' })
        }
    })
}

// Verify Code for Pass

const verifyCode = async (req, res, next) => {
    const { code, userID } = await req.body
    const sqlQuery = `SELECT * FROM password_reset WHERE user_id = '${userID}' AND verification_code = '${code}' `
    db.query(sqlQuery, (err, doc) => {
        if (err) {
            console.log(err)
            next()
        }

        //Check Code
        if (doc.length) {
            if (doc[0].verification_code == code) {
                const token = createToken(code)
                res.send({ documents: doc, token: token })
            }

        } else {
            res.send({ error: 'Code is Invalid' })
        }
    })
}

// Reset Pass

const changePassword = async (req, res, next) => {
    const { password, userID } = await req.body
    const token = await req.headers.authorization;


    if (token) {
        jwt.verify(token, 'dcSav', (err, decodedToken) => {

            if (err) {
                res.status(400).send({ error: 'Bad Request User Error' })
                next()

            } else {

                const pass = md5(password)
                const sqlQuery = `UPDATE fnmotivation.users t SET t.password = '${pass}'  Where user_id = ${userID}`
                db.query(sqlQuery, (err, doc) => {
                    if (err) {
                        console.log(err)
                        next()
                    }
                    res.send(doc)

                    const sqlName = `SELECT email, fullname FROM users WHERE user_id = ${userID}`

                    db.query(sqlName, (err, name) => {
                        let emailTemplate = fs.readFileSync('./emailTemplates/password-changed.html', { encoding: 'utf-8' });
                        emailTemplate = emailTemplate.replace('[personName]', name[0].fullname)

                        const mailOptions = {
                            from: 'info@fnmotivation.com',
                            to: `${name[0].email}`,
                            subject: "FNMotivation Password Changed",
                            html: emailTemplate
                        }
                        //Mail Sending
                        transporter.sendMail(mailOptions, (err, info) => {
                            if (err) {
                                console.log(err)
                            }
                            else {
                                next()
                            }
                        })
                    })


                })
            }
        })
    }
    else {
        res.status(400).send({ error: 'Bad Request User Error' })
    }


}

const verifyIdentity = async (req, res, next) => {
    const code = await req.query.code

    const sqlMatchCode = `UPDATE fnmotivation.temporary_users t SET t.is_verified = 1  WHERE verification_code = '${code}'`;
    db.query(sqlMatchCode, (err, doc) => {
        if (err) {
            console.log(err)
            next()
        }
        if (doc && doc.length !== 0) {
            if (doc.affectedRows > 0) {
                const sqlName = `SELECT fullname, email from temporary_users WHERE verification_code = '${code}'`;
                db.query(sqlName, (err, name) => {
                    if (err) {
                        console.log(err)
                        next()
                    }
                    let emailTemplate = fs.readFileSync('./emailTemplates/account-activated.html', { encoding: 'utf-8' });

                    emailTemplate = emailTemplate.replace('[personName]', name[0].fullname)

                    const mailOptions = {
                        from: 'info@fnmotivation.com',
                        to: `${name[0].email}`,
                        subject: "FNMotivation Account Activation",
                        html: emailTemplate
                    }
                    transporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                            console.log(err)
                        }
                        console.log(info)

                        //Delete

                        const sqlEdit = `DELETE FROM temporary_users WHERE is_verified = 1;`
                        db.query(sqlEdit, (err, doc) => {
                            if (err) {
                                console.log(err)
                                next()
                            }
                            res.send(doc)

                            let emailTemplate = fs.readFileSync('./emailTemplates/registration-usage-tips.html', { encoding: 'utf-8' });

                            emailTemplate = emailTemplate.replace('[personName]', name[0].fullname)

                            const mailOptions = {
                                from: 'info@fnmotivation.com',
                                to: `${name[0].email}`,
                                subject: "FNMotivation Registration Tips",
                                html: emailTemplate
                            }
                            transporter.sendMail(mailOptions, (err, info) => {
                                if (err) {
                                    console.log(err)
                                }
                                console.log(info)
                            })


                        })

                        //Delete

                    })

                    //EMail Send



                    // End Email

                })
            }
        } else {
            res.send({ error: 'Token is Invalid' })
        }
    })




}

//FAcebook Sign Up

const facebookSignUp = async (req, res, next) => {
    const { id, email, first_name, middle_name, last_name } = await req.body

    const fullname = `${first_name} ${middle_name} ${last_name}`
    const username = email.split('@')[0]

    const sqlQuery = `SELECT * from users where FacebookID = ${id} or email = '${email}'`
    db.query(sqlQuery, (err, documents) => {
        if (err) {
            console.log(err);
            res.send({ error: "User can't register. Try again after few minutes" })
        }
        if (documents.length !== 0) {
            res.send({ error: "User already registered or email is used by other User" })
        } else if (documents.length === 0) {

            const sqlInsert = "INSERT INTO users (fullname, username, email, FacebookID) values(?, ?, ?, ?)"
            db.query(sqlInsert, [fullname, username, email, id], (err, documents) => {
                if (err) {
                    console.log(err);
                    res.send({ error: "User can't register. Try again after few minutes" })
                }

                const sqlInsert = `SELECT user_id from users WHERE FacebookID = ${id}`
                db.query(sqlInsert, (err, doc) => {
                    if (err) {
                        console.log(err);
                        res.send({ error: "User can't register. Try again after few minutes" })
                    }
                    else if (doc !== 0) {
                        const genToken = (code) => {
                            return jwt.sign({ code }, 'fgDataSa', {
                            })
                        }
                        const token = genToken(doc[0].user_id)
                        res.send({ userID: doc[0].user_id, username: username, token: token })


                        let emailTemplate = fs.readFileSync('./emailTemplates/account-activated.html', { encoding: 'utf-8' });
                        emailTemplate = emailTemplate.replace('[personName]', fullname)

                        //Sending EMail
                        const mailOptions = {
                            from: 'info@fnmotivation.com',
                            to: `${email}`,
                            subject: "FNMotivation account activation",
                            html: emailTemplate
                        }
                        transporter.sendMail(mailOptions, (err, info) => {
                            if (err) {
                                console.log(err)
                                res.send({ error: 'Email is not valid' })
                            } else if (!err) {
                                
                            }
                            next()
                        })


                    }
                })
            })
        }
    })

}

//Facebook Login 

const facebookLogin = async (req, res, next) => {
    const id = await req.query.id
    const sqlInsert = `SELECT user_id, username, avatar from users WHERE FacebookID = ${id}`
    db.query(sqlInsert, (err, doc) => {
        if (err) {
            console.log(err);
            res.send({ error: "User can't register. Try again after few minutes" })
        }
        if (doc.length === 0) {
            res.send({ error: "User not found" })
        }
        else if (doc.length !== 0) {
            const genToken = (code) => {
                return jwt.sign({ code }, 'fgDataSa', {
                })
            }
            const token = genToken(doc[0].user_id)
            res.send({ userID: doc[0].user_id, username: doc[0].username, token: token, avatar: doc[0].avatar })
        }
    })
}

//Google Sign In

const googleSignUp = async (req, res, next) => {
    const { googleId, email, name, familyName } = await req.body

    const username = email.split('@')[0]

    const sqlQuery = `SELECT * from users where GoogleId = ${googleId} OR email = '${email}'`
    db.query(sqlQuery, (err, documents) => {
        if (err) {
            console.log(err);
            res.send({ error: "User can't register. Try again after few minutes" })
        }
        if (documents.length !== 0) {
            res.send({ error: "User already registered or Email is used by other User" })
        } else if (documents.length === 0) {

            const sqlInsert = "INSERT INTO users (fullname, username, email, GoogleId) values(?, ?, ?, ?)"
            db.query(sqlInsert, [name, username, email, googleId], (err, documents) => {
                if (err) {
                    console.log(err);
                    res.send({ error: "User can't register. Try again after few minutes" })
                }

                const sqlInsert = `SELECT user_id from users WHERE GoogleId = ${googleId}`
                db.query(sqlInsert, (err, doc) => {
                    if (err) {
                        console.log(err);
                        res.send({ error: "User can't register. Try again after few minutes" })
                    }
                    else if (doc !== 0) {
                        const genToken = (code) => {
                            return jwt.sign({ code }, 'fgDataSa', {
                            })
                        }
                        const token = genToken(doc[0].user_id)
                        res.send({ userID: doc[0].user_id, username: username, token: token })

                        let emailTemplate = fs.readFileSync('./emailTemplates/account-activated.html', { encoding: 'utf-8' });
                        emailTemplate = emailTemplate.replace('[personName]', fullname)

                        //Sending EMail
                        const mailOptions = {
                            from: 'info@fnmotivation.com',
                            to: `${email}`,
                            subject: "FNMotivation account activation",
                            html: emailTemplate
                        }
                        transporter.sendMail(mailOptions, (err, info) => {
                            if (err) {
                                console.log(err)
                                res.send({ error: 'Email is not valid' })
                            } else if (!err) {
                            }
                            next()
                        })


                    }
                })
            })
        }
    })
}

//Google Login

const googleLogin = async (req, res, next) => {
    const googleId = await req.query.id
    const sqlInsert = `SELECT user_id, username, avatar from users WHERE GoogleId = ${googleId}`
    db.query(sqlInsert, (err, doc) => {
        if (err) {
            console.log(err);
            res.send({ error: "User can't register. Try again after few minutes" })
        }
        if ( doc.length === 0) {
            res.send({ error: "User not found" })
        }
        else if (doc.length !== 0) {
            const genToken = (code) => {
                return jwt.sign({ code }, 'fgDataSa', {
                })
            }
            const token = genToken(doc[0].user_id)
            res.send({ userID: doc[0].user_id, username: doc[0].username, token: token, avatar: doc[0].avatar })
        }
    })
}

const sendContactInfo = async (req, res, next) => {
    const { name, email, subject, message } = await req.body

    const mailOptions = {
        from: 'info@fnmotivation.com',
        to: 'info@fnmotivation.com',
        subject: "FNMotivation Contact Form",
        html:
            `<p>Name: ${name}</p>
            <p>Email: ${email}</p>
            <p>Subject: ${subject}</p>
            <p>Message: ${message}</p>
            `
    }
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err)
            res.send({ error: 'Email is not valid' })
        }
        else if (!err) {
            res.send(info)
            next()
        }

    })
}






module.exports = {
    getEmailforPass,
    verifyCode,
    changePassword,
    verifyIdentity,
    sendContactInfo,
    facebookSignUp,
    facebookLogin,
    googleSignUp,
    googleLogin
}