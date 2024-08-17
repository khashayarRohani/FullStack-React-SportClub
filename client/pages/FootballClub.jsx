import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../src/posts.css";
export default function FootballClub() {
  const [footballPosts, setFootballPosts] = useState([
    {
      id: 0,
      user_id: 0,
      category_id: 0,
      title: "",
      content: "",
      content_picture_url: "",
      like_count: 0,
      username: "",
      profile_picture_url: "",
    },
  ]);
  async function getFootballPosts() {
    const response = await fetch(
      "https://fullstack-react-sportclub.onrender.com/footballposts"
    );

    const footPosts = await response.json();
    console.log(" here in football club :");
    console.log(footPosts);
    setFootballPosts(footPosts);
  }

  useEffect(() => {
    getFootballPosts();
  }, []);
  async function handleLike(postId) {
    const response = await fetch(
      `https://fullstack-react-sportclub.onrender.com/like/${postId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();

      // Update local state
      setFootballPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, like_count: data.like_count } : post
        )
      );
    } else {
      console.error("Failed to update like count");
    }
    getFootballPosts();
  }
  async function handleDelete(postId) {
    const response = await fetch(
      `https://fullstack-react-sportclub.onrender.com/deletepost/?id=${postId}`,
      {
        method: "Delete",
      }
    );

    getFootballPosts();
  }

  return (
    <div className="body">
      <div className="containerr">
        {footballPosts.map((post) => {
          return (
            <div key={post.id} className="Card">
              <div className="card__header">
                <img
                  src={post.content_picture_url}
                  alt="card__image"
                  className="card__image imgs"
                  width="600"
                />
              </div>
              <div className="card__body">
                <span className="tag tag-blue">{post.title}</span>
                <h4>likes: {post.like_count}</h4>
                <button className="but" onClick={() => handleLike(post.id)}>
                  Like
                </button>
                <button className="but" onClick={() => handleDelete(post.id)}>
                  Delete
                </button>
                <p>{post.content}</p>
              </div>
              <div className="card__footer">
                <div className="user">
                  <img
                    src={post.profile_picture_url}
                    alt="user__image"
                    className="user__images imgUser"
                  />
                  <div className="user__info">
                    <h5>{post.username}</h5>
                    <small>2h ago</small>
                  </div>
                </div>
                <Link to={`/postdetail/${post.id}`}>Details</Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
