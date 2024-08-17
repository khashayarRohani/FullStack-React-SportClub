import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../src/register.css";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    profile_picture_url: "",
    bio: "",
  });
  const [formDef, setFormDef] = useState({
    username: "",
    profile_picture_url: "",
    bio: "",
  });
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    setForm({ ...form, [name]: value });
  }

  async function handleImageChange(event) {
    const file = event.target.files[0];
    if (file) {
      try {
        console.log("Original file size:", file.size);
        const resizedImage = await resizeImage(file);
        console.log("Resized image base64 size:", resizedImage.length);
        setForm({ ...form, profile_picture_url: resizedImage });
      } catch (error) {
        console.error("Error processing image:", error);
      }
    }
  }

  function resizeImage(file) {
    return new Promise((resolve, reject) => {
      const img = document.createElement("img");
      const reader = new FileReader();

      reader.onload = (event) => {
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          try {
            const base64Url = canvas.toDataURL("image/jpeg", 0.7); // Adjust quality parameter
            resolve(base64Url);
          } catch (error) {
            reject(new Error("Failed to convert canvas to base64"));
          }
        };
        img.onerror = (error) => {
          reject(new Error("Image loading error: " + error.message));
        };
      };

      reader.onerror = (error) => {
        reject(new Error("FileReader error: " + error.message));
      };

      reader.readAsDataURL(file);
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    console.log("Form data before submit:", form);

    try {
      const response = await fetch(
        "https://fullstack-react-sportclub.onrender.com/user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const result = await response.json();
      console.log(result.message);
      setForm({ ...formDef });
      fileInputRef.current.value = null; // Clear the file input
      navigate(`/profile/${form.username}`);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  return (
    <>
      <h1>Register</h1>

      <form className="registerForm" onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          minLength={2}
          maxLength={10}
          name="username"
          placeholder="username"
          title="Enter Username"
          required
          value={form.username}
          onChange={handleChange}
        />

        <label htmlFor="bio">Bio:</label>
        <textarea
          name="bio"
          placeholder="bio"
          title="Enter bio"
          required
          value={form.bio}
          onChange={handleChange}
        ></textarea>

        <label htmlFor="profile_picture_url">Profile Image:</label>
        <input
          type="file"
          name="profile_picture_url"
          placeholder="profile Image"
          title="Enter profile picture"
          accept="image/*"
          required
          onChange={handleImageChange}
          ref={fileInputRef}
        />

        <div className="wrap">
          <button className="buttonn" type="submit">
            Submit
          </button>
        </div>
      </form>
    </>
  );
}
