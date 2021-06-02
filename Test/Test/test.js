//Sending Post

const sqlInsert = "INSERT INTO stories (title, community_Name, short_story, img_url, body, user_id) values(?, ?, ?, ?, ? , ?)";
db.query(sqlInsert, [storyTitle, category, storySummary, `/${storyImage.name}`, storyBody, userID], (err, documents) => {
    if (err) {
         console.log(err); next()
    }
    res.send(documents)

    // Get post Id by User

    const sqlSelectGetPostID = `SELECT story_id FROM stories WHERE user_id = '${userID}' ORDER BY created_at DESC LIMIT 1`;
    db.query(sqlSelectGetPostID, (err, documents) => {
        if (err) {
             console.log(err); next()
        }
        const forSendingTagstory_id = documents[0].story_id

        // Tags

        var json = '[' + storyTags + ']';
        var array = JSON.parse(json);
        for (i = 0; i < array.length; i++) {
            const result = array[i]
            for (i = 0; i < result.length; i++) {

                const FinalTags = result[i]
                const sqlInsertTags = "INSERT INTO tags (tag_name) values(?)";
                db.query(sqlInsertTags, [FinalTags], (err, documents) => {
                    if (err) {
                         console.log(err); next()
                    }

                    // Get Tag Name

                    const sqlGetYagName = `SELECT tag_id FROM tags WHERE tag_name ='${FinalTags}'`;
                    db.query(sqlGetYagName, (err, doc) => {
                        if (err) {
                             console.log(err); next()
                        }

                        const tagID = doc[0].tag_id

                        //send to story_tag

                        const sendTagIDWIthStoryID = `INSERT INTO story_tags (story_id, tag_id) VALUES ( ? , ? )`
                        db.query(sendTagIDWIthStoryID, [forSendingTagstory_id, tagID], (err, doc) => {
                            if (err) {
                                 console.log(err); next()
                            }
                            
                        })
                    })

                })
            }
        }


    })
})
