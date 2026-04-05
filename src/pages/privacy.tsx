import { useEffect } from "react";
import { Link } from "wouter";
import { Shield, Eye, Lock, Database, Mail, Phone, MapPin, ChevronLeft } from "lucide-react";

/* ─── SEO Head ────────────────────────────────────────────────────────────── */
function useSeoMeta(title: string, description: string, canonical: string) {
  useEffect(() => {
    document.title = title;
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.content = content;
    };
    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!el) { el = document.createElement("link"); el.rel = rel; document.head.appendChild(el); }
      el.href = href;
    };
    setMeta("description", description);
    setMeta("robots", "index, follow");
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:type", "website", true);
    setMeta("og:url", canonical, true);
    setMeta("og:locale", "ar_MA", true);
    setMeta("og:site_name", "مغرب 24", true);
    setMeta("twitter:card", "summary");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setLink("canonical", canonical);
  }, [title, description, canonical]);
}

/* ─── Section component ───────────────────────────────────────────────────── */
function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-4 justify-end">
        <h2 className="text-xl font-black text-gray-900 dark:text-white">{title}</h2>
        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
        </div>
      </div>
      <div className="text-gray-600 dark:text-gray-400 leading-relaxed space-y-3 text-sm">
        {children}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PRIVACY PAGE
═══════════════════════════════════════════════════════════════════════════ */
export default function PrivacyPage() {
  useSeoMeta(
    "سياسة الخصوصية | مغرب 24 — جريدة إلكترونية مغربية مستقلة",
    "سياسة خصوصية مغرب 24: كيف نجمع بياناتك ونحميها ونستخدمها. نحن ملتزمون بحماية خصوصية زوارنا ومستخدمينا وفق أعلى المعايير.",
    "https://www.maghrib24.com/privacy"
  );

  const lastUpdated = "1 أبريل 2025";
  const contactEmail = "privacy@maghrib24.com";
  const siteUrl = "https://www.maghrib24.com";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8 flex-row-reverse" aria-label="breadcrumb">
          <Link href="/" className="hover:text-emerald-600 transition-colors">الرئيسية</Link>
          <ChevronLeft className="w-3 h-3" />
          <span className="text-gray-600 dark:text-gray-300">سياسة الخصوصية</span>
        </nav>

        {/* Header */}
        <header className="text-right mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 rounded-full px-4 py-1.5 mb-4">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">وثيقة قانونية</span>
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">سياسة الخصوصية</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            آخر تحديث: <time dateTime="2025-04-01">{lastUpdated}</time>
            {" — "}
            تسري على جميع خدمات موقع{" "}
            <a href={siteUrl} className="text-emerald-600 hover:underline">مغرب 24</a>
          </p>
          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl text-sm text-amber-800 dark:text-amber-300 text-right">
            <strong>ملاحظة مهمة:</strong> باستخدامك لموقع مغرب 24، فإنك توافق على بنود سياسة الخصوصية هذه. يُرجى قراءتها بعناية.
          </div>
        </header>

        {/* Content */}
        <article className="text-right" itemScope itemType="https://schema.org/WebPage">

          {/* Intro */}
          <div className="mb-10 p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            <p>
              يلتزم موقع <strong className="text-gray-900 dark:text-white">مغرب 24</strong> ({siteUrl})، الجريدة الإلكترونية المغربية المستقلة،
              بحماية خصوصيتك وصون بياناتك الشخصية. تصف هذه الوثيقة بدقة أنواع المعلومات التي نجمعها،
              وكيفية استخدامها وتخزينها وحمايتها، وحقوقك فيما يتعلق بها.
            </p>
          </div>

          <Section title="المعلومات التي نجمعها" icon={Database}>
            <p><strong className="text-gray-800 dark:text-gray-200">أ. المعلومات التي تقدمها مباشرة:</strong></p>
            <ul className="list-disc list-inside space-y-1 mr-4">
              <li>الاسم وعنوان البريد الإلكتروني عند إرسال مقال أو تعليق</li>
              <li>معلومات التواصل التي تشاركها طواعية عبر نماذج الموقع</li>
              <li>محتوى رسائلك ومساهماتك التحريرية</li>
            </ul>
            <p className="mt-3"><strong className="text-gray-800 dark:text-gray-200">ب. المعلومات التي نجمعها تلقائياً:</strong></p>
            <ul className="list-disc list-inside space-y-1 mr-4">
              <li>عنوان IP وبيانات المتصفح ونظام التشغيل</li>
              <li>الصفحات التي تزورها ومدة الزيارة ومسار التنقل</li>
              <li>بيانات الأداء عبر أدوات التحليل (Google Analytics)</li>
              <li>ملفات تعريف الارتباط (Cookies) — راجع قسم الكوكيز أدناه</li>
            </ul>
            <p className="mt-3"><strong className="text-gray-800 dark:text-gray-200">ج. ما لا نجمعه أبداً:</strong></p>
            <ul className="list-disc list-inside space-y-1 mr-4">
              <li>بيانات بطاقات الائتمان أو المعاملات المالية</li>
              <li>كلمات المرور أو البيانات الحساسة بشكل مباشر</li>
              <li>بيانات القاصرين دون موافقة ولي الأمر</li>
            </ul>
          </Section>

          <Section title="كيف نستخدم معلوماتك" icon={Eye}>
            <p>نستخدم البيانات التي نجمعها للأغراض التالية حصراً:</p>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li><strong className="text-gray-800 dark:text-gray-200">تشغيل الخدمة:</strong> نشر المقالات، معالجة مساهمات القراء، الرد على استفساراتكم</li>
              <li><strong className="text-gray-800 dark:text-gray-200">تحسين المحتوى:</strong> تحليل أنماط القراءة لتطوير جودة التغطية الإخبارية</li>
              <li><strong className="text-gray-800 dark:text-gray-200">الأمان والحماية:</strong> الكشف عن الاستخدام غير المشروع ومنع الاحتيال</li>
              <li><strong className="text-gray-800 dark:text-gray-200">التواصل:</strong> إرسال الإشعارات المتعلقة بمساهماتك عند الضرورة</li>
              <li><strong className="text-gray-800 dark:text-gray-200">الإعلانات:</strong> عرض إعلانات ملائمة غير مُخصّصة بشكل مفرط</li>
            </ul>
            <p className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border-r-4 border-emerald-500">
              <strong>التزامنا:</strong> لا نبيع بياناتك الشخصية إلى أي طرف ثالث، ولا نشاركها لأغراض تجارية خارج نطاق تشغيل الموقع.
            </p>
          </Section>

          <Section title="ملفات تعريف الارتباط (Cookies)" icon={Lock}>
            <p>يستخدم موقعنا ملفات الكوكيز للأغراض التالية:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse mt-2">
                <thead>
                  <tr className="bg-gray-100 dark:bg-zinc-800">
                    <th className="p-2 border border-gray-200 dark:border-zinc-700 text-right font-bold">نوع الكوكي</th>
                    <th className="p-2 border border-gray-200 dark:border-zinc-700 text-right font-bold">الغرض</th>
                    <th className="p-2 border border-gray-200 dark:border-zinc-700 text-right font-bold">مدة الاحتفاظ</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["ضرورية", "تشغيل الموقع وحفظ إعدادات اللغة والمظهر", "الجلسة"],
                    ["تحليلية (Google Analytics)", "قياس الزيارات وتحليل سلوك القراءة", "26 شهراً"],
                    ["إعلانية", "عرض إعلانات ذات صلة عبر شبكات إعلانية", "13 شهراً"],
                  ].map(([type, purpose, duration]) => (
                    <tr key={type} className="odd:bg-white even:bg-gray-50 dark:odd:bg-zinc-900 dark:even:bg-zinc-800/50">
                      <td className="p-2 border border-gray-200 dark:border-zinc-700">{type}</td>
                      <td className="p-2 border border-gray-200 dark:border-zinc-700">{purpose}</td>
                      <td className="p-2 border border-gray-200 dark:border-zinc-700">{duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3">يمكنك إدارة الكوكيز أو تعطيلها من إعدادات متصفحك في أي وقت، غير أن ذلك قد يؤثر على تجربة استخدام الموقع.</p>
          </Section>

          <Section title="حماية البيانات والأمان" icon={Shield}>
            <p>نتخذ إجراءات تقنية وتنظيمية صارمة لحماية بياناتك:</p>
            <ul className="list-disc list-inside space-y-1 mr-4">
              <li>تشفير الاتصالات عبر بروتوكول HTTPS/TLS</li>
              <li>تحديد صلاحيات الوصول للموظفين المخوّلين فقط</li>
              <li>مراجعة دورية لأنظمة الحماية والبنية التحتية</li>
              <li>عدم تخزين كلمات المرور بصيغة نصية صريحة</li>
              <li>النسخ الاحتياطي المنتظم وأنظمة التعافي من الكوارث</li>
            </ul>
            <p className="mt-3">في حال تعرّض البيانات لاختراق، سنبادر إلى إخطار المتأثرين خلال 72 ساعة وفق ما يقتضيه القانون.</p>
          </Section>

          <Section title="حقوقك فيما يتعلق ببياناتك" icon={Eye}>
            <p>وفقاً لمبادئ حماية البيانات المعمول بها، يحق لك:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {[
                { right: "حق الاطلاع", desc: "الحصول على نسخة من بياناتك المحفوظة لدينا" },
                { right: "حق التصحيح", desc: "طلب تصحيح أي معلومات غير دقيقة" },
                { right: "حق الحذف", desc: "طلب حذف بياناتك ('الحق في النسيان')" },
                { right: "حق الاعتراض", desc: "الاعتراض على معالجة بياناتك لأغراض بعينها" },
                { right: "حق النقل", desc: "استلام بياناتك بصيغة قابلة للقراءة الآلية" },
                { right: "سحب الموافقة", desc: "سحب موافقتك في أي وقت دون تأثير رجعي" },
              ].map(({ right, desc }) => (
                <div key={right} className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800">
                  <div className="font-bold text-emerald-700 dark:text-emerald-400 mb-1 text-xs">{right}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{desc}</div>
                </div>
              ))}
            </div>
            <p className="mt-4">لممارسة أي من هذه الحقوق، تواصل معنا عبر: <a href={`mailto:${contactEmail}`} className="text-emerald-600 hover:underline font-medium">{contactEmail}</a></p>
          </Section>

          <Section title="الروابط الخارجية ومواقع الأطراف الثالثة" icon={Lock}>
            <p>قد يحتوي موقعنا على روابط لمواقع خارجية. لا نتحمل أي مسؤولية عن ممارسات الخصوصية في تلك المواقع ونوصيك بمراجعة سياسات الخصوصية الخاصة بكل موقع.</p>
            <p>نستخدم الخدمات التالية التي لها سياسات خصوصية مستقلة:</p>
            <ul className="list-disc list-inside space-y-1 mr-4 mt-2">
              <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Google Analytics</a> — تحليل الزيارات</li>
              <li>شبكات الإعلانات المرخّصة — عرض الإعلانات</li>
              <li>منصات التواصل الاجتماعي المرتبطة بمقالاتنا</li>
            </ul>
          </Section>

          <Section title="خصوصية الأطفال" icon={Shield}>
            <p>
              موقع مغرب 24 موجّه للبالغين ولا يستهدف القاصرين دون سن 16 عاماً. إذا علمنا أننا جمعنا معلومات عن طفل دون موافقة ولي أمره،
              سنحذفها فوراً. إذا كنت ولياً لأمر طفل ولاحظت ذلك، يُرجى التواصل معنا على الفور.
            </p>
          </Section>

          <Section title="التعديلات على هذه السياسة" icon={Eye}>
            <p>
              قد نُحدّث سياسة الخصوصية هذه دورياً لتعكس التغييرات في ممارساتنا أو المتطلبات القانونية.
              سنُخطرك بأي تغييرات جوهرية عبر إشعار بارز على الموقع أو بريد إلكتروني إذا توفرت لدينا عنوانك.
              يُشير تاريخ "آخر تحديث" أعلاه إلى موعد آخر مراجعة.
              استمرار استخدامك للموقع بعد نشر التغييرات يُعدّ قبولاً لها.
            </p>
          </Section>

          {/* Contact Box */}
          <div className="mt-12 p-6 bg-emerald-900 dark:bg-emerald-950 rounded-2xl text-right">
            <h2 className="text-lg font-black text-white mb-2">للتواصل بشأن الخصوصية</h2>
            <p className="text-emerald-200 text-sm mb-4">إذا كان لديك أي استفسار حول سياسة الخصوصية أو بياناتك الشخصية:</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3 justify-end text-emerald-100">
                <span>privacy@maghrib24.com</span>
                <Mail className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-center gap-3 justify-end text-emerald-100">
                <span>الدار البيضاء، المغرب</span>
                <MapPin className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-center gap-3 justify-end text-emerald-100">
                <span>مدة الرد: خلال 5 أيام عمل</span>
                <Shield className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>

        </article>

        {/* Footer links */}
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-zinc-800 flex flex-wrap gap-4 justify-end text-xs text-gray-400">
          <Link href="/" className="hover:text-emerald-600 transition-colors">الرئيسية</Link>
          <Link href="/about" className="hover:text-emerald-600 transition-colors">من نحن</Link>
          <Link href="/contact" className="hover:text-emerald-600 transition-colors">تواصل معنا</Link>
          <Link href="/submit" className="hover:text-emerald-600 transition-colors">أرسل مقالك</Link>
        </div>
      </div>
    </div>
  );
}
