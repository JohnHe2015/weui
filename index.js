const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


const app = express();
app.listen(8082);

app.all('*',(req,res,next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    // if(!req.sequelize)
    // {
    //     req.sequelize = sequelize;     //挂载sequelize对象
    //     req.Op = sequelize.Op;
    //     req.User_Model = User;         //mount model objs
    //     req.Usertemp_Model = Usertemp;
    //     req.Coupon_Model = Coupon; 
    // }
    if (req.method == 'OPTIONS') {
        res.send(200);
      } else {
        next();
      }
});

app.use(express.static('./'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.locals.utils = require('./common/common');   //定义全局函数，方便ejs中调用

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
                //res.end();   //存在用户直接跳转到用户界面
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


app.get('/coupon/:id',(req,res,next)=>{   //接收api传过来的coupon数据
    let id = req.params.id;
    request.get(
        {   
            url:`http://api.zhengshuqian.com/coupon/getById/${id}`,
        },
        function(error, response, body){
            let data;
            if(!error && response.statusCode == 200)
            {
                data = JSON.parse(body);
                res.render('coupon.ejs',{
                    data : JSON.parse(data.result)   
                });
            }
        })
});

app.get('/coupon/detail/:id/:type/:startTime/:endTime/:count/',(req,res,next)=>{        //接收coupon.ejs的参数传递给detail页面
    let {id,count,endTime,startTime,type} = req.params;
    console.log('come in /coupn/detail/..');
    let arr = [];
    for(let i = 1;i <= count ; i++)    //detail界面下拉框数组
    {
        arr.push({
            label: i.toString(),
            value: i
        })
    }
    console.log(arr)
    console.log(id)
    console.log(count)
    console.log(endTime)
    console.log(startTime)
    console.log(type)
    res.render('couponDetail.ejs',{
        data : {
            id : id,
            count : arr,
            type : type,
            startTime : startTime,
            endTime : endTime
        }   
    });
});