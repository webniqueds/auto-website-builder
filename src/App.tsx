import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import TemplatePreview from './pages/TemplatePreview';
import Configure from './pages/Configure';
import Generate from './pages/Generate';
import Preview from './pages/Preview';
import PreviewSandbox from './pages/PreviewSandbox';
import Projects from './pages/Projects';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Admin from './pages/Admin';
import { syncPlansFromServer } from './lib/plans';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

function AppRoutes() {
  const location = useLocation();
  const isSandbox = location.pathname.startsWith('/preview-sandbox');
  // Full-bleed builder/preview surfaces manage their own scrolling chrome.
  const isImmersive =
    isSandbox ||
    location.pathname.startsWith('/configure/') ||
    location.pathname.startsWith('/generate/') ||
    location.pathname.startsWith('/preview/');

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
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      {!isImmersive && <Footer />}
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