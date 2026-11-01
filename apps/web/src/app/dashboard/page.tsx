import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-l border-slate-200 p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              C
            </div>
            <span className="font-bold text-slate-800 text-lg">داشبورد کاردیانی</span>
          </div>

          <nav className="space-y-2">
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium text-sm">
              <span>خلاصه وضعیت</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 text-sm">
              <span>سفارش‌ها</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 text-sm">
              <span>محصولات</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 text-sm">
              <span>تراکنش‌های مالی</span>
            </a>
          </nav>
        </div>

        <div>
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-800">
            ← بازگشت به صفحه اصلی
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">پنل مدیریت کلاینت و تراکنش‌ها</h1>
          <p className="text-sm text-slate-500 mt-1">مدیریت هماهنگ با سرویس‌گیرنده موبایل Cardiani</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500">سفارش‌های فعال</p>
            <h4 className="text-2xl font-bold text-slate-900 mt-2">۲۴</h4>
            <span className="text-xs text-emerald-600 mt-1 inline-block">↑ ۸٪ نسبت به هفته گذشته</span>
          </div>
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500">درآمد ماه جاری</p>
            <h4 className="text-2xl font-bold text-slate-900 mt-2">۳۸,۴۰۰,۰۰۰ تومان</h4>
            <span className="text-xs text-emerald-600 mt-1 inline-block">↑ ۱۲٪ رشد</span>
          </div>
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500">کاربران اپ موبایل</p>
            <h4 className="text-2xl font-bold text-slate-900 mt-2">۱,۴۵۰</h4>
            <span className="text-xs text-blue-600 mt-1 inline-block">Android & iOS</span>
          </div>
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500">وضعیت اتصال API</p>
            <h4 className="text-base font-semibold text-emerald-600 mt-2">آنلاین (Connected)</h4>
            <span className="text-xs text-slate-400 mt-1 inline-block">Mock / Gateway</span>
          </div>
        </div>

        {/* Info panel */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">تنظیمات اتصال به سرور مرکزی</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            این پنل بر بستر Next.js 15 توسعه یافته و از پکیج مشترک <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">@cardiani/shared</code> برای اعتبارسنجی Zod و مدیریت کلاینت استفاده می‌کند. احراز هویت با کوکی‌های امن httpOnly مدیریت می‌شود.
          </p>
        </div>
      </main>
    </div>
  );
}
