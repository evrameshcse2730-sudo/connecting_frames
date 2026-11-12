import "./Cursor.css";

// Custom cursor dot, trailing ring and portfolio hover label.
// Movement is driven from pages/Home/HomeView.jsx.
export default function Cursor({ dotRef, ringRef, labelRef }) {
  return (
    <>
      <div className="cursor-dot" ref={dotRef}></div>
      <div className="cursor-ring" ref={ringRef}></div>
      <div className="portfolio-cursor-label" ref={labelRef}></div>
    </>
  );
}
