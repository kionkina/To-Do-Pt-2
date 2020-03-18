
var path = require('path');
const cookieConfig = {
    httpOnly: true, // to disable accessing cookie via client side js
    //secure: true, // to force https (if you use it)
    maxAge: 1000000000, // ttl in ms (remove this option and cookie will die when browser is closed)
    signed: true // if you use the secret with cookieParser
  };
//first API server route
const dataRoutes = (app, fs) => {
    
   


app.post('/addTask', (req, res) => {
    console.log("HERE");
    var task = req.body.new_task;
    var username = req.cookies.userCookie.name;
    var sql = "INSERT INTO `tasks`(`username`, `content`, `completed`) VALUES ('" + username + "', '" + task + "', 0 )";
    var query = db.query(sql, function(err, result) {
        if (err){
            console.log(err);
        }
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
                    //console.log("RESULT:");
                    //console.log(result);
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
            //console.log(result);
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