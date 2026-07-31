import Link from "next/link";

export default function Hero({ image }) {
  return (
    <section className="relative bg-[#111] text-white overflow-hidden">
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-top opacity-55"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />

      <div className="container-page relative py-24 md:py-40">
        <div className="max-w-lg">
          <p className="text-[11px] tracking-[0.28em] uppercase text-white/70">
            Summer 26
          </p>
          <h1 className="mt-4 text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight">
            Season Sale
          </h1>
          <p className="mt-5 text-white/75 text-base md:text-lg leading-relaxed">
            Up to 50% off across Men, Women, Boys and Girls.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/collections/new-in" className="btn btn-invert">
              Shop New In
            </Link>
            <Link href="/collections/men" className="btn btn-outline">
              Shop Sale
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
