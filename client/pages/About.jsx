import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function About() {
  const [userName, setUsername] = useState({ username: "" });
  const navigate = useNavigate();
  async function handleAboutChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    setUsername({ ...userName, [name]: value });
  }
  async function handleProfileSubmit(event) {
    event.preventDefault();
    const response = await fetch(
      "https://fullstack-react-sportclub.onrender.com/getuserbyusername",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userName),
      }
    );

    const isUser = await response.json();

    console.log("in about user check");

    console.log(userName);

    console.log(isUser);
    if (isUser.exists) {
      navigate(`/profile/${userName.username}`);
    } else {
      alert("User Does not exist , Register First");
      setUsername({ ...userName, username: "" });
    }
  }
  return (
    <>
      <form className="registerForm" onSubmit={handleProfileSubmit}>
        <label htmlFor="username">enter your username</label>
        <input
          name="username"
          placeholder="username(Case Sensitive)"
          title="Enter a UserName"
          onChange={handleAboutChange}
          value={userName.username}
        />
        <button className="button">Check me</button>
      </form>
    </>
  );
}
