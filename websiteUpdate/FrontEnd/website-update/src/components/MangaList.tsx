import { useEffect, useState } from "react";
import { Manga } from "./type";
import { MangaItem } from "./MangaItem";
import { useNavigate } from "react-router-dom";
import "./mangaListComponents.css";

export const MangaList: React.FC = () => {
  const [list, setList] = useState<Manga[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function getList() {
      try {
        const response = await fetch("http://192.168.0.102:3080/list");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Chapter count:", data.mangas);

        const mangas: Manga[] = JSON.parse(data.mangas);

        console.log({ mangas });

        setList([...mangas]);
      } catch (error) {
        console.error("Error fetching update:", { error });
      }
    }
    getList();
  }, []);

  console.log({ state: list });

  return (
    <div className="manga-list">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Manga List</h1>
        <button
          onClick={() => {
            navigate("/add-new");
          }}
          style={{ height: "20px" }}
        >
          + Add New
        </button>
      </div>
      <ul>
        {list.map((manga, index) => (
          <li key={index}>
            <MangaItem
              chapters={manga.chapters}
              readTill={manga.readTill}
              title={manga.title}
              _id={manga._id}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
