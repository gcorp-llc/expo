import Link from 'next/link';
import { faTranslations } from '@cardiani/i18n';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col justify-between p-6 max-w-5xl mx-auto">
      <header className="flex items-center justify-between py-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
            C
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{faTranslations.common.platformName}</h1>
            <p className="text-xs text-slate-500">Cardiani Ecosystem</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            داشبورد مدیریت
          </Link>
        </div>
      </header>

      <section className="my-16 text-center space-y-6">
        <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
          نسخه وب Next.js 15
        </span>
        <h2 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
          خرید، فروش و خدمات خودرویی آنلاین
        </h2>
        <p className="max-w-2xl mx-auto text-base text-slate-600">
          به اکوسیستم یکپارچه کاردیانی خوش آمدید. هماهنگی کامل وب‌اپلیکیشن و اپلیکیشن موبایل با API مرکزی کاردیانی.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 text-sm font-medium text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition shadow-sm"
          >
            ورود به داشبورد
          </Link>
          <a
            href="https://cardiani.gcorp.cc"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition"
          >
            دانلود اپ موبایل (APK/IPA)
          </a>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 text-lg mb-2">بازار لوازم یدکی و خودرو</h3>
          <p className="text-sm text-slate-600">جستجو، مقایسه و خرید انواع محصولات خودرویی با تایید اصالت کالا.</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 text-lg mb-2">پرداخت امن Stripe</h3>
          <p className="text-sm text-slate-600">پشتیبانی از کارت‌های بین‌المللی و کیف پول با رمزنگاری سرتاسری.</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 text-lg mb-2">همگام‌سازی بلادرنگ</h3>
          <p className="text-sm text-slate-600">سفارش‌ها و چت‌های کاربران همزمان در وب و اپلیکیشن موبایل در دسترس است.</p>
        </div>
      </div>

      <footer className="py-6 border-t border-slate-200 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Cardiani Platform (GCORP LLC). تمامی حقوق محفوظ است.
      </footer>
    </main>
  );
}
