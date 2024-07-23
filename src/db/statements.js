 const db = require('better-sqlite3')('database.db');

function createTodoListTable() {
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

export const createTodoTable = () => {
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
};

export const createTodoList = (title, description, date) => {
    const sql = `INSERT INTO todoList (title, description, created_at, updated_at) VALUES (?, ?, ?, ?)`;
    db.prepare(sql).run(title, description, date, date);
};

export const createTodo = (title, description, date) => {
    const sql = `INSERT INTO todo (title, description, created_at, updated_at) VALUES (?, ?, ?, ?)`;
    db.prepare(sql).run(title, description, date, date);
};

export const getTodoList = () => {
    const sql = `SELECT * FROM todoList`;
    return db.prepare(sql).all();
};

export const getTodo = () => {
    const sql = `SELECT * FROM todo`;
    return db.prepare(sql).all();
};

export const getTodoById = (id) => {
    const sql = `SELECT * FROM todo WHERE id = ?`;
    return db.prepare(sql).get(id);
};

export const getTodoListById = (id) => {
    const sql = `SELECT * FROM todoList WHERE id = ?`;
    return db.prepare(sql).get(id);
};

export const updateTodo = (id, title, description, date) => {
    const sql = `UPDATE todo SET title = ?, description = ?, updated_at = ? WHERE id = ?`;
    db.prepare(sql).run(title, description, date, id);
};

export const updateTodoList = (id, title, description, date) => {
    const sql = `UPDATE todoList SET title = ?, description = ?, updated_at = ? WHERE id = ?`;
    db.prepare(sql).run(title, description, date, id);
};

export  const deleteTodo = (id) => {
    const sql = `DELETE FROM todo WHERE id = ?`;
    db.prepare(sql).run(id);
};

export  const deleteTodoList = (id) => {
    const sql = `DELETE FROM todoList WHERE id = ?`;
    db.prepare(sql).run(id);
};
   


