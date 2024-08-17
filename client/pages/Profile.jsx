import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../src/profile.css";

export default function Profile() {
  const { username } = useParams();
  const [userProfile, setUserProfile] = useState({
    id: 0,
    username: "",
    profile_picture_url: "",
    bio: "",
  });
  const [userPosts, setUserPosts] = useState([
    {
      id: 0,
      user_id: 0,
      category_id: 0,
      title: "",
      content: "",
      content_picture_url: "",
      like_count: 0,
    },
  ]);

  async function getUser() {
    const response = await fetch(`http://localhost:3000/user/${username}`);
    const user = await response.json();
    console.log("profile:");
    console.log(user);
    setUserProfile(user);
  }
  async function getUserPosts() {
    const response = await fetch(
      `http://localhost:3000/userposts/${userProfile.id}`
    );
    const userPosts = await response.json();
    console.log("userPosts:");
    console.log(userPosts);
    setUserPosts(userPosts);
  }

  useEffect(() => {
    getUser();
    getUserPosts();
  }, []);
  return (
    <div className="CContainer">
      <div className="card">
        <img
          src={userProfile.profile_picture_url}
          alt="Person"
          className="card__images"
        />
        <p className="card__name">{userProfile.username}</p>
        <p className="card__name">{userProfile.bio}</p>
        <div className="grid-container">
          <div className="grid-child-posts">Posts:{userPosts.length}</div>

          <div className="grid-child-followers">
            <div className="grid-child-posts">Likes</div>
          </div>
        </div>
        <ul className="social-icons">
          <li>
            <Link to="/">
              <i className="fa fa-instagram"></i>
            </Link>
          </li>
          <li>
            <Link to="/Home">
              <i className="fa fa-twitter"></i>
            </Link>
          </li>
          <li>
            <a href="#">
              <i className="fa fa-linkedin"></i>
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fa fa-codepen"></i>
            </a>
          </li>
        </ul>
        <button className="btn draw-border">
          {" "}
          <Link to="/createpostform">Create Posts</Link>
        </button>
        <button className="btn draw-border">
          {" "}
          <Link>Comments</Link>
        </button>
      </div>
    </div>
  );
}
