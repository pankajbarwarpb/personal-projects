import { FormEvent, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Ensure you're using react-router for navigation
import "./newManga.css";

export const AddNewManga: React.FC = () => {
  const navigate = useNavigate();
  const urlRef = useRef<HTMLInputElement>(null);
  const chapterNameRef = useRef<HTMLInputElement>(null);
  const chapterLinkRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const linkExtractType = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const url = urlRef.current?.value.trim();
    const chapterName = chapterNameRef.current?.value.trim();
    const chapterLink = chapterLinkRef.current?.value.trim();
    const title = titleRef.current?.value.trim();
    const linkExtract = linkExtractType.current?.value.trim();

    try {
      const response = await fetch("http://192.168.0.102:3080/add-new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          chapterName,
          chapterLink,
          title,
          extractType: linkExtract,
        }),
      });

      if (!response.ok) {
        toast.error("Server Unreachable");
        return;
      }

      toast.success("Manga added successfully!");
    } catch (error) {
      toast.error("Unable to save, please try again later");
      console.log("Error encountered while saving new entry: ", error);
    }
  };

  return (
    <div className="add-new">
      <span className="back-button" onClick={() => navigate("/")}>
        Back
      </span>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="new-url-id">Add Manga URL: </label>
          <input autoFocus id="new-url-id" type="url" ref={urlRef} required />
        </div>
        <div>
          <label htmlFor="chapter-name-input">
            Unique Chapter name selector:
          </label>
          <input
            type="text"
            id="chapter-name-input"
            defaultValue={"li.wp-manga-chapter a"}
            placeholder="li.wp-manga-chapter a"
            ref={chapterNameRef}
            required
          />
        </div>
        <div>
          <label htmlFor="chapter-link-input">
            Unique chapter url selector:{" "}
          </label>
          <input
            type="text"
            id="chapter-link-input"
            defaultValue={"li.wp-manga-chapter a"}
            placeholder="li.wp-manga-chapter a"
            ref={chapterLinkRef}
            required
          />
        </div>
        <div>
          <label htmlFor="link-extract-type">Link Extract type: </label>
          <input
            type="text"
            id="link-extract-type"
            defaultValue={"href"}
            placeholder="href / src"
            ref={linkExtractType}
            required
          />
        </div>
        <div>
          <label htmlFor="manga-title"> Manga Title : </label>
          <input
            type="text"
            id="manga-title"
            defaultValue={"div.post-title h1"}
            placeholder="div.post-title h1"
            ref={titleRef}
            required
          />
        </div>
        <div className="info-icon-container">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};
