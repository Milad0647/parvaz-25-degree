import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "پرواز ۲۵ درجه",
  description: "مسیر روشنایی از ۲۵ درجه می‌گذرد — بازی آموزشی مصرف برق",
  metadataBase: new URL("https://parvaz-25-degree.vercel.app"),
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "پرواز ۲۵ درجه",
    description: "مسیر روشنایی از ۲۵ درجه می‌گذرد — بازی آموزشی مصرف برق",
    type: "website",
    locale: "fa_IR",
    images: ["/icon.svg"],
  },
  twitter: {
    card: "summary",
    title: "پرواز ۲۵ درجه",
    description: "بازی کمپینی مصرف برق — از شکاف ۲۵° عبور کن",
    images: ["/icon.svg"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "پرواز ۲۵ درجه",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0b1a3a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link
          href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
