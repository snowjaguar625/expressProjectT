let aws = require('aws-sdk');
let nodemailer = require('nodemailer');

// configure AWS SDK
const path = require('path')
const dirPath = path.join(__dirname, '../config/config.json')

aws.config.loadFromPath(dirPath)

// create Nodemailer SES transporter
let transporter = nodemailer.createTransport({
    SES: new aws.SES({
        apiVersion: '2010-12-01'
    })
});

module.exports = transporter