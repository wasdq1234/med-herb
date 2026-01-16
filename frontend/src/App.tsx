import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* TODO: 라우트 추가 */}
        {/* <Route path="/diagnosis" element={<DiagnosisPage />} /> */}
        {/* <Route path="/results" element={<ResultsPage />} /> */}
        {/* <Route path="/admin/*" element={<AdminLayout />} /> */}
      </Routes>
    </div>
  );
}

function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-heading-xl text-primary-500 mb-4">한방진단</h1>
      <p className="text-body-lg text-neutral-600 mb-8 text-center max-w-md">
        증상을 입력하고 나에게 맞는 한의학 치료법과 약재를 찾아보세요.
      </p>
      <button className="px-8 py-4 bg-primary-500 text-white rounded-lg text-body-lg font-semibold hover:bg-primary-600 transition-colors shadow-md">
        진단 시작하기
      </button>
    </main>
  );
}

export default App;
