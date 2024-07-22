CREATE TABLE "todo_items"
(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    completed BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    user_id INTEGER,
    priority INTEGER NOT NULL DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO "todo_items" (title, description, completed, created_at, updated_at, user_id, priority)
VALUES ('Buy milk', 'Buy 2 liters of milk', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 2),

UPDATE "todo_items"
SET title = "buy bread"
WHERE title = "Buy milk"

DELETE FROM "todo_items"
WHERE user_id = "1"
 
 SELECT title FROM "todo_items"

 DROP TABLE "todo_items"
