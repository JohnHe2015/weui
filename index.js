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
    // let {id,username} = req.query;
    let id = req.query.openid;
    //let username = req.query.username;
    request.get({
        url : `http://api.zhengshuqian.com/login/isLogin?id=${id}`
    },function(error, response, body){
        if(response.statusCode == 200){
            let data = JSON.parse(body);
            if(data.errcode == 1)
            {
                //已经注册的用户，那么先获取用户的用户名等信息
                console.log('execute user.ejs')
                res.render('user.ejs',{
                    id : id,
                    username : data.username          //获取接口传递过来的username(数据库的username)
                    //输送用户信息到user.ejs
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
