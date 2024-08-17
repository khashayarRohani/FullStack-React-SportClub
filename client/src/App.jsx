import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "../components/Header";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Clubs from "../pages/Clubs";
import About from "../pages/About";
import Profile from "../pages/Profile";
import FootballClub from "../pages/FootballClub";
import BoxingClub from "../pages/BoxingClub";
import BasketballClub from "../pages/BasketballClub";
import BaseballClub from "../pages/BaseballClub";
import PostPage from "../pages/PostPage";
import PostForm from "../pages/PostForm";
export default function App() {
  const [imageSrc] = useState([
    "/images/box.webp",
    "/images/foot.jpg",
    "/images/basket.jpg",
    "/images/base.jpg",
  ]);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    getCategories();
  }, []);
  async function getCategories() {
    const response = await fetch(
      "https://fullstack-react-sportclub.onrender.com/categories"
    );

    const data = await response.json();
    console.log(data);

    setCategories(data);
  }

  return (
    <BrowserRouter>
      <header>
        <Header categories={categories} />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route
            path="/Home"
            element={<Home categories={categories} imageSrc={imageSrc} />}
          />
          <Route path="/about" element={<About />} />

          <Route path="/clubs/" element={<Clubs />}>
            <Route path="Football" element={<FootballClub />} />
            <Route path="Boxing" element={<BoxingClub />} />
            <Route path="Basketball" element={<BasketballClub />} />
            <Route path="Baseball" element={<BaseballClub />} />
          </Route>
          <Route path="/postdetail/:id" element={<PostPage />} />
          <Route path="profile/:username" element={<Profile />} />
          <Route
            path="createpostform/:sUsername"
            element={<PostForm categories={categories} />}
          />
        </Routes>
      </main>
      <footer></footer>
    </BrowserRouter>
  );
}
