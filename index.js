const express = require('express');
const request = require('request');

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
    let id = req.query.openid;
    request.get({
        url : `http://api.zhengshuqian.com/login/isLogin?id=${id}`
    },function(error, response, body){
        console.log('come in callback');
        console.log('response : '+JSON.stringify(response));
        console.log(body);
        if(response.statusCode == 200){
            if(response.errcode == 1)
            {
                res.render('user.ejs',{

                })
                res.end();   //存在用户直接跳转到用户界面
            }
            else
            {
                res.render('register.ejs',{      //获取的微信用户数据传递给register
                    data : 
                    {
                        username : req.query.username,
                        openid : req.query.openid,
                        sex : req.query.sex,
                        groupid : req.query.groupid
                    }
                })
            }
        }
    })
    
})