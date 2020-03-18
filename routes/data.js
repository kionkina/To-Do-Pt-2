const fs = require("fs");
const readFile = fs.readFile;
const writeFile = fs.writeFile;
var path = require('path');
const axios = require('axios');
const cookieConfig = {
    httpOnly: true, // to disable accessing cookie via client side js
    //secure: true, // to force https (if you use it)
    maxAge: 1000000000, // ttl in ms (remove this option and cookie will die when browser is closed)
    signed: true // if you use the secret with cookieParser
  };
//first API server route
const dataRoutes = (app, fs) => {
    
   


    const toggleTask = (id, res, encoding = 'utf8') => {
        readFile(path.join(__dirname,'../data.json'),  'utf8', (err, data) => {
            if (err) {
                throw err;
            }
    
            var taskArray = JSON.parse(data);
            
            console.log("STATE OF THIS ID: ");
            console.log(taskArray[id]["completed"]); 

            console.log("SETTING STATE OF THIS ID TO: ");
            console.log(!(taskArray[id]["completed"])); 

            taskArray[id]["completed"] = !(taskArray[id]["completed"]);

            writeFile(path.join(__dirname,'../data.json'), JSON.stringify(taskArray), encoding, (err) => {
            if (err) {
                throw err;
            }
            console.log("added data");
            res.send(JSON.parse(data));
        });
    });

}


const deleteTask = (id, res, encoding = 'utf8') => {
    readFile(path.join(__dirname,'../data.json'),  'utf8', (err, data) => {
        if (err) {
            throw err;
        }

        var taskArray = JSON.parse(data);
        taskArray.splice(id, 1);

        writeFile(path.join(__dirname,'../data.json'), JSON.stringify(taskArray), encoding, (err) => {
        if (err) {
            throw err;
        }
        console.log("added data");
        res.send(JSON.parse(data));
    });
});

}
    

app.get('/data', (req, res) => {
    console.log("Running /data");
       readFile(path.join(__dirname,'../data.json'),  'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        res.send(JSON.parse(data));
    });
});

app.post('/toggle_complete', (req, res) => {
    var taskId = req.body.id;
    toggleTask(taskId, res);
});

app.post('/delete_task', (req, res) => {
    var taskId = req.body.id;
    deleteTask(taskId, res);
});





app.post('/add', (req, res) => {
        var newTask = req.body.new_task.toString();
        console.log(newTask);

        var toAdd = {}
        toAdd["name"] = newTask;
        toAdd["completed"] = false;
        
        readFile(path.join(__dirname,'../data.json'),  'utf8', (err, data) => {
                if (err) {
                    throw err;
                }
        
                var taskArray = JSON.parse(data);
                taskArray.push(toAdd);
    
                writeFile(path.join(__dirname,'../data.json'), JSON.stringify(taskArray), 'utf8', (err) => {
                if (err) {
                    throw err;
                }
                console.log("added data");
           
                res.redirect('/part1c-d');
            });
        });
        
      
    });


app.post('/addTask', (req, res) => {
    console.log("HERE");
    var task = req.body.new_task;
    var username = req.cookies.userCookie.name;
    var sql = "INSERT INTO `tasks`(`username`, `content`, `completed`) VALUES ('" + username + "', '" + task + "', 0 )";
    var query = db.query(sql, function(err, result) {
        if (err){
            console.log(err);
        }
        console.log("RESULT:");
        console.log(result);
        res.redirect('/home');
     });


});



app.post('/addUser', (req, res) => {
    var username = req.body.username;
    var query = "SELECT * FROM users AS usr WHERE username = "  + "'" + username + "'";
    var userExists = false;
    //checking if user exists
    var q = db.query(query, function(err, result) {
        if (err){
            console.log(err);
        }
        else {

            if (result.length > 0){
                console.log("user Exists")
                userExists = true;
            }
            //if exists
            if (userExists){
                res.redirect("/login?msg=User+already+exists. Please try again.");
            }

            else{
                var sql = "INSERT INTO `users`(`username`) VALUES ('" + username + "')";
                query = db.query(sql, function(err, result) {
                    if (err){
                        console.log(err);
                    }
                    console.log("RESULT:");
                    console.log(result);
                    res.redirect("/login?msg=Successfully+added+user.");
                 });
            }
        }
    })
});
   

 





    app.get('/logout', (req,res) => {
        if (req.cookies.userCookie){
            res.clearCookie("userCookie");
        }
        res.redirect('/login');
    });
    



    app.post('/auth', (req, res) => {
        var username = req.body.username;
        var query = "SELECT * FROM users AS usr WHERE username = "  + "'" + username + "'";
        var userExists = false;
        //checking if user exists
        var q = db.query(query, function(err, result) {
            if (err){
                console.log(err);
            }
            else {
                //console.log(result);
                //console.log(result[0].id);
                if (result.length == 0){
                    res.redirect("/login?msg=User+does+not+exist.");
                }
                else {
                var id = result[0].id;
                res.cookie('userCookie', {name:username, id:id});
                res.redirect('/home');
                }
            }
          
    }); 
});
    



    app.get('/home', function(req, res){
        if (!req.cookies.userCookie){
            res.redirect("/login?msg=Please+log+in+or+sign+up"); 
        }
        else {
        var username = req.cookies.userCookie.name;
        var query = "SELECT * FROM tasks WHERE username = "  + "'" + username + "'";
        var q = db.query(query, function(err, result) {
        if (err){
            console.log(err);
        }
        else {
            list = result;
            console.log(result);
            res.render("home", {layout: "userTasks",  list:list, username:username});
        }
        }) //end else
    };

    app.post('/delete_user_task', function(req, res){
        var id = req.body.id;
        var username = req.cookies.userCookie.name;
        var query = "DELETE FROM tasks WHERE username = "  + "'" + username + "' AND `id` = " + id;
        var q = db.query(query, function(err, result) {
        if (err){
            console.log(err);
        }
        else {
            console.log("DELETED");
            res.redirect('/home');
        }   
        }) //end else
    });


    app.post('/toggle_task_complete', function(req, res){ 
        var id = req.body.id;
        
        var new_completed = req.body.completed;
        console.log("new completed:");
        console.log(new_completed);
        if (new_completed == "false"){
            new_completed = 0;
        }
        else {
            new_completed = 1;
        }
       
        var username = req.cookies.userCookie.name;

        console.log("new_completed:");
        console.log(new_completed);

        var sql = "UPDATE tasks SET completed = " + new_completed + " WHERE `username` = '" +username + "' AND " + "`id` = " + id;
        var q = db.query(sql, function(err, result) {
            if (err){
                console.log(err);
            }
            else {
                console.log("TOGGLED");
                res.redirect('/home');
            }   
        }) //end else



    });
    

}); 

}
module.exports = dataRoutes;