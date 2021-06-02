const express = require('express')
const db = require('./DB')
const fs = require('fs');
const cors = require('cors')
const moment = require('moment');
const schedule = require('node-schedule');
var handlebars = require('handlebars');

const router = express()
router.use(cors())


const transporter = require('./Email')

const date = moment.tz(new Date(), "America/Danmarkshavn")
const sendEmailTime = ((moment(date).format()).split('T')[1])

//Follower
const followerEmail = () => {

    const sqlQuery = `SELECT email_notification_follower_reached_id, u.fullname, u.username, email, u.user_id, total_follower, is_email_sent FROM email_notifications_when_certain_follower_reached INNER JOIN users u on email_notifications_when_certain_follower_reached.user_id = u.user_id WHERE is_email_sent = 0`
    db.query(sqlQuery, (err, doc) => {
        if (err) {
            console.log(err);
        }

        if (doc.length !== 0) {

            {
                doc.map(data => {

                    let emailTemplate = fs.readFileSync('./emailTemplates/follower-reached.html', { encoding: 'utf-8' });
                    emailTemplate = emailTemplate.replace('[personName]', data.fullname)
                    emailTemplate = emailTemplate.replace('[num]', data.total_follower)

                    const mailOptions = {
                        from: 'info@fnmotivation.com',
                        to: data.email,
                        subject: "FNMotivation Follower Notification",
                        html: emailTemplate
                    }
                    transporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                            console.log(err);
                        }

                        else {
                            const sqlQuery = `UPDATE fnmotivation.email_notifications_when_certain_follower_reached t set t.is_email_sent = 1 WHERE email_notification_follower_reached_id = ${data.email_notification_follower_reached_id}`
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

// followerEmail()

//Like
const storyLike = () => {
    const sqlQuery = `SELECT email_notification_story_likes_id ,fullname,email, s.story_id , s.title, total_likes FROM email_notifications_for_story_likes INNER JOIN users u on email_notifications_for_story_likes.user_id = u.user_id INNER JOIN stories s on email_notifications_for_story_likes.story_id = s.story_id WHERE is_email_sent = 0;`


    db.query(sqlQuery, (err, doc) => {
        if (err) {
            console.log(err);
        }
        if (doc.length !== 0) {

            {
                doc.map(data => {

                    let emailTemplate = fs.readFileSync('./emailTemplates/story-likes.html', { encoding: 'utf-8' });
                    emailTemplate = emailTemplate.replace('[personName]', data.fullname);
                    emailTemplate = emailTemplate.replace('[postTitle]', data.title);
                    emailTemplate = emailTemplate.replace('[like]', data.total_likes)
                    const post = `https://fnmotivation.com/post/${data.story_id}/${data.title.replace(/\s/g, '-').substring(0, 60)}`;
                    emailTemplate = emailTemplate.replace('[url]', post)


                    const mailOptions = {
                        from: 'info@fnmotivation.com',
                        to: data.email,
                        subject: "FNMotivation New Story Likes Notification",
                        html: emailTemplate
                    }

                    transporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            const sqlQuery = `UPDATE fnmotivation.email_notifications_for_story_likes t set t.is_email_sent = 1 WHERE email_notification_story_likes_id = ${data.email_notification_story_likes_id}`
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

// storyLike()

//Comments

const storyComment = () => {
    const sqlQuery = `SELECT email_notification_story_comments_id, u.fullname, email, s.story_id,s.title, total_comments, email_notifications_for_story_comments.updated_at FROM email_notifications_for_story_comments INNER JOIN users u on email_notifications_for_story_comments.user_id = u.user_id INNER JOIN stories s on email_notifications_for_story_comments.story_id = s.story_id WHERE is_email_sent = 0`
    db.query(sqlQuery, (err, doc) => {
        if (err) {
            console.log(err);
        }

        if (doc.length !== 0) {
            {
                doc.map(data => {

                    let emailTemplate = fs.readFileSync('./emailTemplates/story-comments.html', { encoding: 'utf-8' });
                    emailTemplate = emailTemplate.replace('[personName]', data.fullname);
                    emailTemplate = emailTemplate.replace('[postTitle]', data.title);
                    emailTemplate = emailTemplate.replace('[comment]', data.total_comments)
                    const post = `https://fnmotivation.com/post/${data.story_id}/${data.title.replace(/\s/g, '-').substring(0, 60)}`;
                    emailTemplate = emailTemplate.replace('[url]', post)

                    const mailOptions = {
                        from: 'info@fnmotivation.com',
                        to: data.email,
                        subject: "FNMotivation Story Comment Notification",
                        html: emailTemplate

                    }

                    transporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            const sqlQuery = `UPDATE fnmotivation.email_notifications_for_story_comments t set t.is_email_sent = 1 WHERE email_notification_story_comments_id = ${data.email_notification_story_comments_id}`
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

storyComment()

//Community Story



const storyCommunity = () => {

    const time = moment(date).format().split('T')[0]
    const time2 = moment(date).format().split('T')[1].split('Z')[0]

    const sqlPostCommunity = `CALL insert_in_top_2_community_stories('${time} ${time2}');`
    const sqlUserID = `SELECT user_id_to_be_mailed from email_notifications_for_top2_community_story;`


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
                var uniqueID = ID.filter((v, i, a) => a.indexOf(v) === i);

                const sqlEmailData = `SELECT email_notifications_for_community_story_id,user_id_to_be_mailed, u.fullname AS mailed_user_full_name, u.username as mailing_users_username,u.email as email, s.story_id,community_title,c.id AS communtiy_id,is_email_sent,id,title,short_story,post_thumbnail, u2.user_id AS story_creator_user_id, u2.fullname AS story_creator_fullnaem,u2.username AS story_creator_username
                        FROM email_notifications_for_top2_community_story JOIN communities c on email_notifications_for_top2_community_story.community_id = c.id JOIN stories s on email_notifications_for_top2_community_story.story_id = s.story_id JOIN users u on user_id_to_be_mailed = u.user_id JOIN users u2 ON story_creator_id = u2.user_id WHERE is_email_sent = 0 AND user_id_to_be_mailed = ${uniqueID[0]};`
                db.query(sqlEmailData, (err, doc) => {
                    if (err) {
                        console.log(err)
                    }
                    console.log(doc)
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
                                    personName: data.story_creator_fullnaem,
                                    postDate: moment(data.storty_created_at).format('MM/DD/YYYY'),
                                    postTitle: data.title,
                                    userName: data.story_creator_username,
                                    category: data.community_title,
                                    postImage: `https://fnmotivation.com/${data.post_thumbnail}`,
                                    url: `https://fnmotivation.com/post/${data.story_id}/${data.title.replace(/\s/g, '-').substring(0, 60)}`,
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
                                        const sqlQuery = `UPDATE fnmotivation.email_notifications_for_top2_community_story t set t.is_email_sent = 1 WHERE email_notifications_for_community_story_id = ${data.email_notifications_for_community_story_id}`
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


            }
        })

    })

}
storyCommunity()

//Following Story

const storyFollowing = () => {

    const time = moment(date).format().split('T')[0]
    const time2 = moment(date).format().split('T')[1].split('Z')[0]

    const sqlPostCommunity = `call insert_in_top_5_following_users_stories('${time} ${time2}');`
    const sqlUserID = `SELECT user_id_to_be_mailed from email_notifications_for_following_users_5_story;`


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
                        const sqlEmailData = `SELECT email_notifications_for_following_users_5_story_id,user_id_to_be_mailed, u.fullname AS mailed_user_full_name, u.username as mailing_users_username,u.email as email, s.story_id,community_title,c.id AS communtiy_id,is_email_sent,id,title,short_story, u2.user_id AS story_creator_user_id, u2.fullname AS story_creator_fullnaem,u2.username AS story_creator_username
                    FROM email_notifications_for_following_users_5_story  JOIN stories s on email_notifications_for_following_users_5_story.story_id = s.story_id  JOIN users u on user_id_to_be_mailed = u.user_id JOIN users u2 ON story_creator_id = u2.user_id JOIN communities c on s.community_id = c.id WHERE is_email_sent = 0 AND user_id_to_be_mailed = ${id};`
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
                                            personName: data.story_creator_fullnaem,
                                            postDate: moment(data.storty_created_at).format('MM/DD/YYYY'),
                                            postTitle: data.title,
                                            userName: data.story_creator_username,
                                            category: data.community_title,
                                            postImage: `https://fnmotivation.com/${data.post_thumbnail}`,
                                            url: `https://fnmotivation.com/post/${data.story_id}/${data.title.replace(/\s/g, '-').substring(0, 60)}`,
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
                                                //deleting id
                                                const sqlQuery = `UPDATE fnmotivation.email_notifications_for_following_users_5_story t set t.is_email_sent = 1 WHERE email_notifications_for_following_users_5_story_id = ${data.email_notifications_for_following_users_5_story_id}`
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

storyFollowing()

schedule.scheduleJob('0 0 * * *', () => {
    followerEmail()
    storyLike()
    storyComment()
    storyFollowing()
})

schedule.scheduleJob('0 8 * * SUN', () => {
    storyFollowing()
})
schedule.scheduleJob('0 8 * * TUE', () => {
    storyFollowing()
})

schedule.scheduleJob('0 7 * * MON', () => {
    storyCommunity()
})


module.exports = router