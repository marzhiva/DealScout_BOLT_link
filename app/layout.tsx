import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/auth-provider';
import { Sidebar } from '@/components/sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DealScout — Instant CRE Underwriting',
  description:
    'An agent-less underwriting calculator that replaces broken Excel templates for evaluating commercial real estate in under 60 seconds.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          <Sidebar />
          <main className="md:pl-60 pt-14 md:pt-0 min-h-screen">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
