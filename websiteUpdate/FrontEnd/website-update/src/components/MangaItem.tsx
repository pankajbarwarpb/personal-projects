import { useState } from "react";
import { DropDownInput } from "./DropDownInput";
import { Manga } from "./type";
import { toast } from "react-toastify";

export const MangaItem: React.FC<Manga> = ({
  title,
  chapters,
  readTill,
  _id,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(readTill);

  console.log({ title, chapters, readTill, _id });

  const handleReadCurrentChapter = (index: number) => {
    console.log({ index, title: chapters[index].title });
    setSelectedIndex(index);
  };

  const redirectToCurrentChapter = () => {
    window.open(chapters[selectedIndex].link, "_blank"); // Opens in a new tab
  };

  const updateLastRead = async () => {
    const response = await fetch("http://localhost:3080/update-last-read", {
      method: "PUT", // Set the method to PUT
      headers: {
        "Content-Type": "application/json", // Set the correct header for JSON
      },
      body: JSON.stringify({
        // Stringify the body
        id: _id,
        readTill: selectedIndex,
      }),
    });

    if (!response.ok) {
      console.error("Failed to update last read");
    }

    toast.success("Updated Successfully");
  };

  return (
    <div className="manga-item">
      <span className="title">{title}</span>
      <div className="manga-spec">
        <span>Total Chapters : {chapters.length}</span>
        <DropDownInput
          options={chapters.map((chapter) => chapter.title)}
          index={selectedIndex}
          onSelect={handleReadCurrentChapter}
        />
        <button onClick={redirectToCurrentChapter}>Read Now</button>
        <button onClick={updateLastRead}>Update Last Read Now</button>{" "}
      </div>
    </div>
  );
};
