"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/#trips", label: "Trips" },
  { href: "/#trips", label: "Student Explore" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#about", label: "About" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const inertSiblings = Array.from(document.body.children)
      .filter((element): element is HTMLElement => element instanceof HTMLElement && !element.contains(panelRef.current));
    const previousInertStates = inertSiblings.map((element) => element.inert);
    inertSiblings.forEach((element) => { element.inert = true; });
    const firstLink = panelRef.current?.querySelector<HTMLAnchorElement>("a");
    firstLink?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      } else if (event.key === "Tab") {
        const focusable = panelRef.current?.querySelectorAll<HTMLAnchorElement>("a");
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      inertSiblings.forEach((element, index) => { element.inert = previousInertStates[index]; });
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div className="mobile-nav">
      <button
        ref={triggerRef}
        type="button"
        className="mobile-menu-button"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        aria-controls="mobile-navigation-panel"
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
      </button>
      {open && (
        <>
          <button className="mobile-nav-backdrop" type="button" aria-label="Close navigation menu" onClick={closeMenu} />
          <div className="mobile-nav-panel" id="mobile-navigation-panel" ref={panelRef} role="dialog" aria-modal="true" aria-label="Site navigation">
            <nav aria-label="Mobile navigation">
              {links.map((link) => (
                <Link href={link.href} key={link.href} onClick={() => setOpen(false)}>{link.label}</Link>
              ))}
              <Link href="/teacher/login" onClick={() => setOpen(false)}>Teacher Login</Link>
              <Link href="/admin/login" onClick={() => setOpen(false)}>Admin Login</Link>
              <Link className="mobile-register" href="/interest" onClick={() => setOpen(false)}>Register Interest</Link>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
