import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

db.query(`
    -- Create the tables

    CREATE TABLE IF NOT EXISTS Users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        profile_picture_url TEXT,
        bio TEXT
    );

    CREATE TABLE IF NOT EXISTS Categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        description TEXT
    );

    CREATE TABLE IF NOT EXISTS UserCategories (
        user_id INT REFERENCES Users(id) ON DELETE CASCADE,
        category_id INT REFERENCES Categories(id) ON DELETE CASCADE,
        PRIMARY KEY (user_id, category_id)
    );

    CREATE TABLE IF NOT EXISTS Posts (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES Users(id) ON DELETE CASCADE,
        category_id INT REFERENCES Categories(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        content_picture_url VARCHAR(255),
        like_count INT DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS Comments (
        id SERIAL PRIMARY KEY,
        post_id INT REFERENCES Posts(id) ON DELETE CASCADE,
        user_id INT REFERENCES Users(id) ON DELETE CASCADE,
        content TEXT NOT NULL
    );
    -- Insert initial data
    INSERT INTO Users (username, profile_picture_url, bio) VALUES
    ('Alice', 'alice_pic.jpg', 'Boxing enthusiast'),
    ('Bob', 'bob_pic.jpg', 'Football fan'),
    ('Carol', 'carol_pic.jpg', 'Basketball player'),
    ('Dave', 'dave_pic.jpg', 'Baseball coach');

    INSERT INTO Categories (name, description) VALUES
    ('Boxing', 'All about boxing'),
    ('Football', 'All about football'),
    ('Basketball', 'All about basketball'),
    ('Baseball', 'All about baseball');

    INSERT INTO UserCategories (user_id, category_id) VALUES
    (1, 1), -- Alice in Boxing
    (2, 2), -- Bob in Football
    (3, 3), -- Carol in Basketball
    (4, 4); -- Dave in Baseball

    
    INSERT INTO Posts (user_id, category_id, title, content, content_picture_url, like_count) VALUES
    (1, 1, 'Best Boxing Techniques', 'Here are some of the best techniques used in boxing...', 'boxing_techniques.jpg', 10),
    (2, 2, 'Top 10 Football Skills', 'Learn the top 10 football skills that every player should master.', 'football_skills.jpg', 15);

    
    INSERT INTO Comments (post_id, user_id, content) VALUES
    (1, 2, 'Great tips! I found this very useful.'),
    (2, 1, 'Very informative! Thanks for sharing.');
`);
