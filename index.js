

function displayStu(e) {
    e.preventDefault();
    let str=`<tr>
        <th class="info">姓名</th>
        <th class="info">语文</th>
        <th class="info">数学</th>
        <th class="info">英语</th>
        <th class="info">编程</th>
    </tr>`;
    $.get('/all',function(res) {
        if(!res){
            alert('暂无数据');
        }else {
            let allStu = JSON.parse(res);
            let allStuArr = allStu.stus;
            for (let i = 0; i < allStuArr.length; i++) {
                let stu = allStuArr[i];
                str += `<tr><td>${stu.name}</td><td>${stu.chinese}</td><td>${stu.math}</td><td>${stu.english}</td><td>${stu.programe}</td></tr>`;
            }
            $(`#table-grade`).html('');
            if(allStuArr.length>0){
                $(`#table-grade`).append(str);
            }
        }
    })
}
function addStu(e){
    e.preventDefault();
    let stu={};
    stu.name=$('#add-name').val();
    stu.sno=$('#add-sno').val();
    stu.nation=$('#add-nation').val();
    stu.klass=$('#add-klass').val();
    stu.chinese=$('#add-chinese').val();
    stu.math=$('#add-math').val();
    stu.english=$('#add-english').val();
    stu.programe=$('#add-programe').val();
    $.post('/student',stu,function (res) {
            alert(res);
    })
}
function checkStu(e) {
    e.preventDefault();
    //let haveStu=0;
    let str=`<tr>
        <th class="info">姓名</th>
        <th class="info">语文</th>
        <th class="info">数学</th>
        <th class="info">英语</th>
        <th class="info">编程</th>
        <th class="info">总分平均分</th>
        <th class="info">总分中位数</th>
    </tr>`;
    let checkSno=$('#check-sno').val();
    $.get(`/students?checkSno=${checkSno}`,function (res) {
         if(res==='400'){
             alert(`请按正确的格式输入（格式： 学号, 学号, ...）：`);
         }else{
             let checkStuArr=JSON.parse(res).stus;
             let Avg=JSON.parse(res).Avg;
             let Mid=JSON.parse(res).Mid;
             for(let stu of checkStuArr){
                 str += `<tr><td>${stu.name}</td><td>${stu.chinese}</td><td>${stu.math}</td><td>${stu.english}</td><td>${stu.programe}</td></td><td><td></td></tr>`;
             }
             str+=`<tr><td></td><td></td><td></td><td></td><td></td><td>${Avg}</td><td>${Mid}</td></tr>`;
             $(`#table-grade`).empty();
             $(`#table-grade`).append(str);
         }
    })
}

function deleteStu(e) {
    e.preventDefault();
    let checkSno=$('#check-sno').val();
    $.ajax({
        url: `/students/${checkSno}`,
        type:'DELETE',
        success: function(res){
           alert(res);
        },
        error: function (err) {
            alert(err);
        }
    });
}

function updateStu(e) {
    e.preventDefault();
    let stu={};
    stu.name=$('#add-name').val();
    stu.sno=$('#add-sno').val();
    stu.nation=$('#add-nation').val();
    stu.klass=$('#add-klass').val();
    stu.chinese=$('#add-chinese').val();
    stu.math=$('#add-math').val();
    stu.english=$('#add-english').val();
    stu.programe=$('#add-programe').val();
    $.ajax({
        url: `/students/${stu.sno}`,
        type:'PUT',
        data:stu,
        success: function(res){
            alert(res);
        },
        error: function (res) {
            alert(res);
        }
    });
}
function freshen() {
    
}