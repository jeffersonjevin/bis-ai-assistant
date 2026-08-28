import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import BackgroundWrapper from '../common/BackgroundWrapper';
import PageTransition from '../common/PageTransition';

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAssistant = pathname === '/assistant';

  return (
    <BackgroundWrapper>
      <div className={`relative z-10 flex flex-col ${isAssistant ? 'h-screen' : 'min-h-screen'}`}>
        <Navbar />
        <main className="flex-1 min-h-0">
          <PageTransition>{children}</PageTransition>
        </main>
        {!isAssistant && <Footer />}
      </div>
    </BackgroundWrapper>
  );
}
