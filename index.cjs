const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
const axios = require('axios');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('dist'));

app.get('/getmsg', (req, res) => {
    const url = "http://localhost:3010/data";
    axios.get(url).then(response => {
        console.log(response.data)
        res.status(200).send(response.data)
    })
})

app.post('/sendmsg', (req, res) => {
    console.log(req.body);

    const url = "http://localhost:3010/data"
    const customHeaders = {
        'Content-Type': 'application/json'
    }

    axios.post(url, req.body, {
        headers: customHeaders
    }).then(response => {
        res.status(200).send(response.data)
    }).catch(error => {
        console.error('POST request error: '. error)
    })
});

app.post('/updatedata', (req, res) => {
    const params = req.body;
    console.log(params);
    const url = `http://localhost:3010/data/${params.id}`

    axios.put(url, params, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        res.status(200).send(response.data)
    }).catch(err => console.error(err))
});

app.post('/email', (req, res) => {
    console.log(req.body);
    sendEmail(req.body);
})

function sendEmail(contents) {
    //SMTP 설정
    const transporter = nodemailer.createTransport({
        service: 'naver',
        host: 'smtp.naver.com',
        port: 465,
        auth: {
            user: process.env.MAIL_ADDR,
            pass: process.env.MAIL_PASS
        }
    });

    // 이메일 옵션
    const mailOptions = {
        from: process.env.MAIL_ADDR,
        to: process.env.MAIL_ADDR,
        subject: '네이버 메일을 통한 이메일 발송',
        text: JSON.stringify(contents)
    }

    //이메일 보내기
    transporter.sendMail(mailOptions, (error, info)=> {
        if (error) {
            console.log("메일에러: " + error);
        } else {
            console.log('전송 성공');
        }
    })
}

app.listen(7771, () => {
    console.log('Server Started on Port!', 7771);
})