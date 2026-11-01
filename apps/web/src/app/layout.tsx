import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'پلتفرم کاردیانی | Cardiani Platform',
  description: 'پلتفرم جامع بازار و خدمات خودرویی Cardiani',
  openGraph: {
    title: 'پلتفرم کاردیانی | Cardiani',
    description: 'جامع‌ترین پلتفرم خدمات خودرویی، لوازم یدکی و آگهی‌های خودرویی',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
