/**
 * Created by cr on 7/29/17.
 */
let express = require('express');
let app = express();
let redis = require('redis');
let client=redis.createClient();
let bodyParser = require('body-parser');
let allStu={};
let stuStore=[];

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/index',function (req,res) {
    res.sendFile(__dirname+"/index.html");
})

app.get('/all', function (req, res) {
    client.get('allstu',function (err, reply) {
         res.send(reply); //{"stus":[{"name":"cr1","sno":"1"...},{"name":"cr2","sno":"2"...}]}
    });
})

app.get('/students', function (req, res) {
    let checkSnoStr=req.query.checkSno;
    let checkSnoArr=checkSnoStr.split(',');
    let formatTag=0;
    for(let sno of checkSnoArr){
        if(isNaN(sno)||sno===''){
            formatTag=1;
            break;
        }
    }
    if(formatTag===1){
        res.send('400');
        res.status(400);
    }else {
        client.get('allstu', function (err, reply) {
            let stuArr = JSON.parse(reply).stus;
            //console.log(stuArr);   //注意输出时不要把字符串与数组，对象等相加，会出现异常
            let checkStuArr = [];
            for (let i = 0; i < stuArr.length; i++) {
                for (let sno of checkSnoArr) {
                    if (stuArr[i].sno === sno) {
                        checkStuArr.push(stuArr[i]);
                    }
                }
            }
            let checkStu = {};
            checkStu.stus = checkStuArr;
            checkStu.Avg=getAvg(checkStuArr);
            checkStu.Mid=getMid(checkStuArr);
            res.send(JSON.stringify(checkStu)); //{"stus":[{"name":"cr1","sno":"1"...},{"name":"cr2","sno":"2"...}],"Avg":"...","Mid":"..."}
        });
    }

})

app.post('/student', function (req, res) {
    if(isNaN(req.body.name)&&!isNaN(req.body.sno)&&isNaN(req.body.nation)&&!isNaN(req.body.klass)&&req.body.chinese!==""&&req.body.math!==""&&req.body.english!==""&&req.body.programe!=="") {
        let isExists=0;
        for(let stu of stuStore){
           if(stu==req.body){
               isExists=1;
           }
        }
       if(isExists===1){
           res.send(`该学生已存在，不可重复添加!`);
       }else {
           stuStore.push(req.body);
           allStu.stus=stuStore;
           client.set('allstu', JSON.stringify(allStu));
           res.send(`添加成功!`);
       }
    }else {
        res.send(`请按正确的格式输入（格式：姓名, 学号, 民族, 班级, 学科: 成绩, ...）：`);
        res.status(400);
    }
})

app.delete('/students/:id', function (req, res) {
    let checkSno=req.params.id;
    let isIn = 0;
    if (isNaN(checkSno) || checkSno === '') {
        res.status(400).send(`请按正确的格式输入（格式： 学号, 学号, ...）：`);
    } else {
        client.get('allstu', function (err, reply) {
            let stuArr = JSON.parse(reply).stus;
            //console.log(stuArr);   //注意输出时不要把字符串与数组，对象等相加，会出现异常
            for (let i = 0; i < stuArr.length; i++) {
                if (stuArr[i].sno === checkSno) {
                    stuArr.splice(i, 1);
                    res.send(`该学生已成功删除`);
                    isIn = 1;
                    break;
                }
            }
            if (isIn !== 1) {
                res.send(`该学生不存在！！`);
            }
            let allStu = {};
            allStu.stus = stuArr;
            client.set('allstu', JSON.stringify(allStu));
        });
    }

})


app.put('/students/:sno', function (req, res) {
    let sno=req.params.sno;
    let checkStu=req.body;
    let isIn = 0;
    if (isNaN(sno) || sno === '') {
        res.status(400).send(`请按正确的格式输入（格式： 学号, 学号, ...）：`);
    } else {
        client.get('allstu', function (err, reply) {
            let stuArr = JSON.parse(reply).stus;
            //console.log(stuArr);   //注意输出时不要把字符串与数组，对象等相加，会出现异常
            for (let i = 0; i < stuArr.length; i++) {
                if (stuArr[i].sno === sno) {
                    stuArr[i]=checkStu;
                    isIn = 1;
                    res.send(`该学生已成功修改`);
                    break;
                }
            }
            if (isIn !== 1) {
                res.send(`该学生不存在！！`);
            }
            let allStu = {};
            allStu.stus = stuArr;
            client.set('allstu', JSON.stringify(allStu));
        });
    }
})

let server = app.listen(8081, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log("应用实例，访问地址为 http://%s:%s", host, port);
})


function get_sum(stu) {
    let sum=parseInt(stu.chinese)+parseInt(stu.math)+parseInt(stu.english)+parseInt(stu.programe);
    return sum;
}
function getAvg(stuStore){
    let Sum=0;
    let Avg;
    for(let stu of stuStore){
        Sum+=get_sum(stu);
    }
    Avg=(Sum/stuStore.length).toFixed(2);
    return Avg;
}
function getMid(stuStore) {
    let sumArr=[];
    let Mid;
    for(let stu of stuStore){
        sumArr.push(get_sum(stu));
    }
    sumArr.sort(function(a,b){return a-b});
    var MidIndex=parseInt((sumArr.length)/2);
    if(sumArr.length%2==0){
        Mid=(sumArr[MidIndex-1]+sumArr[MidIndex])/2;
    }else{
        Mid=sumArr[MidIndex];
    }
    return Mid;
}