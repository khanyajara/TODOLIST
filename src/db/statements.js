const db = require('better-sqlite3')('database.db');
const bcrypt =require('bcrypt')

const createTable = () => {
    db.prepare(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            email TEXT NOT NULL,
            role TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `).run();
}

const insertTable = () => {
    db.prepare(`
        INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)
    `).run();
}

const createTodoListTable = () => {
    db.prepare(`
        CREATE TABLE IF NOT EXISTS todo_list (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            task TEXT NOT NULL,
            completed BOOLEAN DEFAULT FALSE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `).run();
}

export const insertTodoListTable = (userId, task) => {
    db.prepare(`
        INSERT INTO todo_list (user_id, task) VALUES (?, ?)
    `).run(userId, task);
}

export const getTodoItems = (id) => {
    return db.prepare(`
        SELECT * FROM todo_list WHERE user_id = ?
    `).all(id);
}

export const updateTodoItems = (id, task) => {
    return db.prepare(`
        UPDATE todo_list SET task = ? WHERE id = ?
    `).run(task, id);
}

export const deleteTodoItems = (id) => {
    return db.prepare(`
        DELETE FROM todo_list WHERE id = ?
    `).run(id);
}

const getTodoItemsByUser = (id) => {
    return db.prepare(`
        SELECT * FROM todo_list WHERE user_id = ?
    `).all(id);
}

const registerUser = (username,password,comfirmPassword,email)=>{
    const hashedPassword=hashPassword(password);//implement a password hashing 
    if(password!==comfirmPassword) throw new Error("passwords do not match");
    return db.prepare(`
    INSERT INTO users (username,password,email) VALUES (?,?,?)`
    ).run(username,hashedPassword,email);

}
const loginUser = (username,password)=>{
    const hashedPassword=hashPassword(password);//implement a password hashing function
    return db.prepare(`
    SELECT * FROM users WHERE username = ? AND password = ?
    `).get(username,hashedPassword);
}



const hashPassword = (password)=> {
    const saltRounds =10;
    return bcrypt.hashSync(password,saltRounds);
}

 
