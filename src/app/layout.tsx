import "@rainbow-me/rainbowkit/styles.css";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "SuperRaise",
  description: "Where Innovation Meets Support",
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: './Superraise.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: './Superraise.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: './Superraise.png',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-[#101212] to-[#08201D] min-h-screen">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
