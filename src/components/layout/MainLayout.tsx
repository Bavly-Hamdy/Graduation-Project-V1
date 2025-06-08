
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
      <main className="flex-1 pt-24">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
