import "./App.css";
import LoginPage from "./features/auth/LoginPage";
import IndexPage from "./features/home/IndexPage";
import AdminPage from "./features/admin/AdminPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
