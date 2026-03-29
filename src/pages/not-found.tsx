import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center text-center">
      <div>
        <h1 className="text-6xl font-black text-gray-900 dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">الصفحة غير موجودة</h2>
        <p className="text-gray-500 mb-8">عذراً، الصفحة التي تبحث عنها غير موجودة</p>
        <Link href="/" className="inline-block bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold">
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
