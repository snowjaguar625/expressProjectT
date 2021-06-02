const db = require('../../api/DB');

const countStoryReports = async (req, res, next) => {
    const sqlCountStory = `SELECT COUNT (reason) as story_report from reports WHERE reason = 'story_report'`

    db.query(sqlCountStory, (err, story) => {
        if (err) {
            console.log(err)
        } else {
            res.send(story)
        }
    })
}

const StoryReportsDetails = async (req, res, next) => {
    const show = req.query.show
    const sqlCountStory = `SELECT report_id, is_resolved, report_msg, from_user_id AS reporter_user_id,u.username as reporter_username, u.fullname AS reporter_fullname,s.story_id,s.title AS story_title, s.created_at AS story_created_at, s.is_deleted AS stories_is_deleted, u2.user_id AS story_owner_id, u2.username AS story_owner_username,u2.fullname AS  story_owner_fullname, reports.created_at AS report_created_at FROM reports JOIN stories s on reports.story_id = s.story_id JOIN users u on from_user_id = u.user_id JOIN users u2 on s.user_id = u2.user_id WHERE reason = 'story_report' ORDER BY report_id DESC LIMIT 10 OFFSET ${show}`

    db.query(sqlCountStory, (err, story) => {
        if (err) {
            console.log(err)
        } else {
            res.send(story)
        }
    })
}

const countStoryCmntReports = async (req, res, next) => {
    const sqlCountStory = `SELECT COUNT (reason) as story_comment_report from reports WHERE reason = 'story_comment_report'`

    db.query(sqlCountStory, (err, story) => {
        if (err) {
            console.log(err)
        } else {
            res.send(story)
        }
    })
}


const storyReportCmntDetails = async (req, res, next) => {
    const show = req.query.show
    const sqlCountStory = `SELECT  report_id, reason,reports.report_msg, from_user_id AS reporter_user_id,u.username as reporter_username, u.fullname AS reporter_fullname, s.story_id,s.title AS story_title, c.message , c.comment_id, c.createdAt AS comment_created_at, c.is_deleted AS comment_is_deleted , u2.user_id AS comment_owner_id, u2.username AS comment_owner_username,u2.fullname AS  commment_owner_fullname, reports.created_at AS report_created_at FROM reports JOIN comments c on reported_story_comment_id = c.comment_id JOIN stories s on c.story_id = s.story_id JOIN users u on from_user_id = u.user_id JOIN users u2 on c.user_id = u2.user_id WHERE reason = 'story_comment_report'  ORDER BY report_id DESC LIMIT 10 OFFSET ${show}`
    
    db.query(sqlCountStory, (err, story) => {
        if (err) {
            console.log(err)
        } else {
            res.send(story)
        }
    })
}

const countStoryCmntReplyeports = async (req, res, next) => {
    const sqlCountStory = `SELECT COUNT (reason) as story_comment_reply_report from reports WHERE reason = 'story_comment_reply_report'`

    db.query(sqlCountStory, (err, story) => {
        if (err) {
            console.log(err)
        } else {
            res.send(story)
        }
    })
}

const storyReportCmntReplyDetails = async (req, res, next) => {
    const show = req.query.show
    const sqlCountStory = `SELECT  report_id,reason, reports.report_msg ,from_user_id AS reporter_user_id,u.username as reporter_username, u.fullname AS reporter_fullname, s.story_id,s.title AS story_title, c.sc_reply_text , c.sc_reply_id, c.created_at AS reply_created_at, c.is_deleted AS reply_is_deleted, u2.user_id AS reply_owner_id, u2.username AS reply_owner_username,u2.fullname AS  reply_owner_fullname, reports.created_at AS report_created_at FROM reports JOIN story_comments_reply c on reported_story_comment_reply_id = c.sc_reply_id JOIN stories s on c.story_id = s.story_id JOIN users u on from_user_id = u.user_id JOIN users u2 on c.user_id = u2.user_id WHERE reason = 'story_comment_reply_report' ORDER BY report_id DESC LIMIT 10 OFFSET ${show}`

    db.query(sqlCountStory, (err, story) => {
        if (err) {
            console.log(err)
        } else {
            res.send(story)
        }
    })
}


const deleteReport = async (req, res, next) => {
    const id = await req.params.id
    const sqlCountStory = `DELETE FROM reports WHERE report_id = '${id}';`

    db.query(sqlCountStory, (err, story) => {
        if (err) {
            console.log(err)
        } else {
            res.send(story)
        }
    })

}

//Article 

const countArticleReports = async (req, res, next) => {
    const sqlCountStory = `SELECT COUNT (reason) as post_report from reports WHERE reason = 'post_report'`

    db.query(sqlCountStory, (err, article) => {
        if (err) {
            console.log(err)
        } else {
            res.send(article)
        }
    })
}

const articleReportsDetails = async (req, res, next) => {
    const show = req.query.show
    const sqlCountStory = `SELECT report_id,reason, reports.report_msg, from_user_id AS reporter_user_id,u.username as reporter_username, u.fullname AS reporter_fullname,p.id AS post_id,p.title AS post_title, p.is_deleted AS post_is_deleted, p.created_at AS post_created_at, u2.user_id AS post_owner_id, u2.username AS post_owner_username,u2.fullname AS  post_owner_fullname, reports.created_at AS report_created_at FROM reports JOIN posts p on reports.post_id = p.id JOIN users u on from_user_id = u.user_id JOIN users u2 on p.user_id = u2.user_id WHERE reason = 'post_report' ORDER BY report_id DESC LIMIT 10 OFFSET ${show}`

    db.query(sqlCountStory, (err, story) => {
        if (err) {
            console.log(err)
        } else {
            res.send(story)
        }
    })
}

const countArticleCmntReports = async (req, res, next) => {
    const sqlCountStory = `SELECT COUNT (reason) as post_comment_report from reports WHERE reason = 'post_comment_report'`

    db.query(sqlCountStory, (err, story) => {
        if (err) {
            console.log(err)
        } else {
            res.send(story)
        }
    })
}


const articleReportCmntDetails = async (req, res, next) => {
    const show = req.query.show
    const sqlCountStory = `SELECT  report_id,reason,reports.report_msg, from_user_id AS reporter_user_id,u.username as reporter_username, u.fullname AS reporter_fullname, s.id AS post_id,s.title AS post_title, c.message , c.posts_comments_id, c.createdAt AS comment_created_at, c.is_deleted comment_is_deleted, u2.user_id AS comment_owner_id, u2.username AS comment_owner_username,u2.fullname AS  commment_owner_fullname, reports.created_at AS report_created_at FROM reports JOIN posts_comments c on reported_post_comment_id = c.posts_comments_id JOIN posts s on c.post_id = s.id JOIN users u on from_user_id = u.user_id JOIN users u2 on c.user_id = u2.user_id WHERE reason = 'post_comment_report' ORDER BY report_id DESC LIMIT 10 OFFSET ${show}`
    
    db.query(sqlCountStory, (err, story) => {
        if (err) {
            console.log(err)
        } else {
            res.send(story)
        }
    })
}

const countArticleCmntReplyeports = async (req, res, next) => {
    const sqlCountStory = `SELECT COUNT (reason) as post_comment_reply_report from reports WHERE reason = 'post_comment_reply_report'`

    db.query(sqlCountStory, (err, story) => {
        if (err) {
            console.log(err)
        } else {
            res.send(story)
        }
    })
}

const articleReportCmntReplyDetails = async (req, res, next) => {
    const show = req.query.show
    const sqlCountStory = `SELECT  report_id,reason , reports.report_msg, from_user_id AS reporter_user_id,u.username as reporter_username, u.fullname AS reporter_fullname, s.id AS post_id,s.title AS post_title, c.pc_reply_text , c.pc_reply_id, c.created_at AS reply_created_at, c.is_deleted AS reply_is_deleted, u2.user_id AS reply_owner_id, u2.username AS reply_owner_username,u2.fullname AS  reply_owner_fullname, reports.created_at AS report_created_at FROM reports JOIN posts_comments_reply c on reported_post_comment_reply_id = c.pc_reply_id JOIN posts s on c.post_id = s.id JOIN users u on from_user_id = u.user_id JOIN users u2 on c.user_id = u2.user_id WHERE reason = 'post_comment_reply_report'  ORDER BY report_id DESC LIMIT 10 OFFSET ${show}`

    db.query(sqlCountStory, (err, story) => {
        if (err) {
            console.log(err)
        } else {
            res.send(story)
        }
    })
}




module.exports = {
    countStoryReports,
    StoryReportsDetails,
    deleteReport,
    countArticleReports,
    articleReportsDetails,
    countStoryCmntReports,
    storyReportCmntDetails,
    storyReportCmntReplyDetails,
    countStoryCmntReplyeports,
    countArticleCmntReports,
    articleReportCmntDetails,
    countArticleCmntReplyeports,
    articleReportCmntReplyDetails
}
