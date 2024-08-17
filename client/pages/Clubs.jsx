import { Outlet, useParams } from "react-router-dom";

export default function Clubs() {
  const { clubsName } = useParams();
  console.log(clubsName);

  return (
    <div className="clubMarg">
      <p>Selected Club: {clubsName}</p>

      <Outlet />
    </div>
  );
}
