import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CafeFlow — Restaurant operations, simplified',
  description: 'A modern workspace for cafe and restaurant operations.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
