const db = require('../api/DB')
const jwt = require('jsonwebtoken')
var md5 = require('md5');
const momentTime = require('moment-timezone');
const nodemailer = require('nodemailer')
const fs = require('fs')
const maxAge = 3 * 24 * 60 * 60

const createToken = (id) => {
    return jwt.sign({ id }, 'fgDataSa', {

    })
}

const transporter = require('../api/Email')


const userType = async (req, res, next) => {
    const sqlSelect = `UPDATE fnmotivation.users t SET t.role = '${req.params.audience}'  Where user_id = ${req.params.id}`
    db.query(sqlSelect, (err, user) => {
        if (err) {
            console.log(err); next()
        }
       res.send(user)
    })
}

//Get All User

const allUser_Data = async (req, res, next) => {
    const sqlSelect = `SELECT username, email FROM users`;
    db.query(sqlSelect, (err, user) => {
        if (err) {
            console.log(err); next()
        }
        const sqlSelect = `SELECT username, email FROM temporary_users`;
        db.query(sqlSelect, (err, temp_user) => {
            if (err) {
                console.log(err); next()
            }
            const users = [...user]
            const temp_users = [...temp_user]
            res.send([...users, ...temp_users])
        })
    })
}

//Register USer

const registerUser = async (req, res, next) => {
    const { fullname, userName, email, gender, birthdate } = await req.body
    console.log("here is registerUser");

    const checkEmail = `SELECT * from users WHERE email = '${email}' or username = '${userName}'`
    db.query(checkEmail, async (err, data) => {
        if (err) {
            console.log(err)
            res.send({ error: 'An error occured try after some time' })
        }
        if (data.length !== 0) {
            res.send({ error: 'Email or Username is already in use.' })
        }
        else if (data.length === 0) {

            // //Code
            function makeid(length) {
                var result = '';
                var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                var charactersLength = characters.length;
                for (var i = 0; i < length; i++) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            }
            const code = makeid(10)
            var { password } = await req.body

            password = md5(password)

            const sqlInsert = "INSERT INTO  temporary_users (fullname, username, email, gender, password, DOB, verification_code) values(?, ?, ?, ?, ?, ?, ?)"
            db.query(sqlInsert, [fullname, userName, email, gender, password, birthdate, code], (err, documents) => {
                if (err) {
                    console.log(err); next()
                }

                //Sending EMail

                let emailTemplate = fs.readFileSync('./emailTemplates/account-active.html', { encoding: 'utf-8' });

                emailTemplate = emailTemplate.replace('[personName]', fullname)
                emailTemplate = emailTemplate.replace('[token]', code)

                console.log("insert temporary_users table result")
                console.log(documents)
                console.log(email)
                const mailOptions = {
                    from: 'info@fnmotivation.com',
                    // from: 'http://localhost:5000',
                    to: `${email}`,
                    subject: "FNMotivation Email Verification",
                    html: emailTemplate
                }
                console.log("here is send mail part")
                transporter.sendMail(mailOptions, (err, info) => {
                    console.log("here is send mail done")
                    if (err) {
                        console.log("register mail error:")
                        console.log(err)
                        res.send({ error: 'Email is not valid' })
                    }
                    else{
                        console.log("register send emiail;")
                        console.log(info)
                        next()
                    }
                })


                res.send(documents)
            })

        }
    })




}
//Get Login User

const loginUser = async (req, res, next) => {
    const email = await req.query.email
    const pass = await req.headers.authorization;

    const sqlCheck = `SELECT * from temporary_users WHERE email = '${email}'`;
    db.query(sqlCheck, (err, doc) => {
        if (err) {
            console.log(err);
            res.send({ error: `An error occured` })
        }
        if (doc.length) {
            console.log("login part 1111.rcm")
            if (doc[0].email == email) {
                res.send({ error: `Please Verify Your Email` })
            }
        } else {
            console.log('login part 222.rcm')
            const sqlSelect = `SELECT * FROM users WHERE email = '${email}' AND is_deleted = 0`;
            db.query(sqlSelect, (err, documents) => {
                if (err) {
                    console.log(err);
                }
                isValidPass = (documents.map(pass => pass.password).toString() === md5(pass))

                if (isValidPass) {
                    console.log('login part 333.rcm')
                    const token = createToken(documents.map(id => id.user_id))
                    const { user_id, email, fullname, username, gender, avatar, dob } = documents[0]
                    res.send({ info: { user_id, email, fullname, username, gender, avatar, dob }, token })
                }
                else {
                    res.send({ error: 'User Not Found' })
                }
            })
        }


    })

}

//Get Particul User

const getParticularUser_Data = async (req, res, next) => {
    const id = await req.query.id
    const sqlSelect = `SELECT email, fullname, username, user_id, subscribe_newsletter, about, avatar  FROM users WHERE user_id = '${id}' AND is_deleted = 0`;
    db.query(sqlSelect, (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        res.send(documents)
    });


}

//Get User After Register

const getUserAfterRegister_Data = async (req, res, next) => {
    const email = await req.query.email
    const sqlSelect = `SELECT * FROM users WHERE email = '${email}' AND is_deleted = 0`;
    db.query(sqlSelect, (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        const token = createToken(documents.map(id => id.user_id))
        const { user_id, email, fullname, username, gender, avatar, dob } = documents[0]
        res.send({ info: { user_id, email, fullname, username, gender, avatar, dob }, token })
    })
}

//Get All Post All Particular User

const getAllPostsOfParticularUser = async (req, res, next) => {
    const id = await req.query.id
    const userID = await id.split(',')[0]
    const show = await id.split(',')[1]
    const sqlCount = `SELECT COUNT(story_id) AS story_count from stories WHERE user_id= ${userID} AND is_deleted = 0`
    const sqlSelect = `SELECT story_id,title,community_id,short_story,body,post_thumbnail,tags,user_id,created_at,updated_at,stories.is_deleted,id,community_title,image_url,c.is_deleted FROM stories INNER JOIN communities c on stories.community_id = c.id WHERE stories.is_deleted = 0 AND c.is_deleted = 0 AND user_id ='${userID}' ORDER BY stories.created_at DESC LIMIT 10 OFFSET ${show};`;
    if (userID && show) {
        db.query(sqlCount, (err, count) => {
            if (err) {
                console.log(err);
                next()
            }
            db.query(sqlSelect, (err, documents) => {
                if (err) {
                    console.log(err);
                    next()
                }
                res.send({ data: documents, count: count })
            })
        })
    }
}


// Get Subscribe

const alreadySubscribe = async (req, res, next) => {
    const id = await req.query.id
    const sqlSelect = `SELECT users_community_subscription.Id,UserId,CommunityId,Type,created_at,updated_at,c.id,community_title,image_url,c.is_deleted FROM users_community_subscription INNER JOIN communities c on CommunityId = c.id WHERE UserId = '${id}' AND  Type = 1 ORDER BY created_at DESC;`;
    db.query(sqlSelect, (err, documents) => {
        if (err) {
            console.log(err);
            next()
        }
        res.send(documents)
    })

}

//Subscribe

const subscribe = async (req, res, next) => {
    const { userID, communityID } = await req.body

    const sqlInsert = `UPDATE fnmotivation.users t SET t.subscribe_newsletter = 1  Where user_id = ${userID}`
    db.query(sqlInsert, (err, doc) => {
        if (err) {
            console.log(err)
        }
        const sqlSelect = `CALL auto_community('${userID}','${communityID}');`;
        db.query(sqlSelect, [userID, communityID], (err, documents) => {
            if (err) {
                console.log(err);
                next()
            }
            res.send(documents)
        })
    })



}

// Edit User Data No Image

const editUserDataWithOutImage = async (req, res, next) => {
    const userID = await req.body.userID
    const name = await req.body.name
    const username = await req.body.username
    const email = await req.body.email
    const about = await req.body.about


    const sqlUserUpdateInsert = `UPDATE fnmotivation.users t SET t.fullname = '${name}', t.username = '${username}', t.email = '${email}', t.about = '${about}' WHERE t.user_id = ${userID}`;
    db.query(sqlUserUpdateInsert, (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        res.send(documents)
    })
}

// Edit USer Data Image 

const editUserData = async (req, res, next) => {

    const userID = await req.body.userID
    const file = await req.files.file
    const name = await req.body.name
    const email = await req.body.email
    const username = await req.body.username
    const about = await req.body.about


    if (file.size > 5000000) {
        return res.status(500).json({ msg: 'Image is too big. Please upload less than 5 mb' })
    }

    let date = momentTime.tz(new Date(), "Asia/Dhaka").format()
    const filterDate = date.split('T')[0]


    function makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    // Storing Image

    file.name = `user${makeid(50)}${filterDate}${file.name}`


    file.mv(`./uploads/${file.name}`, err => {
        if (err) {
            console.log(err);
        }
        const sqlSelect = `UPDATE fnmotivation.users t SET t.fullname = '${name}', t.username = '${username}', t.email = '${email}', t.avatar = '${file.name}', t.about = "${about}" WHERE t.user_id = ${userID}`;
        db.query(sqlSelect, (err, documents) => {
            if (err) {
                console.log(err); next()
            }
            res.send(documents)
        })
    })
}

module.exports = {
    allUser_Data,
    loginUser,
    getUserAfterRegister_Data,
    getParticularUser_Data,
    registerUser,
    getAllPostsOfParticularUser,
    editUserDataWithOutImage,
    editUserData,
    subscribe,
    alreadySubscribe,
    userType

}