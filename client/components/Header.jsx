import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Header(props) {
  const [selectedClub, setSelectedClub] = useState("");
  const navigate = useNavigate();

  const handleSelectChange = (event) => {
    const value = event.target.value;
    if (value) {
      setSelectedClub(""); // Reset the select value
      navigate(`/clubs/${value}`); // Navigate to the selected path
    }
  };

  return (
    <div className="header">
      <h1>Sport Clubs</h1>
      <nav className="navbar">
        <Link to="/home">Home</Link>
        <Link to="/">Register</Link>

        <select value={selectedClub} onChange={handleSelectChange}>
          <option value="" disabled>
            Select a club
          </option>
          {props.categories.map((category) => {
            return (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            );
          })}
        </select>
        <Link to="/about">Profile</Link>
      </nav>
    </div>
  );
}
