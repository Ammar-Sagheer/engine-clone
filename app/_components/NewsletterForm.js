"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <p className="text-[13px] border border-line px-4 py-3 max-w-sm">
        Thanks — you&apos;re on the list.
      </p>
    );
  }

  return (
    <form
      className="flex max-w-sm"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <input
        type="email"
        required
        placeholder="Email address"
        aria-label="Email address"
        className="flex-1 min-w-0 border border-line border-r-0 px-4 py-3 text-[13px] outline-none focus:border-foreground transition-colors"
      />
      <button
        type="submit"
        className="bg-foreground text-white px-5 text-[11px] font-semibold tracking-[0.14em] uppercase hover:opacity-85 transition-opacity"
      >
        Join
      </button>
    </form>
  );
}
