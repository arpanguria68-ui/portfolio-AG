import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Admin from './pages/Admin';
import Login from './pages/Login';
import CaseStudy from './pages/CaseStudy';
import ErrorBoundary from './components/ErrorBoundary';
import AIChatWidget from './components/AIChatWidget';

// Wrapper component to conditionally render chat widget
const ChatWidgetWrapper = () => {
  const location = useLocation();
  // Hide chat widget on admin and login pages
  const hiddenPaths = ['/admin', '/login'];
  const shouldShow = !hiddenPaths.some(path => location.pathname.startsWith(path));

  return shouldShow ? <AIChatWidget /> : null;
};

import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

function App() {
  const logVisit = useMutation(api.analytics.logVisit);

  useEffect(() => {
    const visited = sessionStorage.getItem('visited');
    if (!visited) {
      logVisit();
      sessionStorage.setItem('visited', 'true');
    }
  }, [logVisit]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        {/* AI Chat Widget - hidden on admin/login pages */}
        <ChatWidgetWrapper />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/admin" element={
            <>
              <SignedIn>
                <Admin />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/project/:id" element={<CaseStudy />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
