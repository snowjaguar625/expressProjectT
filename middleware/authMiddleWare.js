const jwt = require('jsonwebtoken')

const requirePath = async (req, res, next) =>{
    const token = await req.headers.authorization;

    if(token){
        jwt.verify(token, 'fgDataSa', (err, decodedToken)=>{
            if(err){
                // console.log(err)
                res.status(400).send('Bad Request User Error')
            } else{
                next()
            }
        })
    }
    else{
        res.status(400).send('Bad Request User Error')
    }
}

module.exports = {requirePath}