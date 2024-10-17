import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [updated, setUpdated] = useState<string[]>([]);

  useEffect(() => {
    async function getUpdate() {
      try {
        const response = await fetch("http://localhost:3080/scrape");
        console.log({ response });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Chapter count:", data.chapters);

        setUpdated((pre) => [
          ...pre,
          `Total chapters: ${JSON.stringify(data.chapters)}`,
        ]);
      } catch (error) {
        console.error("Error fetching update:", { error });
        setUpdated(["Error fetching update"]);
      }
    }
    getUpdate();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div>
          <ul>
            {updated.map((data) => (
              <b>{data}</b>
            ))}
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;
