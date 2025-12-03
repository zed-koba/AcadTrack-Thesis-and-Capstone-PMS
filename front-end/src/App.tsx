import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Students from "./components/Instructor/Students";
import Registration from "./components/Registration";
import FirstLogin from "./components/Student/firstLogin";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Registration" element={<Registration />} />

          {/* Instructor/Admin Panel */}
          <Route path="/Instructor/Students" element={<Students />} />

          {/* Student Panel */}
          <Route path="/Student/FirstLogin" element={<FirstLogin />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
