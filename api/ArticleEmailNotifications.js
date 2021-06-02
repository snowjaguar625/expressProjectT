
const express = require('express');
const cors = require('cors')
const db = require('./DB')
const fs = require('fs');
const moment = require('moment');
const schedule = require('node-schedule');
var handlebars = require('handlebars');

const router = express()
router.use(cors())

const date = moment.tz(new Date(), "America/Danmarkshavn")
const transporter = require('./Email')

//Like

const articleLike = () => {
    const sqlQuery = `SELECT email_notification_post_likes_id, u.fullname, u.email, p.id, p.title, total_likes, email_notifications_for_post_likes.updated_at FROM email_notifications_for_post_likes INNER JOIN users u on email_notifications_for_post_likes.user_id = u.user_id INNER JOIN posts p on email_notifications_for_post_likes.post_id = p.id WHERE is_email_sent = 0;`


    db.query(sqlQuery, (err, doc) => {
        if (err) {
            console.log(err);
        }

        if (doc.length !== 0) {
            console.log(doc)
            {
                doc.map(data => {

                    let emailTemplate = fs.readFileSync('./emailTemplates/story-likes.html', { encoding: 'utf-8' });
                    emailTemplate = emailTemplate.replace('[personName]', data.fullname);
                    emailTemplate = emailTemplate.replace('[postTitle]', data.title);
                    emailTemplate = emailTemplate.replace('[like]', data.total_likes)
                    const post = `https://fnmotivation.com/article/${data.id}`;
                    emailTemplate = emailTemplate.replace('[url]', post)
                    emailTemplate = emailTemplate.replace('SEE POST', 'SEE ARTICLE')

                    const mailOptions = {
                        from: 'info@fnmotivation.com',
                        to: data.email,
                        subject: "FNMotivation New Article Likes Notification",
                        html: emailTemplate

                    }
                    transporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            const sqlQuery = `UPDATE fnmotivation.email_notifications_for_post_likes t set t.is_email_sent = 1 WHERE email_notification_post_likes_id = ${data.email_notification_post_likes_id}`
                            db.query(sqlQuery, (err, doc) => {
                                if (err) {
                                    console.log(err);
                                } else {

                                }

                            })
                        }

                    })

                })
            }


        }
    })

}

articleLike()

//Article Comments

const articleComment = () => {
    const sqlQuery = `SELECT email_notification_post_comments_id, fullname, email, p.id, p.title, total_comments, email_notifications_for_post_comments.updated_at FROM email_notifications_for_post_comments INNER JOIN users u on email_notifications_for_post_comments.user_id = u.user_id INNER JOIN posts p on email_notifications_for_post_comments.post_id = p.id WHERE is_email_sent = 0;`
    db.query(sqlQuery, (err, doc) => {
        if (err) {
            console.log(err);
        }

        if (doc.length !== 0) {
            console.log(doc)
            {
                doc.map(data => {

                    let emailTemplate = fs.readFileSync('./emailTemplates/story-comments.html', { encoding: 'utf-8' });
                    emailTemplate = emailTemplate.replace('[personName]', data.fullname);
                    emailTemplate = emailTemplate.replace('[postTitle]', data.title);
                    emailTemplate = emailTemplate.replace('[comment]', data.total_comments)
                    const post = `https://fnmotivation.com/article/${data.id}`;
                    emailTemplate = emailTemplate.replace('[url]', post)
                    emailTemplate = emailTemplate.replace('SEE POST', 'SEE ARTICLE')

                    const mailOptions = {
                        from: 'info@fnmotivation.com',
                        to: data.email,
                        subject: "FNMotivation article Comment Notification",
                        html: emailTemplate
                    }
                    transporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            const sqlQuery = `UPDATE fnmotivation.email_notifications_for_post_comments t set t.is_email_sent = 1 WHERE email_notification_post_comments_id = ${data.email_notification_post_comments_id}`
                            db.query(sqlQuery, (err, doc) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(doc)
                                }

                            })
                        }

                    })

                })
            }


        }
    })

}

articleComment()

//Community article

const articleCommunity = () => {


    const time = moment(date).format().split('T')[0]
    const time2 = moment(date).format().split('T')[1].split('Z')[0]

    const sqlPostCommunity = `CALL insert_in_top_2_community_posts('${time} ${time2}');`
    const sqlUserID = `SELECT user_id_to_be_mailed from email_notifications_for_top2_community_post ;`


    db.query(sqlPostCommunity, (err, data) => {
        if (err) {
            console.log(err)
        }

        db.query(sqlUserID, (err, id) => {
            if (err) {
                console.log(err);
            }

            if (id.length !== 0) {

                var ID = id.map(id => id.user_id_to_be_mailed)
                const uniqueID = ID.filter((v, i, a) => a.indexOf(v) === i);

                //ID map
                {
                    uniqueID.map(id => {
                        const sqlEmailData = `SELECT email_notifications_for_community_post_id,user_id_to_be_mailed, u.fullname AS mailed_user_full_name, u.username as mailing_users_username,u.email as email, p.id AS post_id, p.title as post_title,p.img_link,p.created_at as post_created_at,c.id AS communtiy_id,is_email_sent,c.community_title, u2.user_id AS post_creator_user_id, u2.fullname AS post_creator_fullname,u2.username AS post_creator_username
                        FROM email_notifications_for_top2_community_post JOIN communities c on email_notifications_for_top2_community_post.community_id = c.id JOIN posts p on email_notifications_for_top2_community_post.post_id = p.id JOIN users u on user_id_to_be_mailed = u.user_id JOIN users u2 ON post_creator_id = u2.user_id WHERE is_email_sent = 0 AND user_id_to_be_mailed =${id};`
                        db.query(sqlEmailData, (err, doc) => {
                            if (err) {
                                console.log(err)
                            }
                            // mail
                            {
                                doc.map(data => {
                                    var readHTMLFile = function (path, callback) {
                                        fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
                                            if (err) {
                                                throw err;
                                                callback(err);
                                            }
                                            else {
                                                callback(null, html);
                                            }
                                        });
                                    };
                                    readHTMLFile(__dirname + '/../emailTemplates/newsletter.html', function (err, html) {
                                        var template = handlebars.compile(html);
                                        var replacements = {
                                            personName: data.mailed_user_full_name,
                                            postDate: moment(data.post_created_at).format('MM/DD/YYYY'),
                                            postTitle: data.title,
                                            userName: data.post_title,
                                            category: data.community_title,
                                            postImage: data.img_link,
                                            url: `https://fnmotivation.com/article/${data.post_id}`,
                                        };
                                        var htmlToSend = template(replacements);
                                        var mailOptions = {
                                            from: 'info@fnmotivation.com',
                                            to: data.email,
                                            subject: 'Check out story posts in your communities',
                                            html: htmlToSend
                                        };
                                        transporter.sendMail(mailOptions, function (err, info) {
                                            if (err) {
                                                console.log(err);
                                                callback(err);
                                            }
                                            else {
                                                const sqlQuery = `UPDATE fnmotivation.email_notifications_for_top2_community_post  t set t.is_email_sent = 1 WHERE email_notifications_for_community_post_id = ${data.email_notifications_for_community_post_id}`
                                                db.query(sqlQuery, (err, doc) => {
                                                    if (err) {
                                                        console.log(err);
                                                    } else {
                                                        console.log(info)
                                                    }

                                                })
                                            }
                                        });
                                    });
                                })
                            }
                            // mail End
                        })
                    })

                }
                //End Id Map

            }
        })

    })


}

articleCommunity()

//Following article

const articleFollowing = () => {


    const time = moment(date).format().split('T')[0]
    const time2 = moment(date).format().split('T')[1].split('Z')[0]

    const sqlPostCommunity = `CALL insert_in_top_5_following_users_posts('${time} ${time2}');`
    const sqlUserID = `SELECT user_id_to_be_mailed from email_notifications_for_following_users_5_posts  ;`


    db.query(sqlPostCommunity, (err, data) => {
        if (err) {
            console.log(err)
        }

        db.query(sqlUserID, (err, id) => {
            if (err) {
                console.log(err);
            }

            if (id.length !== 0) {

                var ID = id.map(id => id.user_id_to_be_mailed)
                const uniqueID = ID.filter((v, i, a) => a.indexOf(v) === i);

                //ID map
                {
                    uniqueID.map(id => {
                        const sqlEmailData = `SELECT email_notifications_for_following_users_5_post_id,user_id_to_be_mailed, u.fullname AS mailed_user_full_name, u.username as mailing_users_username,u.email as email, p.id AS post_id,community_title,p.title AS post_title,p.created_at as post_created_at,p.img_link,c.id AS communtiy_id,is_email_sent, u2.user_id AS post_creator_user_id, u2.fullname AS post_creator_fullnaem,u2.username AS post_creator_username
                        FROM email_notifications_for_following_users_5_posts  JOIN posts p on email_notifications_for_following_users_5_posts.post_id = p.id  JOIN users u on user_id_to_be_mailed = u.user_id JOIN users u2 ON post_creator_id = u2.user_id JOIN communities c on p.community_id = c.id WHERE is_email_sent = 0 AND user_id_to_be_mailed = ${id};`
                        db.query(sqlEmailData, (err, doc) => {
                            if (err) {
                                console.log(err)
                            }
                            // mail
                            {
                                doc.map(data => {
                                    var readHTMLFile = function (path, callback) {
                                        fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
                                            if (err) {
                                                throw err;
                                                callback(err);
                                            }
                                            else {
                                                callback(null, html);
                                            }
                                        });
                                    };

                                    readHTMLFile(__dirname + '/../emailTemplates/newsletter.html', function (err, html) {
                                        var template = handlebars.compile(html);
                                        var replacements = {
                                            personName: data.mailed_user_full_name,
                                            postDate: moment(data.post_created_at).format('MM/DD/YYYY'),
                                            postTitle: data.title,
                                            userName: data.post_title,
                                            category: data.community_title,
                                            postImage: data.img_link,
                                            url: `https://fnmotivation.com/article/${data.post_id}`,
                                        };
                                        var htmlToSend = template(replacements);
                                        var mailOptions = {
                                            from: 'info@fnmotivation.com',
                                            to: data.email,
                                            subject: 'Check out story posts in your communities',
                                            html: htmlToSend
                                        };
                                        transporter.sendMail(mailOptions, function (err, info) {
                                            if (err) {
                                                console.log(err);
                                                callback(err);
                                            }
                                            else {
                                                const sqlQuery = `UPDATE fnmotivation.email_notifications_for_following_users_5_posts   t set t.is_email_sent = 1 WHERE email_notifications_for_following_users_5_post_id = ${data.email_notifications_for_following_users_5_post_id}`
                                                db.query(sqlQuery, (err, doc) => {
                                                    if (err) {
                                                        console.log(err);
                                                    } else {
                                                        console.log(info)
                                                    }

                                                })
                                            }
                                        });
                                    });
                                })
                            }
                            // mail End
                        })
                    })

                }
                //End Id Map

            }
        })

    })

}

articleFollowing()

const notificationEmail = () => {
    const sqlQuery = `select * from notifications_in_24h INNER JOIN users u on notifications_in_24h.user_id_to_be_mailed = u.user_id WHERE is_email_sent = 0`
    db.query(sqlQuery, (err, doc) => {

        if (err) {

            console.log(err);

        } else if (doc.length !== 0) {

            {
                doc.map(data => {

                    let emailTemplate = fs.readFileSync('./emailTemplates/new-notifications.html', { encoding: 'utf-8' });
                    emailTemplate = emailTemplate.replace('[personName]', data.fullname)
                    emailTemplate = emailTemplate.replace('[num]', data.total_notification)

                    const mailOptions = {
                        from: 'info@fnmotivation.com',
                        to: data.email,
                        subject: "FNMotivation Notifications Alert",
                        html: emailTemplate
                    }
                    //Mail Sending
                    transporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            const sqlQuery = `UPDATE fnmotivation.notifications_in_24h t set t.is_email_sent = 1 WHERE user_id_to_be_mailed = ${data.user_id}`
                            db.query(sqlQuery, (err, doc) => {
                                if (err) {
                                    console.log(err);
                                } else {

                                }

                            })
                        }

                    })

                })

                //Mail Sending End
            }
        }
    })
}

// notificationEmail()

schedule.scheduleJob('0 0 * * *', () => {
    articleLike()
    notificationEmail()
    articleComment()
})
schedule.scheduleJob('0 8 * * SUN', () => {
    articleFollowing()
})
schedule.scheduleJob('0 8 * * TUE', () => {
    articleFollowing()
})

schedule.scheduleJob('0 7 * * MON', () => {
    articleCommunity()
})



module.exports = router