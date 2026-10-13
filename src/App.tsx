import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
import Header from './components/Header';
import Landing from './pages/Landing';
import TemplatePreview from './pages/TemplatePreview';
import Configure from './pages/Configure';
import Generate from './pages/Generate';
import Preview from './pages/Preview';
import PreviewSandbox from './pages/PreviewSandbox';
import Projects from './pages/Projects';
import Pricing from './pages/Pricing';
import Admin from './pages/Admin';
import { syncPlansFromServer } from './lib/plans';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

function AppRoutes() {
  const location = useLocation();
  const isSandbox = location.pathname.startsWith('/preview-sandbox');

  useEffect(() => {
    void syncPlansFromServer();
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!isSandbox && <Header />}
      <main style={{ flex: 1, paddingTop: isSandbox ? 0 : 72 }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/template/:templateId" element={<TemplatePreview />} />
          <Route path="/configure/:templateId" element={<Configure />} />
          <Route path="/generate/:templateId" element={<Generate />} />
          <Route path="/preview/:projectId" element={<Preview />} />
          <Route path="/preview-sandbox/:projectId" element={<PreviewSandbox />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  if (!CLERK_PUBLISHABLE_KEY) {
    return (
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    );
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;