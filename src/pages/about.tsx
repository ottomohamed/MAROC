# إنشاء ملف مؤقت بالمحتوى المعدل
$newContent = @'
import { useEffect } from "react";
import { Link } from "wouter";
import { ChevronLeft, Award, Users, Newspaper, Globe, Target, Eye, Mail, Twitter, Linkedin } from "lucide-react";

/* ─── SEO Hook ────────────────────────────────────────────────────────────── */
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

    // JSON-LD Organization schema
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
      "description": "جريدة إلكترونية مغربية مستقلة تهتم بالشأن المغربي والدفاع عن مقدسات البلاد ونشر الحقيقة",
      "foundingDate": "2020",
      "address": { "@type": "PostalAddress", "addressLocality": "الدار البيضاء", "addressCountry": "MA" },
      "contactPoint": { "@type": "ContactPoint", "email": "maghrib24com@gmail.com", "contactType": "customer service", "availableLanguage": "Arabic" },
      "sameAs": ["https://twitter.com/maghrib24", "https://www.facebook.com/maghrib24"]
    });
  }, [title, description, canonical]);
}

/* ─── DATA ────────────────────────────────────────────────────────────────── */
const EDITOR_IN_CHIEF = {
  name: "محمد عبد الرحمان",
  title: "المدير العام ورئيس التحرير",
  bio: "صحفي مغربي بخبرة تمتد لأكثر من 15 عاماً في المجال الإعلامي. تخرّج من معهد الدراسات والبحوث في الإعلام بالرباط، وعمل في عدد من المؤسسات الإعلامية الكبرى قبل أن يؤسس مغرب 24 عام 2020. متخصص في الصحافة السياسية والاستقصائية، وفاز بجائزة الصحافة العربية المتميزة عام 2019.",
  email: "maghrib24com@gmail.com",
  twitter: "@maghrib24redac",
  speciality: "الصحافة الاستقصائية والشأن السياسي المغربي",
};

const TEAM = [
  {
    name: "أمينة المنصوري",
    title: "مراسلة الشؤون السياسية",
    beat: "السياسة",
    bio: "محللة سياسية حاصلة على ماجستير في العلوم السياسية من جامعة محمد الخامس بالرباط. تغطي أعمال البرلمان والحكومة والأحزاب السياسية.",
    email: "maghrib24com@gmail.com",
    color: "blue",
  },
  {
    name: "يوسف العلمي",
    title: "محرر الشؤون الاقتصادية",
    beat: "الاقتصاد",
    bio: "خبير اقتصادي وصحفي متخصص في تحليل الأسواق المالية والسياسات الاقتصادية. حاصل على شهادة في الاقتصاد التطبيقي من المدرسة الوطنية للتجارة والتسيير.",
    email: "maghrib24com@gmail.com",
    color: "emerald",
  },
  {
    name: "مريم الطاهري",
    title: "مراسلة الشؤون الرياضية",
    beat: "الرياضة",
    bio: "صحفية رياضية شغوفة بكرة القدم المغربية والإنجازات الدولية للرياضيين المغاربة. تغطي المسابقات الوطنية والدولية ميدانياً.",
    email: "maghrib24com@gmail.com",
    color: "amber",
  },
  {
    name: "عمر بنجلون",
    title: "محرر الشؤون الثقافية",
    beat: "الثقافة",
    bio: "ناقد ثقافي وأديب، عمل في عدة مجلات ثقافية مغربية. متخصص في الأدب والسينما والتراث الحضاري المغربي.",
    email: "maghrib24com@gmail.com",
    color: "violet",
  },
  {
    name: "فاطمة بنعلي",
    title: "مراسلة الشؤون الاجتماعية",
    beat: "المجتمع",
    bio: "صحفية اجتماعية ذات خلفية في علم الاجتماع، تعمل على تسليط الضوء على قضايا الأسرة والمرأة والشباب والتعليم في المغرب.",
    email: "maghrib24com@gmail.com",
    color: "rose",
  },
  {
    name: "كريم الطازي",
    title: "محرر العلوم والتكنولوجيا",
    beat: "العلوم والتقنية",
    bio: "مهندس معلوميات وصحفي علمي، يترجم التطورات التقنية والعلمية إلى محتوى مفهوم للقارئ العربي. متخصص في الذكاء الاصطناعي والبيئة.",
    email: "maghrib24com@gmail.com",
    color: "cyan",
  },
  {
    name: "حسن العلوي",
    title: "ناقد الفنون والإعلام",
    beat: "الفنون",
    bio: "ناقد فني ومدير برامج ثقافية، يتابع المشهد الفني المغربي بكل تفاصيله من موسيقى وسينما ومسرح وفنون تشكيلية.",
    email: "maghrib24com@gmail.com",
    color: "pink",
  },
];

const STATS = [
  { label: "مقال منشور", value: "2,400+", icon: Newspaper },
  { label: "زائر شهرياً", value: "350,000+", icon: Users },
  { label: "سنة من الصحافة المستقلة", value: "5+", icon: Award },
  { label: "لغة تغطية", value: "2", icon: Globe },
];

const colorMap: Record<string, string> = {
  blue:    "bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/40 text-blue-700 dark:text-blue-400",
  emerald: "bg-emerald-100 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400",
  amber:   "bg-amber-100 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/40 text-amber-700 dark:text-amber-400",
  violet:  "bg-violet-100 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800/40 text-violet-700 dark:text-violet-400",
  rose:    "bg-rose-100 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/40 text-rose-700 dark:text-rose-400",
  cyan:    "bg-cyan-100 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800/40 text-cyan-700 dark:text-cyan-400",
  pink:    "bg-pink-100 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800/40 text-pink-700 dark:text-pink-400",
};

/* ═══════════════════════════════════════════════════════════════════════════
   ABOUT PAGE
═══════════════════════════════════════════════════════════════════════════ */
export default function AboutPage() {
  useSeoMeta(
    "من نحن | مغرب 24 — جريدة إلكترونية مغربية مستقلة",
    "مغرب 24 جريدة إلكترونية مغربية مستقلة تهتم بالشأن المغربي والدفاع عن مقدسات البلاد ونشر الحقيقة والمعلومة في إطار الاحترام والأمانة.",
    "https://www.maghrib24.com/about"
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8 flex-row-reverse" aria-label="breadcrumb">
          <Link href="/" className="hover:text-emerald-600 transition-colors">الرئيسية</Link>
          <ChevronLeft className="w-3 h-3" />
          <span className="text-gray-600 dark:text-gray-300">من نحن</span>
        </nav>

        {/* التعريف الرسمي للجريدة */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-6 md:p-8 mb-8 text-right">
          <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 rounded-full px-4 py-1.5 mb-4">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">تعريف الجريدة</span>
            <Newspaper className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base">
            مغرب 24 جريدة إلكترونية مغربية مستقلة، تهتم بالشأن المغربي وتعمل على <strong className="text-emerald-700 dark:text-emerald-400">الدفاع عن مقدسات البلاد</strong> 
            ونشر الحقيقة والمعلومة في إطار الاحترام والأمانة المهنية.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4 text-base">
            نرحب بمقالات القراء التي تحترم منهج البلاد السياسي ومبادئ الجريدة المنسجمة مع <strong className="text-emerald-700 dark:text-emerald-400">المبادئ العامة للمملكة</strong>، 
            في جو من الاحترام والانضباط.
          </p>
          <div className="mt-5 p-4 bg-amber-50 dark:bg-amber-900/10 border-r-4 border-amber-500 dark:border-amber-600 rounded-xl">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <strong>⚠️ تنبيه مهم:</strong> لسنا مسؤولين عن التعليقات التي يتم رفعها من القراء، لكننا نرفض أي تعليق مسيء مهما كان العذر.
            </p>
          </div>
        </div>

        {/* Hero */}
        <header className="text-right mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 rounded-full px-4 py-1.5 mb-4">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">منذ 2020</span>
            <Newspaper className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
            صوت مغربي مستقل<br />
            <span className="text-emerald-600">في قلب الحدث</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
            مغرب 24 جريدة إلكترونية مغربية مستقلة تأسست عام 2020، تلتزم بمعايير الصحافة المهنية
            في تغطية الشأن المغربي والعربي والدولي بموضوعية ونزاهة.
          </p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-5 text-center">
                <Icon className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <div className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { title: "رسالتنا", icon: Target, text: "تقديم صحافة مغربية مستقلة ومسؤولة، بعيداً عن الضغوط السياسية والتجارية، مع الالتزام بأعلى معايير الدقة والنزاهة الإعلامية." },
            { title: "رؤيتنا", icon: Eye, text: "أن نكون المرجع الإعلامي الأول للقارئ المغربي والعربي الباحث عن تغطية موضوعية وتحليل معمّق للأحداث المحلية والدولية." },
            { title: "قيمنا", icon: Award, text: "الاستقلالية التحريرية، الدقة في نقل المعلومة، الشفافية مع القارئ، التنوع في وجهات النظر، والمسؤولية الأخلاقية في الصحافة." },
          ].map(({ title, icon: Icon, text }) => (
            <div key={title} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-6 text-right">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-lg font-black text-gray-900 dark:text-white mb-3">{title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        {/* Editor in Chief - المدير العام ورئيس التحرير */}
        <section className="mb-16" itemScope itemType="https://schema.org/Person">
          <div className="flex items-center gap-3 mb-8 justify-end">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">المدير العام ورئيس التحرير</h2>
            <div className="h-px flex-1 bg-gray-200 dark:bg-zinc-800" />
          </div>

          <div className="bg-emerald-900 dark:bg-emerald-950 rounded-3xl p-8 text-right">
            <div className="flex flex-col md:flex-row-reverse items-start gap-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-2xl bg-emerald-700 flex items-center justify-center text-4xl font-black text-white">
                  {EDITOR_IN_CHIEF.name.charAt(0)}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 justify-end">
                  <h3 className="text-2xl font-black text-white" itemProp="name">{EDITOR_IN_CHIEF.name}</h3>
                  <span className="px-3 py-1 bg-emerald-700 text-emerald-100 text-xs font-bold rounded-full tracking-widest uppercase">
                    {EDITOR_IN_CHIEF.title}
                  </span>
                </div>
                <p className="text-xs text-emerald-400 mb-4 tracking-widest uppercase" itemProp="jobTitle">
                  {EDITOR_IN_CHIEF.speciality}
                </p>
                <p className="text-emerald-100 leading-relaxed text-sm mb-6" itemProp="description">
                  {EDITOR_IN_CHIEF.bio}
                </p>
                <div className="flex items-center gap-4 justify-end">
                  <a href={`https://twitter.com/${EDITOR_IN_CHIEF.twitter.replace("@", "")}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-emerald-300 hover:text-white transition-colors text-sm">
                    <span>{EDITOR_IN_CHIEF.twitter}</span>
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a href={`mailto:${EDITOR_IN_CHIEF.email}`}
                    className="flex items-center gap-2 text-emerald-300 hover:text-white transition-colors text-sm">
                    <span>{EDITOR_IN_CHIEF.email}</span>
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Editorial Team */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8 justify-end">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">فريق التحرير</h2>
            <div className="h-px flex-1 bg-gray-200 dark:bg-zinc-800" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TEAM.map((member) => (
              <article
                key={member.name}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-6 text-right hover:shadow-md transition-shadow"
                itemScope
                itemType="https://schema.org/Person"
              >
                <div className="flex items-start gap-4 flex-row-reverse">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black border flex-shrink-0 ${colorMap[member.color]}`}>
                    {member.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-black text-gray-900 dark:text-white" itemProp="name">{member.name}</h3>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1" itemProp="jobTitle">{member.title}</p>
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mb-3 ${colorMap[member.color]}`}>
                      {member.beat}
                    </span>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed" itemProp="description">{member.bio}</p>
                    <a href={`mailto:${member.email}`} className="flex items-center gap-1.5 justify-end mt-3 text-xs text-gray-400 hover:text-emerald-600 transition-colors">
                      <span>{member.email}</span>
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Our story */}
        <section className="mb-16 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-8 text-right">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">قصتنا</h2>
          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            <p>
              وُلد مغرب 24 من رحم رغبة حقيقية في تقديم صحافة مغربية تليق بعقل القارئ المغربي وتطلعاته. في عصر تتكاثر فيه المواقع الإخبارية وتتشابك مصالحها،
              أردنا أن نبني منبراً إعلامياً يضع المصداقية فوق كل اعتبار.
            </p>
            <p>
              انطلقنا عام 2020 بفريق صغير من الصحفيين المحترفين، يجمعهم شغف بالكلمة الحرة والمسؤولة.
              اليوم، يصل موقعنا إلى مئات الآلاف من القراء شهرياً من المغرب والمهجر والعالم العربي.
            </p>
            <p>
              نؤمن أن الصحافة الجيدة تصنع مجتمعاً واعياً. لذلك نعمل كل يوم على تقديم محتوى دقيق، موثّق، ومتنوع يغطي جميع اهتمامات القارئ المغربي
              من السياسة إلى الاقتصاد مروراً بالرياضة والثقافة والمجتمع.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="text-right">
          <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4">هل تريد المساهمة معنا؟</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">نرحب بمساهمات الكتّاب والصحفيين المستقلين. أرسل مقالك وسيراجعه فريق التحرير.</p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/submit" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition-colors">
              أرسل مقالك
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
              تواصل معنا
            </Link>
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-zinc-800 flex flex-wrap gap-4 justify-end text-xs text-gray-400">
          <Link href="/" className="hover:text-emerald-600 transition-colors">الرئيسية</Link>
          <Link href="/privacy" className="hover:text-emerald-600 transition-colors">سياسة الخصوصية</Link>
          <Link href="/contact" className="hover:text-emerald-600 transition-colors">تواصل معنا</Link>
          <Link href="/submit" className="hover:text-emerald-600 transition-colors">أرسل مقالك</Link>
        </div>
      </div>
    </div>
  );
}
'@

# حفظ المحتوى الجديد في الملف
$newContent | Set-Content -Path src\pages\about.tsx -Encoding UTF8