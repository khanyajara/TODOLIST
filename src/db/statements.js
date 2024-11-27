 const db = require('better-sqlite3')('database.db');
 
const express  = require('express')
 const app = express();
 const port = 3000;





 const createTable = ()=> {
    const sql = `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        )`;
        db.prepare(sql).run();
 } 
 createTable();


 const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(string(email).toLowerCase());
    };



     app.post('/register', async (req, res) => {
        const { name, email, username, password } = req.body;

        if (!validateEmail(email)){
            return res.status(400).json({error:'Invalid email format'});
        }

        if (password!==confirmPassword){
            return res.status(400).json({error:'Password do not match'});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const sql =`
        INSERT INTO user  (name, email, username, password )
        VALUES (?,?,?,?,?)`;

        try {
            const info=db.prepare(sql).run(name, email, username, hashedPassword);
            res.status(201).json({id:info.lastInsertRowid});
            } catch (error) {
                res.status(400).json({error:"Username or email already exists"});
        }
        });


       
        app.post('/login', async (req, res) => {
            const { email, password } = req.body;
            const sql =`
            SELECT * FROM users WHERE email = ?`;

            const user =db.prepare(sql).get(email);

            if (user && await bcrypt.compare(password,user.password)){
                res.json({message:'Login successful', user});
            }else {
                res.status(401).json({error:'Invalid email or password'});
            }
            });

const createTodoListTable=() =>{
    const sql = `CREATE TABLE IF NOT EXISTS todoList (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        completed BOOLEAN NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        user_id INTEGER,
        priority INTEGER NOT NULL DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`;
    db.prepare(sql).run();
}

const createTodoTable = () => {
    const sql = `CREATE TABLE IF NOT EXISTS todo (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        completed BOOLEAN NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        user_id INTEGER,
        priority INTEGER NOT NULL DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`;
    db.prepare(sql).run();
}
const createTodoList = (title, description, date) => {
    const sql = `INSERT INTO todoList (title, description, created_at, updated_at) VALUES (?, ?, ?, ?)`;
    db.prepare(sql).run(title, description, date, date);
};

const createTodo = (title, description, date) => {
    const sql = `INSERT INTO todo (title, description, created_at, updated_at) VALUES (?, ?, ?, ?)`;
    db.prepare(sql).run(title, description, date, date);
};

 const getTodoList = () => {
    const sql = `SELECT * FROM todoList`;
    return db.prepare(sql).all();
};

const getTodo = () => {
    const sql = `SELECT * FROM todo`;
    return db.prepare(sql).all();
};

 const getTodoById = (id) => {
    const sql = `SELECT * FROM todo WHERE id = ?`;
    return db.prepare(sql).get(id);
};

 const getTodoListByUserId = (id) => {
    const sql = `SELECT * FROM todoList WHERE id = ?`;
    return db.prepare(sql).get(id);
};

 const updateTodo = (id, title, description, date) => {
    const sql = `UPDATE todo SET title = ?, description = ?, updated_at = ? WHERE id = ?`;
    db.prepare(sql).run(title, description, date, id);
};

 const updateTodoList = (id, title, description, date) => {
    const sql = `UPDATE todoList SET title = ?, description = ?, updated_at = ? WHERE id = ?`;
    db.prepare(sql).run(title, description, date, id);
};

 const deleteTodo = (id) => {
    const sql = `DELETE FROM todo WHERE id = ?`;
    db.prepare(sql).run(id);
};

  const deleteTodoList = (id) => {
    const sql = `DELETE FROM todoList WHERE id = ?`;
    db.prepare(sql).run(id);
};
export default {
    createTodoList,
    createTodo,
    getTodoList,
    getTodo,
    getTodoById,
    getTodoListById,
    updateTodo,
    updateTodoList,
    deleteTodo,
    deleteTodoList
    };
   



