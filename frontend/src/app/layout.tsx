// Global CSS with Tailwind
import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ClientProviders from '@/components/ClientProviders';

export const metadata: Metadata = {
  title: 'GoTuyenDung',
  description: 'Modern recruitment platform for job seekers and employers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientProviders>
      <html lang="vi">
        <body className="antialiased bg-gray-50">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </body>
      </html>
    </ClientProviders>
  );
}