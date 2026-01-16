import { Routes, Route, useNavigate } from 'react-router-dom';
import AdminLoginPage from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import SymptomsPage from './pages/admin/Symptoms';
import QuestionsPage from './pages/admin/Questions';
import SyndromesPage from './pages/admin/Syndromes';
import HerbsPage from './pages/admin/Herbs';
import DiagnosisPage from './pages/Diagnosis';
import ResultPage from './pages/Result';
import TreatmentPage from './pages/Treatment';

function App() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* 진단 라우트 */}
        <Route path="/diagnosis" element={<DiagnosisPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/treatment" element={<TreatmentPage />} />
        {/* 관리자 라우트 */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/symptoms" element={<SymptomsPage />} />
        <Route path="/admin/questions" element={<QuestionsPage />} />
        <Route path="/admin/syndromes" element={<SyndromesPage />} />
        <Route path="/admin/herbs" element={<HerbsPage />} />
      </Routes>
    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-heading-xl text-primary-500 mb-4">한방진단</h1>
      <p className="text-body-lg text-neutral-600 mb-8 text-center max-w-md">
        증상을 입력하고 나에게 맞는 한의학 치료법과 약재를 찾아보세요.
      </p>
      <button
        onClick={() => navigate('/diagnosis')}
        className="px-8 py-4 bg-primary-500 text-white rounded-lg text-body-lg font-semibold hover:bg-primary-600 transition-colors shadow-md"
      >
        진단 시작하기
      </button>
    </main>
  );
}

export default App;
