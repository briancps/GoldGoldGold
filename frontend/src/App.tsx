import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';

function App() {
  return (
    // BrowserRouter: wraps the whole app to enable URL-based navigation
    <BrowserRouter>
      {/* Routes: looks at current URL and renders the matching Route */}
      <Routes>
        {/* when URL is "/", show the LoginPage component */}
        <Route path="/" element={<LoginPage />} />
        {/* when URL is "/main", show the MainPage component */}
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; // export App so that main.tsx (the entry point) can import and use it