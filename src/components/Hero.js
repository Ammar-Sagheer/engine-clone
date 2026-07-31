import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-neutral-900 text-white">
      <div className="container-page py-20 md:py-32 flex flex-col items-start gap-4">
        <span className="text-xs tracking-[0.3em] uppercase text-neutral-300">
          Season Sale
        </span>
        <h1 className="text-3xl md:text-5xl font-bold max-w-xl leading-tight">
          Fresh styles for the whole family
        </h1>
        <p className="text-neutral-300 max-w-md">
          Shop the latest arrivals across Men, Women, Boys and Girls.
        </p>
        <Link
          href="/collections/new-in"
          className="mt-4 bg-white text-black px-6 py-3 text-sm font-semibold tracking-wide"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}
