"use client";

export default function NewsletterForm() {
  return (
    <form className="flex gap-2 mb-6" onSubmit={(e) => e.preventDefault()}>
      <input
        type="email"
        placeholder="Enter your email"
        className="flex-1 border border-black/20 px-3 py-2 text-sm"
      />
      <button className="bg-black text-white px-4 py-2 text-sm">
        Subscribe
      </button>
    </form>
  );
}
