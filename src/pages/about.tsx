import { useEffect } from "react";
import { Link } from "wouter";
import { ChevronLeft, Award, Users, Newspaper, Globe, Target, Eye, Mail, Twitter, Linkedin } from "lucide-react";

/*  SEO Hook  */
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
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setLink("canonical", canonical);

    const schemaId = "org-schema";
    let script = document.getElementById(schemaId) as HTMLScriptElement;
    if (!script) { script = document.createElement("script"); script.id = schemaId; script.type = "application/ld+json"; document.head.appendChild(script); }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "NewsMediaOrganization",
      "name": "مغرب 24",
      "alternateName": "Maghrib 24",
      "url": "https://www.maghrib24.com",
      "logo": "https://www.maghrib24.com/favicon.svg",
      "description": "جريدة إلكترونية مغربية مستقلة تهتم بالشأن المغربي والدفاع عن مقدسات البلاد",
      "foundingDate": "2020",
      "address": { "@type": "PostalAddress", "addressLocality": "الدار البيضاء", "addressCountry": "MA" },
      "contactPoint": { "@type": "ContactPoint", "email": "maghrib24com@gmail.com", "contactType": "customer service", "availableLanguage": "Arabic" }
    });
  }, [title, description, canonical]);
}

const EDITOR_IN_CHIEF = {
  name: "محمد عبد الرحمان",
  title: "المدير العام ورئيس التحرير",
  bio: "صحفي مغربي بخبرة تمتد لأكثر من 15 عاماً في المجال الإعلامي. تخرّج من معهد الدراسات والبحوث في الإعلام بالرباط، وعمل في عدد من المؤسسات الإعلامية الكبرى قبل أن يؤسس مغرب 24 عام 2020.",
  email: "maghrib24com@gmail.com",
  speciality: "الصحافة الاستقصائية والشأن السياسي المغربي"
};

const TEAM = [
  { name: "أمينة المنصوري", title: "مراسلة الشؤون السياسية", beat: "السياسة", bio: "محللة سياسية حاصلة على ماجستير في العلوم السياسية.", email: "maghrib24com@gmail.com", color: "blue" },
  { name: "يوسف العلمي", title: "محرر الشؤون الاقتصادية", beat: "الاقتصاد", bio: "خبير اقتصادي متخصص في تحليل الأسواق المالية.", email: "maghrib24com@gmail.com", color: "emerald" },
  { name: "مريم الطاهري", title: "مراسلة الشؤون الرياضية", beat: "الرياضة", bio: "صحفية رياضية تغطي المسابقات الوطنية والدولية.", email: "maghrib24com@gmail.com", color: "amber" }
];

const STATS = [
  { label: "مقال منشور", value: "2,400+", icon: Newspaper },
  { label: "زائر شهرياً", value: "350,000+", icon: Users },
  { label: "سنة من الصحافة المستقلة", value: "5+", icon: Award },
  { label: "لغة تغطية", value: "2", icon: Globe }
];

const colorMap: Record<string, string> = {
  blue: "bg-blue-100 dark:bg-blue-900/20 text-blue-700",
  emerald: "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700",
  amber: "bg-amber-100 dark:bg-amber-900/20 text-amber-700"
};

export default function AboutPage() {
  useSeoMeta("من نحن | مغرب 24", "جريدة إلكترونية مغربية مستقلة", "https://www.maghrib24.com/about");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8 flex-row-reverse">
          <Link href="/" className="hover:text-emerald-600">الرئيسية</Link>
          <ChevronLeft className="w-3 h-3" />
          <span className="text-gray-600">من نحن</span>
        </nav>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 md:p-8 mb-8 text-right">
          <div className="inline-flex items-center gap-2 bg-emerald-50 rounded-full px-4 py-1.5 mb-4">
            <span className="text-xs font-bold text-emerald-700">تعريف الجريدة</span>
            <Newspaper className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            مغرب 24 جريدة إلكترونية مغربية مستقلة، تهتم بالشأن المغربي وتعمل على <strong className="text-emerald-700">الدفاع عن مقدسات البلاد</strong> 
            ونشر الحقيقة والمعلومة في إطار الاحترام والأمانة المهنية.
          </p>
          <div className="mt-5 p-4 bg-amber-50 border-r-4 border-amber-500 rounded-xl">
            <p className="text-sm text-amber-800">
              <strong>تنبيه مهم:</strong> لسنا مسؤولين عن التعليقات التي يتم رفعها من القراء، لكننا نرفض أي تعليق مسيء.
            </p>
          </div>
        </div>

        <header className="text-right mb-16">
          <h1 className="text-4xl md:text-5xl font-black mb-6">صوت مغربي مستقل<br /><span className="text-emerald-600">في قلب الحدث</span></h1>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white dark:bg-zinc-900 rounded-2xl border p-5 text-center">
                <Icon className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <div className="text-2xl font-black">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-black mb-8 text-right">المدير العام ورئيس التحرير</h2>
          <div className="bg-emerald-900 rounded-3xl p-8 text-right">
            <h3 className="text-2xl font-black text-white mb-2">{EDITOR_IN_CHIEF.name}</h3>
            <p className="text-emerald-100 leading-relaxed text-sm mb-4">{EDITOR_IN_CHIEF.bio}</p>
            <a href={`mailto:${EDITOR_IN_CHIEF.email}`} className="text-emerald-300 hover:text-white">
              {EDITOR_IN_CHIEF.email}
            </a>
          </div>
        </section>

        <div className="mt-10 pt-6 border-t flex flex-wrap gap-4 justify-end text-xs text-gray-400">
          <Link href="/">الرئيسية</Link>
          <Link href="/privacy">سياسة الخصوصية</Link>
          <Link href="/contact">تواصل معنا</Link>
          <Link href="/submit">أرسل مقالك</Link>
        </div>
      </div>
    </div>
  );
}
