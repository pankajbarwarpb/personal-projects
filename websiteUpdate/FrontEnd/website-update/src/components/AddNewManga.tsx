// AddNewManga.tsx
import { FormEvent, useRef } from "react";
import { toast } from "react-toastify";

export const AddNewManga: React.FC = () => {
  const urlRef = useRef<HTMLInputElement>(null);
  const searchForRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const url = urlRef.current?.value.trim();
    const searchFor = searchForRef.current?.value.trim();
    const title = titleRef.current?.value.trim();

    try {
      const response = await fetch("http://localhost:3080/add-new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, searchFor, title }),
      });

      if (!response.ok) {
        toast.error("Server Unreachable");
        return;
      }

      toast.success("Manga added successfully!"); // Add success toast
    } catch (error) {
      toast.error("Unable to save, please try again later");
      console.log("Error encountered while saving new entry: ", error);
    }
  };

  return (
    <div className="add-new">
      <form onSubmit={handleSubmit}>
        <label htmlFor="new-url-id">Add URL: </label>
        <input
          autoFocus
          id="new-url-id"
          type="url" // Set input type to URL
          ref={urlRef}
          required // Make it required if necessary
        />
        <input
          type="text"
          defaultValue={"li.wp-manga-chapter a"}
          placeholder="Search Selector for Chapters"
          ref={searchForRef}
          required // Make it required if necessary
        />
        <input
          type="text"
          defaultValue={"div.post-title h1"}
          placeholder="Search Selector for Title"
          ref={titleRef}
          required // Make it required if necessary
        />
        <div className="info-icon-container">
          <button type="submit">Submit</button>
          <div className="info-display">
            <span>
              For example <b>li.wp-manga-chapter a</b>
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};
