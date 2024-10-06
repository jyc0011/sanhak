import "./globals.css";
import NavigationBar from "@/components/Navbar";
export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <html lang="ko">
      <head>
      </head>
      <body>
      <nav>
          <NavigationBar />
      </nav>
      {children}
      </body>
      </html>
  );
}