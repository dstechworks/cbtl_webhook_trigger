import './globals.css';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'], // adjust as needed
});

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Secure Admin Dashboard with Next.js & Tailwind CSS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} bg-gray-50 text-gray-900 min-h-screen flex flex-col`}>
        <main className="flex-1 container mx-auto">{children}</main>
      </body>
    </html>
  );
}
