import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { StudioProvider } from "@/context/StudioContext";
import { PersonaProvider } from "@/context/PersonaContext";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

export const metadata: Metadata = {
  title: "AI Studio | Influencer Image Generation",
  description: "AI-powered image and video generation studio for creating influencer content with persona consistency.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-surface-950 text-surface-100">
        <AuthProvider>
          <StudioProvider>
            <PersonaProvider>
              <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 ml-16 lg:ml-56 flex flex-col min-h-screen">
                  <TopBar />
                  <main className="flex-1">{children}</main>
                </div>
              </div>
            </PersonaProvider>
          </StudioProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
