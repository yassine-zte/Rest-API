var sqlite3 = require('sqlite3').verbose()


const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            age INTEGER, 
            function text, 
            salary DECIMAL
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO user (name, age, function,salary) VALUES (?,?,?,?)'
                db.run(insert, ["Amine",30,"comptable",7000])
                db.run(insert, ["salah",27,"medecin",8000])
            }
        });  
    }
});


module.exports = db