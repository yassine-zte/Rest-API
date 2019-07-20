// Create express app
var express = require("express")
var app = express()
var db = require("./database.js")

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Server port
var HTTP_PORT = 8000 
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

// Insert here other API endpoints

// method all user
app.get("/api/users", (req, res, next) => {
    var sql = "select * from user"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

//get user by id
app.get("/api/user/:id", (req, res, next) => {
    var sql = "select * from user where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});

// add new user
app.post("/api/add-user/", (req, res, next) => {
    
    
    var data = {
        name: req.body.name,
        age: req.body.age,
        function : req.body.function,
        salary : req.body.salary
    }
    var sql ='INSERT INTO user (name, age, function,salary) VALUES (?,?,?,?)'
    var params =[data.name, data.age, data.function,data.salary]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

//update methode
app.patch("/api/update-user/:id", (req, res, next) => {
    var data = {
        name: req.body.name,
        age: req.body.age,
        function: req.body.function,
        salary: req.body.salary
    }
    db.run(
        `UPDATE user set 
           name = COALESCE(?,name), 
           age = COALESCE(?,age), 
           function = COALESCE(?,function) ,
           salary = COALESCE(?,salary) 
           WHERE id = ?`,
        [data.name, data.age, data.function,data.salary, req.params.id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
    });
});

//delete methode
app.delete("/api/delete-user/:id", (req, res, next) => {
    db.run(
        'DELETE FROM user WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
});
// 
//get user under specific age
app.get("/api/user-by-age/:age", (req, res, next) => {
    var sql = "select * from user where age < ?"
    var params = [req.params.age]
     //var params = []
     //var user =null;
    db.all(sql, params, (err, rows) => {
      if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            
            "data":rows
             
        })
       
        console.log(rows);
      });
});

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});
