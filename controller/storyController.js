const db = require('../api/DB')
const moment = require("moment-timezone")


//All Story 

const getAllstoryWithUser = async (req, res, next) => {
    const show = await req.query.visible
    const sqlSelect = `SELECT story_id,title,community_id,short_story,body,post_thumbnail,tags,stories.user_id,stories.created_at,stories.is_deleted,u.user_id,fullname,username,email,avatar,subscribe_newsletter,dob,u.created_at, u.is_deleted, c.community_title FROM stories INNER JOIN communities c on stories.community_id = c.id INNER JOIN users u on stories.user_id = u.user_id WHERE stories.is_deleted = 0 AND c.is_deleted = 0 AND u.is_deleted = 0  ORDER BY stories.created_at DESC  LIMIT 12 OFFSET ${show}`;
    db.query(sqlSelect, (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        res.send(documents)
    })
}

//Partiicular Story

const getParticularStoryWithsUser = async (req, res, next) => {
    const id = await req.query.id
    const sqlSelect = `SELECT story_id,title,community_id,short_story,body,post_thumbnail,tags,stories.user_id,stories.created_at,stories.is_deleted,u.user_id,fullname,username,email,avatar,subscribe_newsletter,dob,u.created_at, u.is_deleted, c.community_title FROM stories INNER JOIN communities c on stories.community_id = c.id INNER JOIN users u on stories.user_id = u.user_id WHERE story_id = '${id}' AND stories.is_deleted = 0 AND c.is_deleted = 0 AND u.is_deleted = 0`;
    db.query(sqlSelect, (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        res.send(documents)
    })
}

//Edit Story

const editStory = async (req, res, next) => {
    const storyTitle = await req.body.storyTitle;
    const category = await req.body.category;
    const storySummary = await req.body.storySummary;
    const storyBody = await req.body.storyBody;
    const storyTags = await req.body.storyTags;
    const storyID = await req.body.storyID;

    const sqlUpdateStory = `UPDATE fnmotivation.stories t SET t.title = '${storyTitle}', t.short_story = '${storySummary}',  t.body = '${storyBody}',  t.tags = '${storyTags}' WHERE t.story_id = '${storyID}'`;
    db.query(sqlUpdateStory, (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        res.send(documents)
    })
}

//Search Story 

const searchStory = async (req, res, next) => {
    const search = await req.query.search
    const sqlSearchSelect = `SELECT * FROM stories INNER JOIN communities c on stories.community_id = c.id INNER JOIN users u on stories.user_id = u.user_id WHERE (stories.tags LIKE ('%${search}%') OR title LIKE ('%${search}%')) AND stories.is_deleted = 0`;
    db.query(sqlSearchSelect, (err, documents) => {
        if (err) {
            console.log(err);
            next()
        }
        res.send(documents)
    })
}

// USer Search Story

const getUserSearchAllStory = async (req, res, next) => {

    const searchResultID = await req.query.search
    const userID = searchResultID.split(',')[0]
    const search = searchResultID.split(',')[1]

    if (searchResultID) {
        const sqlSelect = `SELECT story_id,title,community_id,short_story,body,post_thumbnail,tags,user_id,created_at,updated_at,stories.is_deleted,id,community_title,image_url,c.is_deleted FROM stories INNER JOIN communities c on stories.community_id = c.id WHERE (short_story LIKE  ('%${search}%') OR body LIKE ('%${search}%') OR title LIKE ('%${search}%')  OR community_title LIKE ('%${search}%')) AND stories.is_deleted = 0 AND user_id = '${userID}' AND c.is_deleted = 0 ORDER BY stories.created_at DESC`;
        db.query(sqlSelect, (err, documents) => {
            if (err) {
                console.log(err); next()
            }
            res.send(documents)
        })
    }
}

// Delete  Particular story

const deletePArticualrStory = async (req, res, next) => {
    const id = await req.query.id
    const sqlDeletePost = `UPDATE fnmotivation.stories t SET t.is_deleted = '1' WHERE t.story_id= '${id}'`
    db.query(sqlDeletePost, (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        res.send(documents)
    })
}

// Selected Story

const getSelectedStory = async (req, res, next) => {
    const catID = await req.query.catID

    const sqlSelect = `SELECT story_id,title,community_id,short_story,body,post_thumbnail,tags,stories.user_id,stories.created_at,stories.updated_at,stories.is_deleted,id,community_title,image_url,c.is_deleted,u.user_id,fullname,username,email,about,GoogleId,AppleId,GoogleAuthKey,AppleAuthKey,gender,password,role,avatar,subscribe_newsletter,dob,u.created_at,u.updated_at,u.is_deleted FROM stories INNER JOIN communities c on stories.community_id = c.id INNER JOIN users u on stories.user_id = u.user_id WHERE community_id = '${catID}' AND stories.is_deleted = 0 ORDER BY stories.created_at DESC LIMIT 12;`;
    db.query(sqlSelect, (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        res.send(documents)

    })
}

//Get Following Story

const getFollowingStroy = async (req, res, next) => {
    const id = await req.query.id
    const userID = id.split(',')[0]
    const show = id.split(',')[1]
    const sqlSelect = `select story_id,title,community_id,short_story,body,post_thumbnail,tags,stories.user_id,stories.created_at,stories.updated_at,stories.is_deleted,u.user_id,fullname,username,email,about,GoogleId,AppleId,GoogleAuthKey,AppleAuthKey,gender,password,role,avatar,subscribe_newsletter,dob,u.created_at,u.updated_at,u.is_deleted,c.id,community_title,image_url,c.is_deleted from followers join stories on stories.user_id=followers.user_id INNER JOIN users u on stories.user_id = u.user_id INNER JOIN communities c on stories.community_id = c.id WHERE followers.follower_id= '${userID}' AND u.is_deleted = 0 AND stories.is_deleted = 0 AND Type = 1 ORDER BY stories.created_at DESC  LIMIT 12 OFFSET ${show}`;
    db.query(sqlSelect, (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        res.send(documents)

    })

}

//Get Following Story

const getCommunityStory = async (req, res, next) => {
    const id = await req.query.id
    const userID = id.split(',')[0]
    const show = id.split(',')[1]
    const sqlSelect = `SELECT story_id,title,community_id,short_story,body,post_thumbnail,tags,s.user_id,s.created_at,s.updated_at,s.is_deleted,c.community_title, u.user_id,fullname,username,email,about,GoogleId,AppleId,GoogleAuthKey,AppleAuthKey,gender,password,role,avatar,subscribe_newsletter,dob,u.created_at,u.updated_at,u.is_deleted FROM users_community_subscription INNER JOIN stories s on users_community_subscription.CommunityId = s.community_id INNER JOIN users u on s.user_id = u.user_id INNER JOIN communities c on s.community_id = c.id WHERE users_community_subscription.UserId = '${userID}'  AND s.is_deleted = 0 AND users_community_subscription.Type = 1 AND u.is_deleted = 0 ORDER BY s.created_at DESC LIMIT 12 OFFSET ${show}`;
    db.query(sqlSelect, (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        res.send(documents)

    })

}

var now = moment();
var localOffset = now.utcOffset();
now.tz("America/Danmarkshavn"); // your time zone, not necessarily the server's
var centralOffset = now.utcOffset();
var diffInMinutes = localOffset - centralOffset;
const diff = diffInMinutes / 60
let time = moment(now).subtract(24, 'hours').format()

//Popular Stroy 

const getPopularStory = async (req, res, next) => {
    const show = await req.query.show
    const sqlSelect = `SELECT stories.story_id, title, community_id, short_story, body, post_thumbnail, tags, stories.created_at, stories.updated_at, stories.is_deleted, id AS community_id, community_title, image_url, u.user_id, fullname, username, email, stc.total_comments FROM stories INNER JOIN communities c on stories.community_id = c.id INNER JOIN users u on stories.user_id = u.user_id INNER JOIN stories_total_comments stc on stories.story_id = stc.story_id INNER JOIN stories_likes_counter slc on stories.story_id = slc.story_id WHERE u.is_deleted = 0 AND stories.is_deleted = 0 AND (stc.updated_at BETWEEN '${time}' AND NOW() OR slc.updated_at BETWEEN '${time}' AND NOW()) ORDER BY (total_likes+total_comments) DESC LIMIT 12 OFFSET ${show}`;
    const sqlLikePopular = `SELECT stories.story_id,title,community_id,short_story,body,post_thumbnail,tags,stories.created_at,stories.updated_at,stories.is_deleted,id AS community_id,community_title,image_url,u.user_id,fullname,username,email,stc.total_comments FROM stories INNER JOIN communities c on stories.community_id = c.id INNER JOIN users u on stories.user_id = u.user_id INNER JOIN stories_total_comments stc on stories.story_id = stc.story_id JOIN stories_likes_counter slc on stories.story_id = slc.story_id  WHERE u.is_deleted = 0 AND stories.is_deleted = 0    ORDER BY (total_likes+total_comments) DESC LIMIT 12 OFFSET ${show};`;
    db.query(sqlSelect, (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        // console.log(documents)
        if(documents.length !== 0){
            res.send(documents)
        } else{
            db.query(sqlLikePopular, (err, documents) => {
                if (err) {
                    console.log(err); next()
                }
              res.send(documents)
            })
        }

    })
}

//Tag Post

const getTagPosts = async (req, res, next) => {
    const data = await req.query.tag
    const tag = data.split(',')[0]
    const show = data.split(',')[1]

    const sqlSearchSelect = `SELECT story_id,title,community_id,short_story,body,post_thumbnail,tags,stories.user_id,stories.created_at,stories.updated_at,stories.is_deleted,u.user_id,fullname,username,email,avatar,subscribe_newsletter,dob,u.created_at, u.is_deleted, c.community_title FROM stories INNER JOIN users u on stories.user_id = u.user_id INNER JOIN communities c on stories.community_id = c.id WHERE (tags LIKE  ('%${tag}%')) AND stories.is_deleted = 0  ORDER BY stories.created_at DESC  LIMIT 12 OFFSET ${show}`
    db.query(sqlSearchSelect, (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        res.send(documents)
    })


}

//getStoryByCommunity

const getStoryByCommunity = async (req, res, next) => {
    const communityID = await req.params.communityID
    const show = await req.query.visible

    const sqlSearchSelect = `SELECT story_id,title,community_id,short_story,body,post_thumbnail,tags,stories.user_id,stories.created_at,stories.is_deleted,u.user_id,fullname,username,email,avatar, c.community_title FROM stories INNER JOIN communities c on stories.community_id = c.id INNER JOIN users u on stories.user_id = u.user_id WHERE stories.is_deleted = 0 AND c.is_deleted = 0 AND u.is_deleted = 0 AND c.id = ${communityID}  ORDER BY stories.created_at DESC  LIMIT 12 OFFSET ${show}`
    db.query(sqlSearchSelect, (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        res.send(documents)
    })

}

//getStoryPopularByCommunity

const getStoryPopularByCommunity = async (req, res, next) => {
    const communityID = await req.params.communityID
    const show = await req.query.show

    const sqlSearchSelect = `SELECT stories.story_id, title, community_id, short_story, body, post_thumbnail, tags, stories.created_at, stories.updated_at, stories.is_deleted, id AS community_id, community_title, image_url, u.user_id, fullname, username, email, stc.total_comments FROM stories INNER JOIN communities c on stories.community_id = c.id INNER JOIN users u on stories.user_id = u.user_id INNER JOIN stories_total_comments stc on stories.story_id = stc.story_id INNER JOIN stories_likes_counter slc on stories.story_id = slc.story_id WHERE u.is_deleted = 0 AND stories.is_deleted = 0 AND c.id = ${communityID} AND (stc.updated_at BETWEEN '${time}' AND NOW() OR slc.updated_at BETWEEN '${time}' AND NOW()) ORDER BY (total_likes+total_comments) DESC LIMIT 12 OFFSET 0;`
    const sqlLikePopular = `SELECT stories.story_id,title,community_id,short_story,body,post_thumbnail,tags,stories.created_at,stories.updated_at,stories.is_deleted,id AS community_id,community_title,image_url,u.user_id,fullname,username,email,stc.total_comments FROM stories INNER JOIN communities c on stories.community_id = c.id INNER JOIN users u on stories.user_id = u.user_id INNER JOIN stories_total_comments stc on stories.story_id = stc.story_id JOIN stories_likes_counter slc on stories.story_id = slc.story_id  WHERE u.is_deleted = 0 AND stories.is_deleted = 0 AND c.id = ${communityID}    ORDER BY (total_likes+total_comments) DESC LIMIT 12 OFFSET ${show};`

    db.query(sqlSearchSelect, (err, documents) => {
        if (err) {
            console.log(err); next()
        }
        if(documents.length !== 0){
            res.send(documents)
        } else{
            db.query(sqlLikePopular, (err, documents) => {
                if (err) {
                    console.log(err); next()
                }
              res.send(documents)
            })
        }
    })

}

module.exports = {
    getAllstoryWithUser,
    getParticularStoryWithsUser,
    editStory,
    searchStory,
    getUserSearchAllStory,
    deletePArticualrStory,
    getSelectedStory,
    getFollowingStroy,
    getCommunityStory,
    getPopularStory,
    getTagPosts,
    getStoryByCommunity,
    getStoryPopularByCommunity
}