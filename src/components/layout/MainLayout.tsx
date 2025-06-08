
import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Header />
      <main className="flex-1 pt-20 w-full">
        <div className="min-h-[calc(100vh-5rem)] w-full">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
