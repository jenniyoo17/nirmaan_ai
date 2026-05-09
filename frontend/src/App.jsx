import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AdminDashboard from './pages/AdminDashboard';
import RegisterProject from './pages/RegisterProject';
import AIAnalysis from './pages/AIAnalysis';
import Alerts from './pages/Alerts';
import ModelTesting from './pages/ModelTesting';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/admin" replace />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="register" element={<RegisterProject />} />
          <Route path="testing" element={<ModelTesting />} />
          <Route path="analysis/:id" element={<AIAnalysis />} />
          <Route path="alerts" element={<Alerts />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
