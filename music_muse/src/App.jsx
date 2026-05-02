import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
// import Charts from "./pages/Charts";
import PlaylistDetail from "./pages/PlaylistDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/charts" element={<Charts />} /> */}
      <Route path="/playlist/:id" element={<PlaylistDetail />} />
    </Routes>
  );
}

export default App;