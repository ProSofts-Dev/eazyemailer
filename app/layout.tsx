import './globals.css';
import type { Metadata } from 'next';
import { Ubuntu } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import AuthProvider from '@/components/auth-provider';
import { OnbordaProvider, Onborda } from "onborda";
import { steps } from "@/lib/steps";
import WalkthroughCard from "@/components/cards/walkthrough-card";

const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['400', '700', '500', '300'],
});

export const metadata: Metadata = {
  title: 'EazyEmailer',
  description: 'Professional Email Campaign Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={ubuntu.className}>
      <OnbordaProvider>
        <Onborda
          steps={steps}
          showOnborda
          cardComponent={WalkthroughCard}
          shadowOpacity="0.8">
            <AuthProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
              >
                {children}
                <Toaster />
              </ThemeProvider>
            </AuthProvider>
          </Onborda>
        </OnbordaProvider>
      </body>
    </html>
  );
}