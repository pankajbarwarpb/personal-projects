// App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { MangaList } from "./components/MangaList";
import { AddNewManga } from "./components/AddNewManga";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Make sure to import styles

const App: React.FC = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<MangaList />} />
          <Route path="/add-new" element={<AddNewManga />} />
        </Routes>
      </Router>
      <ToastContainer autoClose={2000} />
    </>
  );
};

export default App;
