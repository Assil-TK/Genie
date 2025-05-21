import React from "react";
import { useNavigate } from "react-router-dom";

function PageTwo() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Page Two</h1>
      <button
        className="btn btn-primary" // Bootstrap button class
        onClick={() => navigate("/")}
      >
        Go to Page One
      </button>
    </div>
  );
}

export default PageTwo;
