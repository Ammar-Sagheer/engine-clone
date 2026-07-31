import Link from "next/link";
import NewsletterForm from "@/_components/NewsletterForm";

const SUPPORT_LINKS = [
  { label: "Track Order", href: "/track-order" },
  { label: "Cart", href: "/cart" },
  { label: "Shipping & Delivery", href: "/pages/shipping" },
  { label: "Return Policy", href: "/pages/returns" },
  { label: "Ordering Guide", href: "/pages/ordering-guide" },
  { label: "Terms of Service", href: "/pages/terms" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/pages/about" },
  { label: "Store Locator", href: "/pages/stores" },
  { label: "Privacy Policy", href: "/pages/privacy" },
  { label: "Careers", href: "/pages/careers" },
  { label: "Payment Methods", href: "/pages/payments" },
  { label: "Customer Service", href: "/pages/customer-service" },
  { label: "Blog", href: "/blogs/news" },
];

const SHOP_LINKS = [
  { label: "New In", href: "/collections/new-in" },
  { label: "Men", href: "/collections/men" },
  { label: "Women", href: "/collections/women" },
  { label: "Boys", href: "/collections/boys" },
  { label: "Girls", href: "/collections/girls" },
];

const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://facebook.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
  { label: "YouTube", href: "https://youtube.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
];

function LinkColumn({ heading, links }) {
  return (
    <div>
      <h3 className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-5">
        {heading}
      </h3>
      <ul className="space-y-3 text-[13px] text-muted">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="hover:text-foreground transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="container-page py-16 grid grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
        <LinkColumn heading="Shop" links={SHOP_LINKS} />
        <LinkColumn heading="Support" links={SUPPORT_LINKS} />
        <LinkColumn heading="Company" links={COMPANY_LINKS} />

        <div className="col-span-2">
          <h3 className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-5">
            Newsletter
          </h3>
          <p className="text-[13px] text-muted mb-4 max-w-sm leading-relaxed">
            Sign up for new arrivals, sale previews and style updates.
          </p>
          <NewsletterForm />
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-6 text-[12px] text-muted">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xl font-bold tracking-[0.32em] pl-[0.32em]">
            ENGINE
          </span>
          <p className="text-[11px] text-muted text-center sm:text-right">
            © {new Date().getFullYear()} Engine Clone — demo project, not
            affiliated with the original brand.
          </p>
        </div>
      </div>
    </footer>
  );
}
