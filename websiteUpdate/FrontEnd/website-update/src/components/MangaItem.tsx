import { useState } from "react";
import { DropDownInput } from "./DropDownInput";
import { Manga } from "./type";
import { toast } from "react-toastify";
import DeleteIcon from "../icons/deleteIcon.svg";

export const MangaItem: React.FC<Manga> = ({
  title,
  chapters,
  readTill,
  _id,
}) => {
  const initialIndex = readTill === 0 ? chapters.length - 1 : readTill;
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  const handleReadCurrentChapter = (index: number) => {
    setSelectedIndex(index);
  };

  const redirectToCurrentChapter = () => {
    window.open(chapters[selectedIndex].link, "_blank");
  };

  const updateLastRead = async () => {
    const response = await fetch("http://192.168.0.102:3080/update-last-read", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: _id,
        readTill: selectedIndex,
      }),
    });

    if (!response.ok) {
      console.error("Failed to update last read");
    }

    toast.success("Updated Successfully");
  };

  const deleteManga = async () => {
    const response = await fetch(`http://192.168.0.102:3080/delete/${_id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      toast.success("Manga deleted successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      console.error("Failed to delete manga");
      toast.error("Failed to delete manga");
    }
  };

  return (
    <div className="manga-item">
      <img src={DeleteIcon} alt="delete_icon" className="delete-button" />
      <span className="title">{title}</span>
      <div className="manga-spec">
        <div>
          <div className="total-chapters">
            Total Chapters: {chapters.length}
          </div>
          <div className="read-till">
            Read till: {chapters[selectedIndex]?.title}
          </div>
        </div>
        <DropDownInput
          options={chapters.map((chapter) => chapter.title)}
          index={selectedIndex}
          onSelect={handleReadCurrentChapter}
        />
        <button onClick={redirectToCurrentChapter}>Read Now</button>
        <button onClick={updateLastRead}>Update Last Read</button>
      </div>
    </div>
  );
};
