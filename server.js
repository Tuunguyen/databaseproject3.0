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
var mysqlConnection = mysql.createConnection({
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




mysqlConnection.connect((err)=>{  
    if(!err)
    {
       console.log("Connected");
    }
    else{
      console.log(err);
    }
})
app.get('/', (req, res)=> {
    res.sendFile(path.join(__dirname + '/public/index.html'));
})
app.post('/project.html', (req, res)=> {
    console.log(req.body);
    res.sendFile(path.join(__dirname + '/public/project.html'));
})

app.get('/:id/taskList.json', (req, res)=> {
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
    var searchID = req.params.id;
    var sql = 'SELECT empID, firstName, lastName FROM Employee';
    mysqlConnection.query(sql, function(err, results, fields){
        if(!err){
            console.log(results);
            res.json({data: results});
        }
    })
})
app.get('/:id/profile.json', (req, res)=> {
    var searchID = req.params.id;
    var sql = 'SELECT empID, deptID, firstName, lastName, payrate, hourOrSal, datePayed, empType FROM projectmanagementdb.employee WHERE empID= ?';
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
app.get('/meetings2.json', (req, res)=> {
   

    mysqlConnection.query('SELECT meetingID, projectID, date, notes FROM projectmanagementdb.meetings', function(err, results, fields){
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



app.get('/register', (req, res)=> {
    res.render('register.ejs');
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
        deptID: '1',
        firstName: req.body.firstName,
        midName: req.body.midName,
        lastName: req.body.lastName,
        payrate: req.body.payrate,
        hourOrSal: req.body.hourOrSal
    };
    
    mysqlConnection.query(sql, values, function(err,result){
        if(!err){
            console.log('added');
            console.log(values);
            res.redirect('/');
        }
        else{
            console.log(err);
            res.redirect('/register');
            console.log('did not add to user table');
        }
    })
    
    
})
app.listen(port);