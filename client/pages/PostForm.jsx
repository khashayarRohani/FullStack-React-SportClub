import { useState } from "react";

export default function PostForm(props) {
  const [selectedClub, setSelectedClub] = useState(""); // Initialize with an empty string
  const [formData, setFormData] = useState({
    username: "",
    title: "",
    content: "",
    content_picture_url: "",
  });

  const handleSelectChange = (event) => {
    setSelectedClub(event.target.value); // Update the state with the selected value
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value }); // Update form data state
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        console.log("Original file size:", file.size);
        const resizedImage = await resizeImage(file);
        console.log("Resized image base64 size:", resizedImage.length);
        setFormData({ ...formData, content_picture_url: resizedImage });
      } catch (error) {
        console.error("Error processing image:", error);
      }
    }
  };

  const resizeImage = (file) => {
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
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Get user ID based on the username
    const response = await fetch("http://localhost:3000/getuserbyusername", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: formData.username }), // Use formData.username
    });

    const userResponse = await response.json();

    if (userResponse.exists) {
      const userId = userResponse.id;
      const categoryId = selectedClub;

      // Submit the post data
      const postResponse = await fetch("http://localhost:3000/createpost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          category_id: categoryId,
          title: formData.title,
          content: formData.content,
          content_picture_url: formData.content_picture_url,
        }),
      });

      const postResult = await postResponse.json();
      console.log("Post created successfully:", postResult);
      // Handle post creation success (e.g., reset form, show message)
    } else {
      console.log("User does not exist");
      // Handle user not found (e.g., show error message)
    }
  };

  return (
    <>
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
          value={formData.username} // Bind form data to input value
          onChange={handleChange} // Update form data on change
        />

        <label htmlFor="title">Post Title:</label>
        <input
          name="title"
          placeholder="title"
          title="Enter title"
          required
          value={formData.title} // Bind form data to input value
          onChange={handleChange} // Update form data on change
        />

        <label htmlFor="content">Content:</label>
        <input
          name="content"
          placeholder="content"
          title="Enter content"
          required
          value={formData.content} // Bind form data to input value
          onChange={handleChange} // Update form data on change
        />

        <label htmlFor="category">Category:</label>
        <select value={selectedClub} onChange={handleSelectChange}>
          <option value="" disabled>
            Select a club
          </option>
          {props.categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <label htmlFor="content_picture_url">Content Image:</label>
        <input
          type="file"
          name="content_picture_url"
          placeholder="Content Image"
          title="Upload content image"
          accept="image/*"
          onChange={handleImageChange}
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
