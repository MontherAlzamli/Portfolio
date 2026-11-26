'use client';

import { useState } from 'react';
import { Check, MessageCircle } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';

const WHATSAPP_NUMBER = '972595421545';

type Lang = 'en' | 'ar';

const copy = {
  en: {
    description:
      'Fixed starting ranges for the most common projects. Prices depend on scope, and every project starts with a quick chat.',
    quote: 'Get a quote',
    message: (name: string) =>
      `Hi Monther, I would like a quote for a ${name}.`,
    packages: [
      {
        id: 'landing',
        name: 'Landing page',
        price: '$150 - $300',
        time: 'About 3-5 days',
        features: [
          '1 page',
          'Responsive on every screen',
          'Arabic and English',
          'Contact form',
        ],
      },
      {
        id: 'brand',
        name: 'Brand site',
        price: '$400 - $800',
        time: 'About 1-2 weeks',
        features: ['Up to 5 pages', 'CMS-ready', 'SEO basics'],
      },
      {
        id: 'store',
        name: 'Online store',
        price: '$900 - $1,800',
        time: 'About 2-3 weeks',
        features: [
          'Next.js store',
          'Products, cart and checkout',
          'Admin dashboard',
          'Case study: Tobbet Soof',
        ],
      },
    ],
  },
  ar: {
    description:
      'أسعار بداية واضحة لأكثر المشاريع طلبًا. السعر النهائي يعتمد على حجم العمل، وكل مشروع يبدأ بحديث سريع.',
    quote: 'اطلب عرض سعر',
    message: (name: string) => `مرحبًا منذر، بدي عرض سعر لـ ${name}.`,
    packages: [
      {
        id: 'landing',
        name: 'صفحة هبوط',
        price: '$150 - $300',
        time: 'التسليم خلال 3-5 أيام تقريبًا',
        features: [
          'صفحة واحدة',
          'متجاوبة مع كل الشاشات',
          'عربي وإنجليزي',
          'نموذج تواصل',
        ],
      },
      {
        id: 'brand',
        name: 'موقع تعريفي',
        price: '$400 - $800',
        time: 'التسليم خلال 1-2 أسبوع تقريبًا',
        features: ['حتى 5 صفحات', 'جاهز لنظام إدارة المحتوى', 'أساسيات SEO'],
      },
      {
        id: 'store',
        name: 'متجر إلكتروني',
        price: '$900 - $1,800',
        time: 'التسليم خلال 2-3 أسابيع تقريبًا',
        features: [
          'متجر Next.js',
          'منتجات وسلة ودفع',
          'لوحة إدارة',
          'مثال: Tobbet Soof',
        ],
      },
    ],
  },
} as const;

export function PackagesSection() {
  const [lang, setLang] = useState<Lang>('en');
  const t = copy[lang];

  return (
    <section id="packages" className="section border-t border-line">
      <div className="wrap">
        <SectionHeading
          index="$"
          label="packages"
          title="Work with me"
          description="Websites and stores, from a single page to a full shop."
        />

        <div
          role="group"
          aria-label="Language"
          className="mb-8 flex gap-2"
          data-reveal
        >
          {(['en', 'ar'] as const).map(item => (
            <button
              key={item}
              type="button"
              lang={item}
              aria-pressed={lang === item}
              onClick={() => setLang(item)}
              className={`min-h-[2.75rem] rounded border px-4 font-mono text-sm transition-colors duration-200 ${
                lang === item
                  ? 'border-brand text-brand'
                  : 'border-line text-muted hover:text-fg'
              }`}
            >
              {item === 'en' ? 'English' : 'العربية'}
            </button>
          ))}
        </div>

        <div lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <p className="mb-8 max-w-2xl text-lg leading-relaxed text-muted">
            {t.description}
          </p>

          <ul className="grid gap-6 md:grid-cols-3">
            {t.packages.map(pkg => (
              <li key={pkg.id} className="panel flex flex-col p-6" data-reveal>
                <h3 className="font-mono text-xl font-semibold text-fg">
                  {pkg.name}
                </h3>
                <p className="mt-3 font-mono text-3xl font-semibold text-brand">
                  {pkg.price}
                </p>
                <p className="mt-1 text-sm text-muted">{pkg.time}</p>

                <ul className="mt-6 flex-1 space-y-3 text-muted">
                  {pkg.features.map(feature => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        className="mt-1 h-4 w-4 shrink-0 text-brand"
                        aria-hidden="true"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    t.message(pkg.name)
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-accent mt-8"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  {t.quote}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
