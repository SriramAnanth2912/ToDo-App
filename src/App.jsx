import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./Authenticate.jsx";
import LoginSignUp from "./components/LoginSignUp.jsx";
import TodoList from "./components/Todo.jsx";

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LoginSignUp />} />
            <Route path="/todo" element={<TodoList />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
