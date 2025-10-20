import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navigation from "./components/Navigation";
import Chatbot from "./components/Chatbot";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import "./App.css";

function App() {
  const navigate = useNavigate();

  const handleAgentNavigate = (url) => {
    navigate(url);
  };

  return (
    <div style={styles.app}>
      <Navigation />
      <main style={styles.main}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Chatbot />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          // style: {
          //   background: "#363636",
          //   color: "#fff",
          // },
          // success: {
          //   duration: 4000,
          //   iconTheme: {
          //     primary: "#4ade80",
          //     secondary: "#fff",
          //   },
          // },
        }}
      />
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    color: "#2c3e50",
    width: "100%",
  },
  main: {
    minHeight: "calc(100vh - 80px)",
    backgroundColor: "#f8f9fa",
    width: "100%",
  },
};

export default App;
