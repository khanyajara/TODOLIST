const db = require('better-sqlite3')('database.db')

const createTodoListTable =() => {
    const sql = `CREATE TABLE IF NOT EXISTS todoList (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL
        )`
        db.prepare(sql).run()
    }
    const createTodoTable = () => {
        const sql = `CREATE TABLE IF NOT EXISTS todo (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            date TEXT NOT NULL,
            status TEXT NOT NULL
            )`
            db.prepare(sql).run()
            }
export    const createTodoList = (title, description, date, status) => {
    const sql = `INSERT INTO todoList (title, description, date, status) VALUES (?,
        ?, ?, ?)`
        db.prepare(sql).run(title, description, date, status)
        }
export         const getTodoList = () => {
            const sql = `SELECT * FROM todoList`
            return db.prepare(sql).all()
            }
export      const getTodo = () => {
        const sql = `SELECT * FROM todo`
            return db.prepare(sql).all()
                }
export    const getTodoById = (id) => {
        const sql = `SELECT * FROM todo WHERE id = ?`
            return db.prepare(sql).get(id)
                    }
export    const getTodoListById = (id) => {
        const sql = `SELECT * FROM todoList WHERE id = ?`
            return db.prepare(sql).get(id)
                        }
export    const updateTodo = (id, title, description, date, status) => {
        const sql = `UPDATE todo SET title = ?, description = ?, date = ?, status = ?
            WHERE id = ?`
                db.prepare(sql).run(title, description, date, status, id)
                            }
export    const updateTodoList = (id, title, description, date, status) => {
        const sql = `UPDATE todoList SET title = ?, description = ?, date = ?, status =
            ? WHERE id = ?`
                db.prepare(sql).run(title, description, date, status, id)
                                }
export    const deleteTodo = (id) => {
        const sql = `DELETE FROM todo WHERE id = ?`
            db.prepare(sql).run(id)
                                    }
export    const deleteTodoList = (id) => {
        const sql = `DELETE FROM todoList WHERE id = ?`
            db.prepare(sql).run(id)
                                        }
   

