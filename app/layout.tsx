
import type { Metadata } from "next";
import Providers from "./providers";
import ThemeWrapper from "@/components/ThemeWrapper";
import './globals.css';      // Tailwind and other global styles
import '@/styles/Loader.css'
export const metadata: Metadata = {
  title: "AI Chat App",
  description: "Role based AI Chat Application",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    // <html lang="en">
    //   <body>
    //     <Providers>{children}</Providers>
    //   </body>
    // </html>
    <html lang="en">
      <body>
      <Providers>
        <ThemeWrapper>
          {children}
        </ThemeWrapper>
      </Providers>
    </body>
    </html>
  );
}
