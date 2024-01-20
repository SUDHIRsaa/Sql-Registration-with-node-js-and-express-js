
exports.signup = function(req, res){
   message = '';
   if(req.method == "POST"){
      var post  = req.body;
      var name= post.user_name;
      var pass= post.password;
      var fname= post.first_name;
      var lname= post.last_name;
      var mob= post.mob_no;

      var sql = "INSERT INTO `users`(`first_name`,`last_name`,`mob_no`,`user_name`, `password`) VALUES ('" + fname + "','" + lname + "','" + mob + "','" + name + "','" + pass + "')";

      var query = db.query(sql, function(err, result) {

         message = "Succesfully! Your account has been created.";
         res.render('signup.ejs',{message: message});
      });

   } else {
      res.render('signup');
   }
};
 

exports.login = function(req, res){
   var message = '';
   var sess = req.session; 

   if(req.method == "POST"){
      var post  = req.body;
      var name= post.user_name;
      var pass= post.password;
     
      var sql="SELECT id, first_name, last_name, user_name FROM `users` WHERE `user_name`='"+name+"' and password = '"+pass+"'";                           
      db.query(sql, function(err, results){      
         if(results.length){
            req.session.userId = results[0].id;
            req.session.user = results[0];
            console.log(results[0].id);
            res.redirect('/home/dashboard');
         }
         else{
            message = 'Wrong Credentials.';
            res.render('index.ejs',{message: message});
         }
                 
      });
   } else {
      res.render('index.ejs',{message: message});
   }
           
};

           
exports.dashboard = function(req, res, next){
           
   var user =  req.session.user,
   userId = req.session.userId;
   console.log(userId);
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";

   db.query(sql, function(err, results){
      res.render('dashboard.ejs', {user:user});    
   });       
};

exports.logout=function(req,res){
   req.session.destroy(function(err) {
      res.redirect("/login");
   }
   )
};


exports.profile = function(req, res){

   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";          
   db.query(sql, function(err, result){  
      res.render('profile.ejs',{data:result});
   });
};

exports.editprofile=function(req,res){
   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";
   db.query(sql, function(err, results){
      res.render('edit_profile.ejs',{data:results});
   });
};


const bcrypt = require("bcrypt");

exports.updateProfile = function(req, res) {
   var userId = req.session.userId;
   if (userId == null) {
       res.redirect("/login");
       return;
   }

   var post = req.body;
   var name = post.user_name;
   var pass = post.password;
   var fname= post.first_name;
   var lname= post.last_name;
    var mob= post.mob_no;

   var updateSql;

   if (pass) {
       updateSql = "UPDATE `users` SET `user_name`=?,`first_name`=?,`last_name`=?,`mob_no`=?,`password`=? WHERE `id`=?";
       db.query(updateSql, [name, fname,lname,mob,pass, userId], function(err, result) {
           if (err) throw err;
           res.redirect("/home/profile");
       });
   } 
   else {
      updateSql = "UPDATE `users` SET `user_name`=? WHERE `id`=?";
      db.query(updateSql, [name, userId], function(err, result) {
          if (err) throw err;
          res.redirect("/home/profile");
      });
  }
};

exports.deleteAccount = function(req, res) {
   var userId = req.session.userId;
   if (userId == null) {
       res.redirect("/login");
       return;
   }

   var deleteSql = "DELETE FROM `users` WHERE `id`=?";
   db.query(deleteSql, [userId], function(err, result) {
       if (err) throw err;

       req.session.destroy(function(err) {
         //   var message = "Your account has been deleted.";
         //   res.render("index.ejs", { message: message });
           res.redirect("/login");
       });
   });
};
