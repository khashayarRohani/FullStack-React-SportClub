import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../src/posts.css";
import "../src/comments.css";

export default function PostPage() {
  const { id } = useParams();
  let i = 0;
  const [isShowCheckUser, setIsShowCheckUser] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [userComment, setUserComment] = useState({
    post_id: 0,
    user_id: 0,
    content: "",
  });
  const [username, setUsername] = useState("");
  const [commenter, setCommenter] = useState({ exists: false, id: 0 });

  const [postsdetails, setPostDetails] = useState({
    id: "",
    title: "",
    content: "",
    content_picture_url: "",
    like_count: 0,
    post_creator_username: "",
    post_creator_profile_picture_url: "",
    comments: [],
  });
  const handleComment = () => {
    if (isShowCheckUser == false) {
      setIsShowCheckUser(true);
    } else {
      setIsShowCheckUser(false);
    }
  };
  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    setUserComment({ ...userComment, [name]: value });
  }
  async function handleSubmit(event) {
    event.preventDefault();

    console.log(userComment);
    const response = await fetch("http://localhost:3000/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userComment),
    });

    const data = await response.json();
    setIsRegister(false);
    getPostComments();
  }
  async function handleUserCheckChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    setUsername({ ...username, [name]: value });
  }
  async function handleCheckSubmit(event) {
    event.preventDefault();
    const response = await fetch("http://localhost:3000/getuserbyusername", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(username),
    });

    const isUser = await response.json();

    console.log("in handle user check");
    console.log(isUser);

    setIsRegister(isUser.exists);
    setCommenter({ exists: isUser.exists, id: isUser.id });

    setUserComment({
      ...userComment,
      user_id: isUser.id,
      post_id: postsdetails.id,
    });

    setIsShowCheckUser(false);
  }

  async function getPostComments() {
    const response = await fetch(
      `http://localhost:3000/postdetailscomments/${id}`
    );
    const data = await response.json();
    console.log("in postoagedetail");
    console.log(data);
    setPostDetails(data);
  }
  useEffect(() => {
    getPostComments();
  }, []);
  return (
    <div>
      <div className="body">
        <div className="containerr">
          <div className="Card">
            <div className="card__header">
              <img
                src={postsdetails.content_picture_url}
                alt="card__image"
                className="card__image imgs"
                width="600"
              />
            </div>
            <div className="card__body">
              <span className="tag tag-blue">{postsdetails.title}</span>
              <h4>likes: {postsdetails.like_count}</h4>
              <p>{postsdetails.content}</p>
            </div>
            <div className="card__footer">
              <div className="user">
                <img
                  src={postsdetails.post_creator_profile_picture_url}
                  alt="user__image"
                  className="user__images imgUser"
                />
                <div className="user__info">
                  <h5>{postsdetails.post_creator_username}</h5>
                  <small>2h ago</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="list">
        <h1> Comments</h1>
        <ul>
          {postsdetails.comments.map((comment) => {
            return (
              <li key={i++}>
                <p>{comment}</p>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <button className="button buttonPosition" onClick={handleComment}>
          Add a Comment
        </button>

        {isShowCheckUser && (
          <form className="registerFormm" onSubmit={handleCheckSubmit}>
            <label htmlFor="username">enter your username</label>
            <input
              name="username"
              placeholder="username(Case Sensitive)"
              title="Enter a UserName"
              onChange={handleUserCheckChange}
            />
            <button className="button">Check me</button>
          </form>
        )}
        {isRegister == true && (
          <form className="registerFormm" onSubmit={handleSubmit}>
            <label htmlFor="content">Leave a Comment</label>
            <textarea
              name="content"
              placeholder="Write your comments here"
              title="Leave comment"
              onChange={handleChange}
            ></textarea>
            <input type="hidden" name="user_id" value={commenter.id} />
            <input type="hidden" name="post_id" value={postsdetails.id} />
            <button className="button">submit comment</button>
          </form>
        )}
      </div>
    </div>
  );
}
