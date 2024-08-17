import { Link } from "react-router-dom";

export default function Home(props) {
  return (
    <div className="container">
      {props.categories.map((category) => {
        return (
          <Link to={`/clubs/${category.name}`} key={category.id}>
            <figure>
              <img
                className="iimg"
                src={props.imageSrc[category.id - 1]}
                alt={`Image of ${category.name}`}
                title={category.name}
              />
              <figcaption>
                {`${category.name} Club: ${category.description}`}
              </figcaption>
            </figure>
          </Link>
        );
      })}
    </div>
  );
}
