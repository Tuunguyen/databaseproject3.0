const express = require('express')
const app = express()
var mysql = require("mysql");
const bodyParser = require("body-parser");
var path = require('path');
const port = process.env.PORT || 4000;
app.set('view-engine','ejs')
app.use(express.urlencoded({extended:false}))
app.use('/static', express.static('public'))
app.use(bodyParser.json());
var mysqlConnection = mysql.createPool({
    host: 'team12servermysql2.mysql.database.azure.com',
    port: '3306',
    user: 'team12adminmysql@team12servermysql2',
    password : 'Team12ProjectManagementMySQL',
    database : `projectmanagementdb`,
    ssl: true
});
app.get('/style.css', function(req, res) {
    res.sendFile(__dirname + "/public/css/" + "stylesheet.css");
  });
app.get('/setup.js', function(req, res) {
    res.sendFile(__dirname + "/public/js/" + "setup.js");
  });
app.get('/jquery.min.js', function(req, res) {
    res.sendFile(__dirname + "/public/js/" + "jquery.min.js");
  });
const options = { transports: ['websocket'], pingTimeout: 3000, pingInterval: 5000 };




app.get('/', (req, res)=> {
    res.sendFile(path.join(__dirname + '/public/index.html'));
})
app.post('/project.html', (req, res)=> {
    var projID = req.body.projID;
    res.redirect('/' + projID + '/project');
})

app.get('/:id/project', (req, res)=>{

    res.sendFile(path.join(__dirname + '/public/project.html'));
})

app.get('/:id/taskList.json', (req, res)=> {
    //with projectID it will search all the tasks that are associate with this projectID
    var searchID = req.params.id;
    console.log('its getting task in tasklist.json');
    var sql = 'SELECT taskID, empID, title, overview, startDate, finDate, estTime, totalTime, tags, status FROM projectmanagementdb.task WHERE projectID = ?';
    mysqlConnection.query(sql, [searchID], function(err, results, fields){
        if(!err){
            console.log(results);
            res.json({data: results});
        }
    })
})
app.get('/projects', (req, res)=> {
    console.log('/projects')
    var projectID = req.body;
    console.log(projectID);
    mysqlConnection.query('SELECT projectID, projectLead, timeTotal, title, overview, status, startDate, finDate, estTime, budget, current_balance FROM projectmanagementdb.project', projectID, function(err, results, field){
        if(err) throw err;
        console.log(results);
        res.json({data: results});
    })
    
})
app.get('/userslist', (req,res) =>{

    mysqlConnection.query('SELECT * FROM user', function(err, results, field){
        if(err) throw err;
        res.json( {data: results});
    })
})
app.get('/admin/userslist', (req,res) =>{

    mysqlConnection.query('SELECT * FROM projectmanagementdb.employee', function(err, results, field){
        if(err) throw err;
        console.log(results);
        res.render('userslist.ejs');
    })
})
app.post('/userslist', (req, res) => {
    var email = req.body.email;
    var sql = "DELETE FROM Employee WHERE email = ?";
    console.log(req.body);
    mysqlConnection.query(sql, [email], function(err, results, fields) {
        
        if(err){
            console.log('Could not delete' + req.body.email);
        }
        else {
            console.log('deleted' + email);
        }
    })
})
app.get('/admin/portal', (req, res)=> {
    
    res.render('admin.ejs');
})
app.post('/projects', (req, res)=> {
    
    console.log(req.body);
    res.redirect('/projects');
})


app.post('/updatetask', (req, res)=> {
    
    //create  new task or update talks that are in the project
    var projectID = req.body.projectID;

    console.log(req.body);
    //if taskID is empty then we assume its a new task
    if(req.body.taskID ===''){
            console.log('creating new');
            sql = "INSERT INTO projectmanagementdb.task SET ?";
            var values = {
                taskID: Math.round(Math.random() * 999999) + 100000,
                empID: req.body.empIDForm,
                projectID: req.body.projectIDForm,
                title: req.body.title,
                overview: req.body.overview2,
                startDate: req.body.startDate,
                finDate: req.body.finDate,
                estTime: req.body.estTime,
                totalTime: req.body.totalTime,
                tags: req.body.tags,
                status: req.body.status
            };
            mysqlConnection.query(sql, values, function(err, results, fields){
                if(err)
                {
                    console.log(err);
                }
                else{
                    console.log(results);
                    res.redirect('back');
                }

            })
    }
    else{
        sql = 'UPDATE projectmanagementdb.task SET title = ?, overview = ?, tags = ?, startDate = ?, estTime = ?, finDate = ?, totalTime = ?, status = ? WHERE taskID = ?'
        mysqlConnection.query(sql, [req.body.title, req.body.overview2, req.body.tags, req.body.startDate, req.body.estTime, req.body.finDate, req.body.totalTime, req.body.status, req.body.taskID], function(err,results,fields){
            if(err)
            {
                console.log(err);
            }
            else{
                console.log('--------------????????????????????????');
                res.redirect('back');
            }
    })
    }
    
})
app.post('/editProjects', (req, res)=> {
    
    console.log(req.body);
    res.redirect('back');
})

app.get('/:id/home', (req, res)=> {
    var searchID = req.params.id;
    var sql = 'SELECT * FROM projectmanagementdb.employee WHERE empID = ?';
    mysqlConnection.query(sql, [searchID], function(err, results, fields){
        if(!err){
            console.log(results);
            res.render('home.ejs', {data: results});
        }
        else{
            console.log(err);
        }
    })
})
app.get('/:id/tasks', (req, res)=> {
    var searchID = req.params.id;
    console.log('its getting task in tasks');
    var sql = 'SELECT taskID, empID, title, overview, startDate, finDate, estTime, totalTime, tags, status FROM projectmanagementdb.task WHERE empID = ?';
    mysqlConnection.query(sql, [searchID], function(err, results, fields){
        if(!err){
            console.log(results);
            res.json({data: results});
        }
    })
})
app.get('/:id/projectEmp.json', (req, res)=> {
    //using projectID in :id this function returns a list of employee working on the project
    var searchID = req.params.id;
    var sql = 'SELECT employee.empID, firstName, lastName from projectmanagementdb.employee left join projectmanagementdb.project_relation on project_relation.empID = employee.empID WHERE projectID = ? ';
    mysqlConnection.query(sql, searchID,function(err, results, fields){
        if(!err){
            console.log(results);
            res.json({data: results});
        }
    })
})
app.get('/:id/projectData.json', (req, res)=> {
    //using projectID in :id to return that project dates
    var searchID = req.params.id;
    var sql = 'SELECT projectID, projectLead, timeTotal, title, overview, status, startDate, finDate, estTime, budget, current_balance FROM projectmanagementdb.project WHERE projectID = ? ';
    mysqlConnection.query(sql, searchID,function(err, results, fields){
        if(!err){
            console.log(results);
            res.json({data: results});
        }
    })
})
app.get('/:id/profile.json', (req, res)=> {
    var searchID = req.params.id;
    var sql = 'SELECT * FROM projectmanagementdb.employee WHERE empID= ?';
    mysqlConnection.query(sql, searchID, function(err, results, fields){
        if(!err){
            console.log(results);
            res.json({data: results});
        }else{
            console.log(err);
        }
    })
})

app.get('/:id/dueToday.json', (req, res)=> {
    var searchID = req.params.id;
    var sql = 'SELECT taskID, projectID, finDate, title FROM Task';
    mysqlConnection.query(sql, searchID, function(err, results, fields){
        if(!err){
            console.log(results);
            res.json({data: results});
        }else{
            console.log(err);
        }
    })
})
app.get('/:id/homeLoad.json', (req, res)=> {
    var searchID = req.params.id;
    var sql = 'SELECT projectID, projectLead, title, status, finDate, budget, current_balance FROM projectmanagementdb.project WHERE projectLead = ?';
    mysqlConnection.query(sql,searchID, function(err, results, fields){
        if(!err){
            console.log(results);
            res.json({data: results});
        }
        else{
            console.log(err);
        }
    })
})

app.get('/:id/finances.json', (req, res)=> {
    var searchID = req.params.id;
    var sql = 'SELECT transID, projectID, date, amount, description FROM projectmanagementdb.transaction WHERE empID= ?';
    mysqlConnection.query(sql, searchID, function(err, results, fields){
        if(!err){
            console.log(results);
            res.json({data: results});
        }else{
            console.log(err);
        }
    })
})
app.get('/:id/meetings.json', (req, res)=> {
    var searchID = req.params.id;

    mysqlConnection.query('SELECT meetings.meetingID, meetings.projectID, date, notes FROM projectmanagementdb.meetings LEFT JOIN projectmanagementdb.meeting_relation on meeting_relation.meetingID = meetings.meetingID WHERE meeting_relation.empID = ? ORDER by meetings.date asc limit 2', [searchID], function(err, results, fields){
        if(!err){
            console.log(results);
            res.json({data: results});
        }
        else{
            console.log(err);
        }
    })
})
app.get('/:id/meetings2.json', (req, res)=> {
	var searchID = req.params.id;
	
    mysqlConnection.query('SELECT meetingID, projectID, date, notes FROM projectmanagementdb.meetings WHERE projectID = ?', [searchID], function(err, results, fields){
        if(!err){
            console.log(results);
            res.json({data: results});
        }
        else{
            console.log(err);
        }
    })
})
app.post('/login', (req, res)=>{
    var email = req.body.email;
    var password = req.body.password;
    console.log(req.body);

    mysqlConnection.query('SELECT * FROM projectmanagementdb.employee WHERE email = ?', [email],function(err, results, fields){
        if(err)
        {
            console.log("email could not be found", err);
            res.end({
                "code" : 400,
                "failed" : "error occured"
            })
        }
        else{
            
            if(results.length>0)
            {
                
                if(results[0].password == password){
                    console.log("logging in")
                    if(results[0].empID == 1)
                    {
                        res.redirect('/admin/portal');
                    }
                    else{
                        res.redirect('/' + results[0].empID + '/home');
                    }
                }
                else{
                    console.log("password did not match")
                    res.send({
                        "code": 204,
                        "success" : "email and password does not match"
                    })
                }

            }
            
        }
    } )
})

app.get('/:id/empList', (req, res)=> {
    var searchID = req.params.id;
    var sql = 'SELECT * FROM projectmanagementdb.employee ORDER BY lastName';
    mysqlConnection.query(sql, [searchID], function(err, results, fields){
        if(!err){
            console.log(results);
            res.json({data: results});
        }
    })
})

app.get('/:id/projList', (req, res)=> {
    var searchID = req.params.id;
    var sql = 'SELECT * FROM projectmanagementdb.project ORDER BY startDate DESC';
    mysqlConnection.query(sql, [searchID], function(err, results, fields){
        if(!err){
            console.log(results);
            res.json({data: results});
        }
    })
})

app.get('/:id/deptList', (req, res)=> {
    var searchID = req.params.id;
    var sql = 'SELECT * FROM projectmanagementdb.department';
    mysqlConnection.query(sql, [searchID], function(err, results, fields){
        if(!err){
            console.log(results);
            res.json({data: results});
        }
    })
})
app.get('/:id/projRelation', (req, res)=> {
    var searchID = req.params.id;
    var sql = 'SELECT * FROM projectmanagementdb.project_relation';
    mysqlConnection.query(sql, [searchID], function(err, results, fields){
        if(!err){
            console.log(results);
            res.json({data: results});
        }
    })
})
app.get('/:id/meetRelation', (req, res)=> {
    var searchID = req.params.id;
    var sql = 'SELECT * FROM projectmanagementdb.meeting_relation';
    mysqlConnection.query(sql, [searchID], function(err, results, fields){
        if(!err){
            console.log(results);
            res.json({data: results});
        }
    })
})
app.get('/:id/deptEmpRelation', (req, res)=> {
    var searchID = req.params.id;
    var sql = 'SELECT * FROM projectmanagementdb.dept_emp';
    mysqlConnection.query(sql, [searchID], function(err, results, fields){
        if(!err){
            console.log(results);
            res.json({data: results});
        }
    })
})
app.get('/:id/deptProjRelation', (req, res)=> {
    var searchID = req.params.id;
    var sql = 'SELECT * FROM projectmanagementdb.dept_proj';
    mysqlConnection.query(sql, [searchID], function(err, results, fields){
        if(!err){
            console.log(results);
            res.json({data: results});
        }
    })
}) 



app.get('/register', (req, res)=> {
    res.render('register.ejs');
})

app.get('/sucess', (req, res)=> {
    res.render('sucess.ejs');
})

app.post('/register', (req, res)=>{
    console.log(req.body);
    var id = Math.round(Math.random() * 999999) + 100000;
    console.log(id);
    sql = "INSERT INTO Employee SET ?";
    var values = {
        empID: id,
        email: req.body.email,
        password:  id + req.body.lastName,
        deptID: req.body.deptID,
        firstName: req.body.firstName,
        midName: req.body.midName,
        lastName: req.body.lastName,
        payrate: req.body.payrate,
        hourOrSal: req.body.hourOrSal,
		empType: req.body.empType
    };
    
    mysqlConnection.query(sql, values, function(err,result){
        if(!err){
            console.log('added');
            console.log(values);
            res.redirect('/sucess');
        }
        else{
            console.log(err);
            res.redirect('/register');
            console.log('did not add to user table');
        }
    })
    
    
})
app.listen(port);