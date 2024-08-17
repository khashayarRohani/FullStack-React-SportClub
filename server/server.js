import express from "express";
import pg from "pg";
import dotenv from "dotenv";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();
const db = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const Port = 3000;
app.get("/", (req, res) => res.json("API is called"));

app.get("/categories", async (req, res) => {
  const categoriesData = await db.query(`SELECT * FROM categories`);
  res.json(categoriesData.rows);
});
app.get("/user/:username", async (req, res) => {
  const { username } = req.params;
  const result = await db.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);
  res.json(result.rows[0]);
});
app.post("/user", async (req, res) => {
  console.log(req.body);
  const { username, profile_picture_url, bio } = req.body;

  await db.query(
    `INSERT INTO users ( username, profile_picture_url, bio ) VALUES($1,$2,$3)`,
    [username, profile_picture_url, bio]
  );
  res.json({ message: "successfull" });
});

app.get("/userposts/:user_id", async (req, res) => {
  const { user_id } = req.params;
  console.log(user_id);
  let userIdNumber = parseInt(user_id, 10);

  console.log(userIdNumber);
  const response = await db.query(`SELECT * FROM posts WHERE user_id = $1`, [
    userIdNumber,
  ]);
  res.json(response.rows);
});

app.get("/footballposts", async (req, res) => {
  const footballId = 2;
  const data = await db.query(
    `SELECT posts.*, users.username ,users.profile_picture_url FROM posts JOIN users ON posts.user_id = users.id where posts.category_id =$1 ORDER By posts.id`,
    [footballId]
  );
  res.json(data.rows);
});
app.get("/boxposts", async (req, res) => {
  const footballId = 1;
  const data = await db.query(
    `SELECT posts.*, users.username ,users.profile_picture_url FROM posts JOIN users ON posts.user_id = users.id where posts.category_id =$1 ORDER By posts.id`,
    [footballId]
  );
  res.json(data.rows);
});
app.get("/basketballposts", async (req, res) => {
  const footballId = 3;
  const data = await db.query(
    `SELECT posts.*, users.username ,users.profile_picture_url FROM posts JOIN users ON posts.user_id = users.id where posts.category_id =$1 ORDER By posts.id`,
    [footballId]
  );
  res.json(data.rows);
});
app.get("/baseballposts", async (req, res) => {
  const footballId = 4;
  const data = await db.query(
    `SELECT posts.*, users.username ,users.profile_picture_url FROM posts JOIN users ON posts.user_id = users.id where posts.category_id =$1 ORDER By posts.id`,
    [footballId]
  );
  res.json(data.rows);
});
app.get("/postdetailscomments/:id", async (req, res) => {
  const { id } = req.params;
  const postIdNumber = parseInt(id, 10);
  const data = await db.query(
    `SELECT 
    posts.id,
    posts.title,
    posts.content,
    posts.content_picture_url,
    posts.like_count,
    post_creator.username AS post_creator_username,
    post_creator.profile_picture_url AS post_creator_profile_picture_url,
    ARRAY_AGG(CONCAT(commenters.username, ': ', comments.content)) AS comments
FROM 
    posts
JOIN 
    users AS post_creator ON posts.user_id = post_creator.id
LEFT JOIN 
    comments ON posts.id = comments.post_id
LEFT JOIN 
    users AS commenters ON comments.user_id = commenters.id
WHERE 
    posts.id = $1
GROUP BY 
    posts.id, posts.title, posts.content, posts.content_picture_url, posts.like_count, post_creator.username, post_creator.profile_picture_url

`,
    [postIdNumber]
  );
  const postDetail = data.rows[0];
  res.json(postDetail);
});

app.post("/getuserbyusername", async (req, res) => {
  // Extract username from request body
  const { username } = req.body;

  if (!username) {
    //because it sometime send null so i handle it by this to prevent crashing of the app
    return res.json({ exists: false, id: null });
  }

  // Query to get the user ID if the username exists
  const result = await db.query("SELECT id FROM users WHERE username = $1", [
    username,
  ]);

  // Determine if the user exists based on the query result
  const userExists = result.rows.length > 0;
  const userId = userExists ? result.rows[0].id : null;

  // Return boolean and user ID
  res.json({ exists: userExists, id: userId });
});

app.post("/comment", async (req, res) => {
  const { post_id, user_id, content } = req.body;
  await db.query(
    `INSERT INTO Comments (post_id, user_id, content) VALUES($1,$2,$3)`,
    [post_id, user_id, content]
  );

  res.json("success");
});

// Endpoint to increment like count
app.put("/like/:id", async (req, res) => {
  const postId = parseInt(req.params.id, 10);

  // Increment like count in the database because this way is faster and also easier
  const result = await db.query(
    "UPDATE posts SET like_count = like_count + 1 WHERE id = $1 RETURNING like_count",
    [postId]
  );

  // Return the updated like count
  res.json(result.rows[0].like_count);
});
app.post("/createpost", async (req, res) => {
  const { user_id, category_id, title, content, content_picture_url } =
    req.body;

  const query = `
    INSERT INTO posts (user_id, category_id, title, content, content_picture_url, like_count)
    VALUES ($1, $2, $3, $4, $5, 0) RETURNING *;
  `;

  const values = [user_id, category_id, title, content, content_picture_url]; // just testing different ways to send parameters

  const result = await db.query(query, values);
  res.json(result.rows[0]);
});

app.listen(Port, () => console.log(`you are listining to ${Port}`));
