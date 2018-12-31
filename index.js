const express = require('express');
const fs = require('fs');

const app = express();
app.listen(8082);
app.use(express.static('./'));

app.set('view engine','ejs');
app.set('views',__dirname + '/ejs');


app.get('/',(req,res,next)=>{
    console.log(JSON.stringify(req.query));
    console.log(req.query.nickname);
    res.sendfile('./index.html')
})

app.get('/register',(req,res,next)=>{
    console.log('come in register');
    console.log(JSON.stringify(req.query));
    res.render('register.ejs',{      //获取的微信用户数据传递给register
        data : 
        {
            username : req.query.username,
            openid : req.query.openid,
            sex : req.query.sex,
            groupid : req.query.groupid
        }
    })
})