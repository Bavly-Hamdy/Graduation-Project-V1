
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { I18nProvider } from '@/contexts/I18nContext';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import About from '@/pages/About';
import Chatbot from '@/pages/Chatbot';
import Contact from '@/pages/Contact';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import NotFound from '@/pages/NotFound';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <I18nProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </Router>
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
