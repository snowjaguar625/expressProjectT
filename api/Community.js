
const express = require('express');
const cors = require('cors')
const db = require('./DB')

const router = express()
router.use(cors())


// Get Community

router.get('/getCommunity', async (req, res, next) => {
    const sqlSelect = "SELECT * FROM communities";
    db.query(sqlSelect, (err, documents) => {
        if (err) {
             console.log(err); next()
        }
        res.send(documents)
    })
})

module.exports = router
