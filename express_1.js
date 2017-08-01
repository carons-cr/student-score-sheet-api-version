/**
 * Created by cr on 7/27/17.
 */
let express = require('express');
let app = express();
let redis = require('redis');
let client=redis.createClient();
let count=0;

let bodyParser = require('body-parser');

app.get('/', function (req, res) {
    count++;
    client.set('count1',count);
    client.get('count1',function (err,reply) {
        res.send('此次为第'+reply+'次请求');
    });
})


app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/student', function (req, res) {
   /* client.hmset('stuInfo', req.body);
    client.hgetall('stuInfo',function (err, reply) {
        res.send(req.body); //{"name": "cr"}
        console.log(reply);  //{"name": "cr"}
    });*/
    let stuInfo=req.body;
    let stu={};
    stu.name=stuInfo.add_name;
    stu.sno=stuInfo.add_sno;
    stu.nation=stuInfo.add_nation;
    stu.klass=stuInfo.add_klass;
    stu.chinese=stuInfo.add_chinese;
    stu.math=stuInfo.add_math;
    stu.english=stuInfo.add_english;
    stu.programe=stuInfo.add_programe;
    if(isNaN(stu.name)&&!isNaN(stu.sno)&&isNaN(stu.nation)&&!isNaN(stu.klass)&&stu.chinese!==""&&stu.math!==""&&stu.english!==""&&stu.programe!=="") {
        client.hmset('stuInfo', req.body);
        client.hgetall('stuInfo',function (err, reply) {
            res.send(reply); //{"name": "cr"}
        });
    }else {
        res.send(`请按正确的格式输入（格式：姓名, 学号, 民族, 班级, 学科: 成绩, ...）：\n\n\n400`);
    }
    /*let snoArr=req.body.check_sno.split(',');
    let result='';
    for(let sno of snoArr){
        if(isNaN(sno)||sno===''){
            res.send(`请按正确的格式输入（格式：学号, 学号, ...）：`);
        }
    }
    for(let sno of snoArr){
        if(localStorage.getItem(sno)===null){
            result+=`学号为${sno}的学生不存在，将忽略对它的查询\n`;
        }else {
            let stu = JSON.parse(localStorage.getItem(sno));
            stuStore.push(stu);

        }
    }*/
})


/*
let server = app.listen(8081, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log("应用实例，访问地址为 http://%s:%s", host, port);
})*/
