const express = require('express');
const router = express.Router();
const request = require('request');
const utils = require('./../common/common');
const QRCode = require('qrcode');


router.post('/generateQR',(req,res,next)=>{
    let {id,type,count,startTime,endTime,cusType} = req.body;
    let url = `http://api.zhengshuqian.com/coupon/verification?id=${id}&type=${type}&startTime=${startTime}&endTime=${endTime}&count=${count}`;
    QRCode.toDataURL(url, (err, baseurl)=> {
        if(err) console.log(err)
        res.send(JSON.stringify({src : baseurl, type : type, count : count, cusType : cusType}));
    })
    
})

router.get('/result',(req,res,next)=>{   //获取二维码的base64，渲染scan.ejs
    let {src, count, type} = req.query;
    console.log("src："+src)
    console.log("count : "+count)
    console.log("type:"+type)
    // res.render('result.ejs',{
    //     data : 
    //     {
    //         src : src,
    //         type : type,
    //         count : count
    //     }
    // })
    res.redirect('http://www.baidu.com')
})

router.get('/success',(req,res,next)=>{ 
    res.render('result.ejs',{
    });
})


router.get('/:id',(req,res,next)=>{   //接收api传过来的coupon数据
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

router.get('/detail/:id/:type/:startTime/:endTime/:count/:rate/',(req,res,next)=>{        //接收coupon.ejs的参数传递给detail页面
    let {id,count,endTime,startTime,type,rate} = req.params;
    var arr = [];
    let count_temp = parseInt(count);
    for(let i = 1;i <= count_temp ; i++)    //detail界面下拉框数组
    {
        arr.push({
            label: i.toString(),
            value: i
        })
    }
    let cusType;
    let _startTime;
    let _endTime;
    if(type == "1")
    {
        cusType = "MUSEE CAFE 咖啡券";
    }
    else if (type == "2")
    {
        cusType = (rate*10)+"折拍摄券";
    }
    else if (type == "3")
    {
        cusType = (rate*10)+"折摄影券";
    }
    _startTime = utils.getDate2(parseInt(startTime));
    _endTime = utils.getDate2(parseInt(endTime));
    res.render('couponDetail.ejs',{
        data : {
            id : id,
            arr : arr,
            type : type,
            cusType : cusType,
            startTime : startTime,
            endTime : endTime,
            _startTime : _startTime,
            _endTime : _endTime,
            count : count_temp
        }   
    });
});



module.exports = router;