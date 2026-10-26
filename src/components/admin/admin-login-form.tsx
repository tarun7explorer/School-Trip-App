"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, LoaderCircle, LockKeyhole } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signInAdmin } from "@/lib/actions/admin-auth-actions";
import { adminLoginSchema, type AdminLoginValues } from "@/lib/validations/admin-login-schema";

export function AdminLoginForm() {
  const [formError, setFormError] = useState("");
  const form = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { email: "", password: "" },
  });
  const { errors, isSubmitting } = form.formState;

  async function onSubmit(values: AdminLoginValues) {
    setFormError("");
    try {
      const result = await signInAdmin(values);
      if (!result.success) setFormError(result.message);
    } catch {
      setFormError("Unable to sign in right now. Please try again.");
    }
  }

  return (
    <main id="main" className="admin-login-page" tabIndex={-1}>
      <section className="admin-login-card" aria-labelledby="admin-login-title">
        <div className="admin-login-mark"><LockKeyhole size={22} aria-hidden="true" /></div>
        <p className="eyebrow">MB LEARNING · ADMINISTRATION</p>
        <h1 id="admin-login-title">Administrator sign in</h1>
        <p className="admin-login-intro">Sign in with an account authorized by MB Learning.</p>

        <form className="admin-login-form" noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <div className="form-field">
            <label htmlFor="admin-email">Email address</label>
            <input id="admin-email" type="email" autoComplete="username" inputMode="email" placeholder="admin@schooltrips.example" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "admin-email-error" : undefined} {...form.register("email")} />
            {errors.email && <p className="field-error" id="admin-email-error">{errors.email.message}</p>}
          </div>
          <div className="form-field">
            <label htmlFor="admin-password">Password</label>
            <input id="admin-password" type="password" autoComplete="current-password" placeholder="Enter your password" aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "admin-password-error" : undefined} {...form.register("password")} />
            {errors.password && <p className="field-error" id="admin-password-error">{errors.password.message}</p>}
          </div>

          {formError && <p className="form-error-summary" role="alert">{formError}</p>}
          {isSubmitting && <p className="form-pending" role="status" aria-live="polite"><LoaderCircle size={15} className="pending-spinner" aria-hidden="true" /> Signing in…</p>}

          <button className="button button-primary admin-login-submit" type="submit" disabled={isSubmitting} aria-disabled={isSubmitting}>
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <Link className="admin-login-back" href="/"><ArrowLeft size={14} aria-hidden="true" /> Back to MB Learning</Link>
      </section>
    </main>
  );
}
