const db = require('../../api/DB');

const storyCountReports = async (req, res, next) => {

    const sqlCountStory = `SELECT COUNT (reason) as story_report from reports WHERE reason = 'story_report'`
    const sqlCountStoryCmnt = `SELECT COUNT (reason) as story_comment_report from reports WHERE reason = 'story_comment_report'`
    const sqlCountStoryCmntReply = `SELECT COUNT (reason) as story_comment_reply_report from reports WHERE reason = 'story_comment_reply_report'`

    db.query(sqlCountStory, (err, story) => {
        if (err) {
            console.log(err)
        } else {
            db.query(sqlCountStoryCmnt, (err, comment) => {
                if (err) {
                    console.log(err)
                } else {
                    db.query(sqlCountStoryCmntReply, (err, reply) => {
                        if (err) {
                            console.log(err)
                        } else {
                            res.send({ countStory: story, countComment: comment, countReply: reply })

                        }
                    })
                }
            })

        }
    })

}

const articleCountReports = async (req, res, next) => {

    const sqlCountStory = `SELECT COUNT (reason) as post_report from reports WHERE reason = 'post_report'`
    const sqlCountStoryCmnt = `SELECT COUNT (reason) as post_comment_report from reports WHERE reason = 'post_comment_report'`
    const sqlCountStoryCmntReply = `SELECT COUNT (reason) as post_comment_reply_report from reports WHERE reason = 'post_comment_reply_report'`

    db.query(sqlCountStory, (err, story) => {
        if (err) {
            console.log(err)
        } else {
            db.query(sqlCountStoryCmnt, (err, comment) => {
                if (err) {
                    console.log(err)
                } else {
                    db.query(sqlCountStoryCmntReply, (err, reply) => {
                        if (err) {
                            console.log(err)
                        } else {
                            res.send({ countStory: story, countComment: comment, countReply: reply })

                        }
                    })
                }
            })

        }
    })

}

const storyReport = async (req, res, next) => {
    const { from_user_id, story_id, report_msg } = req.body

    const sqlInfo = `INSERT INTO reports (reason, from_user_id, story_id, report_msg) values('story_report', ?, ?, ?);`
    db.query(sqlInfo, [from_user_id, story_id, report_msg], (err, doc) => {
        if (err) {
            console.log(err)
            res.send({ msg: "Can't report right now" })
        } else {
            res.send(doc)
        }
    })

}

const storyCommentReport = async (req, res, next) => {
    const { from_user_id, story_id, reported_story_comment_id, report_msg } = req.body


    const sqlInfo = `INSERT INTO reports (reason, from_user_id, story_id, reported_story_comment_id, report_msg) values('story_comment_report', ?, ?, ?, ?);`
    db.query(sqlInfo, [from_user_id, story_id, reported_story_comment_id, report_msg], (err, doc) => {
        if (err) {
            console.log(err)
            res.send({ msg: "Can't report right now" })
        } else {
            res.send(doc)
        }
    })
}

const storyReplyCommentReport = async (req, res, next) => {
    const { from_user_id, story_id, reported_story_comment_reply_id, report_msg } = req.body

    const sqlInfo = `INSERT INTO reports (reason, from_user_id, story_id, reported_story_comment_reply_id, report_msg) values('story_comment_reply_report', ?, ?, ?, ?);`
    db.query(sqlInfo, [from_user_id, story_id, reported_story_comment_reply_id, report_msg], (err, doc) => {
        if (err) {
            console.log(err)
            res.send({ msg: "Can't report right now" })
        } else {
            res.send(doc)
        }
    })
}

const articleReport = async (req, res, next) => {
    const { from_user_id, post_id, report_msg } = req.body

    const sqlInfo = `INSERT INTO reports (reason, from_user_id, post_id, report_msg) values('post_report', ?, ?, ?);`
    db.query(sqlInfo, [from_user_id, post_id, report_msg], (err, doc) => {
        if (err) {
            console.log(err)
            res.send({ msg: "Can't report right now" })
        } else {
            res.send(doc)
        }
    })

}

const articleCommentReport = async (req, res, next) => {
    const { from_user_id, post_id, reported_post_comment_id, report_msg } = req.body

    const sqlInfo = `INSERT INTO reports (reason, from_user_id, post_id, reported_post_comment_id, report_msg) values('post_comment_report', ?, ?, ?, ?);`
    db.query(sqlInfo, [from_user_id, post_id, reported_post_comment_id, report_msg], (err, doc) => {
        if (err) {
            console.log(err)
            res.send({ msg: "Can't report right now" })
        } else {
            res.send(doc)
        }
    })

}

const articleReplyCmntReport = async (req, res, next) => {
    const { from_user_id, post_id, reported_post_comment_reply_id, report_msg } = req.body

    const sqlInfo = `INSERT INTO reports (reason, from_user_id, post_id , reported_post_comment_reply_id, report_msg) values('post_comment_reply_report', ?, ?, ?, ?);`
    db.query(sqlInfo, [from_user_id, post_id, reported_post_comment_reply_id, report_msg], (err, doc) => {
        if (err) {
            console.log(err)
            res.send({ msg: "Can't report right now" })
        } else {
            res.send(doc)
        }
    })
}

module.exports = {
    storyCountReports,
    articleCountReports,
    storyReport,
    storyCommentReport,
    storyReplyCommentReport,
    articleReport,
    articleCommentReport,
    articleReplyCmntReport
}
