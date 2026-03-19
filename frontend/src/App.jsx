import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import DocumentLibrary from './pages/DocumentLibrary';
import DocumentViewer from './pages/DocumentViewer';
import StudyTools from './pages/StudyTools';
import Flashcards from './pages/Flashcards';
import QuizzesPage from './pages/Quizzes';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/documents" element={<DocumentLibrary />} />
            <Route path="/documents/:id" element={<DocumentViewer />} />
            <Route path="/study" element={<StudyTools />} />
            <Route path="/study/flashcards" element={<Flashcards />} />
            <Route path="/study/quizzes" element={<QuizzesPage />} />
            {/* Add more protected routes here later */}
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
