"use client";

import { useRouter } from "next/navigation";

type BackButtonProps = {
  fallbackHref: string;
  label: string;
};

export function BackButton({ fallbackHref, label }: BackButtonProps) {
  const router = useRouter();

  function goBack() {
    const sameOriginReferrer = document.referrer.startsWith(window.location.origin);
    if (window.history.length > 1 && sameOriginReferrer) {
      router.back();
      return;
    }
    router.push(fallbackHref);
  }

  return <button className="back-button" type="button" onClick={goBack}>{label}</button>;
}
