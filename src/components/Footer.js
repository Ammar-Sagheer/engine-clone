import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";

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

const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://facebook.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
  { label: "YouTube", href: "https://youtube.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-black/10 bg-neutral-50">
      <div className="container-page py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-semibold mb-4 text-sm tracking-wide">Support</h3>
          <ul className="space-y-2 text-sm text-neutral-600">
            {SUPPORT_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-black">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4 text-sm tracking-wide">Company</h3>
          <ul className="space-y-2 text-sm text-neutral-600">
            {COMPANY_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-black">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2">
          <h3 className="font-semibold mb-4 text-sm tracking-wide">
            Stay in the loop
          </h3>
          <NewsletterForm />
          <div className="flex gap-4 text-sm text-neutral-600">
            {SOCIAL_LINKS.map((s) => (
              <a key={s.href} href={s.href} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-black/10 py-4 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} Engine Clone — demo project, not affiliated
        with the original brand.
      </div>
    </footer>
  );
}
