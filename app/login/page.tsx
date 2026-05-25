"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { GoHome } from "react-icons/go";

const trustItems = [
  "Verified property owners",
  "Saved searches across devices",
  "Private account activity",
];

const signInOptions = [
  {
    label: "Continue with Gmail",
    method: "google",
    icon: FaGoogle,
    className:
      "border-slate-300 cursor-pointer bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50 focus:ring-blue-100",
  },
  {
    label: "Continue with Facebook",
    method: "facebook",
    icon: FaFacebookF,
    className:
      "border-[#1877F2] cursor-pointer bg-[#1877F2] text-white hover:border-[#166fe5] hover:bg-[#166fe5] focus:ring-blue-200",
  },
  {
    label: "Continue with GitHub",
    method: "github",
    icon: FaGithub,
    className:
      "border-slate-950 cursor-pointer bg-slate-950 text-white hover:border-slate-800 hover:bg-slate-800 focus:ring-slate-200",
  },
];

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center bg-[#f7f8fc] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <section className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.10)] lg:grid-cols-[1fr_0.92fr]">
        <div className="relative hidden min-h-[580px] bg-[#102a6d] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(135deg,rgba(255,255,255,.22)_1px,transparent_1px)] [background-size:28px_28px]" />
          <div className="relative">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-lg font-bold"
            >
              <GoHome size={28} />
              PropertyPulse
            </Link>
          </div>

          <div className="relative max-w-md">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">
              Welcome home
            </p>
            <h1 className="text-5xl font-bold leading-[1.05]">
              Manage every rental move from one calm dashboard.
            </h1>
            <p className="mt-5 text-base leading-7 text-blue-100">
              Sign in to save listings, review property details, and continue
              conversations with owners without losing your place.
            </p>
          </div>

          <div className="relative grid grid-cols-3 gap-3">
            <div className="rounded-[8px] border border-white/20 bg-white/10 p-4">
              <p className="text-3xl font-bold">240+</p>
              <p className="mt-1 text-xs text-blue-100">Active homes</p>
            </div>
            <div className="rounded-[8px] border border-white/20 bg-white/10 p-4">
              <p className="text-3xl font-bold">98%</p>
              <p className="mt-1 text-xs text-blue-100">Owner response</p>
            </div>
            <div className="rounded-[8px] border border-white/20 bg-white/10 p-4">
              <p className="text-3xl font-bold">24h</p>
              <p className="mt-1 text-xs text-blue-100">Listing checks</p>
            </div>
          </div>
        </div>

        <div className="flex min-h-[580px] items-center justify-center px-5 py-8 sm:px-10">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-lg font-bold text-[#1E40AF]"
              >
                <GoHome size={28} />
                PropertyPulse
              </Link>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#1E40AF]">
                Sign in
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-normal text-slate-950">
                Welcome back
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Access your saved rentals, listed properties, and account
                activity.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              {signInOptions.map(({ label, method, icon: Icon, className }) => (
                <button
                  key={label}
                  type="button"
                  onClick={async () => {
                    await signIn(`${method}`);
                  }}
                  className={`flex h-12 w-full items-center justify-between rounded-[8px] border px-4 text-sm font-bold shadow-sm transition focus:outline-none focus:ring-4 ${className}`}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={20} />
                    {label}
                  </span>
                  <FiArrowRight size={18} />
                </button>
              ))}
            </div>

            <div className="mt-7 space-y-3 rounded-[8px] border border-emerald-100 bg-emerald-50 p-4">
              {trustItems.map((item) => (
                <p
                  key={item}
                  className="flex items-center gap-2 text-sm font-medium text-emerald-900"
                >
                  <FiCheckCircle className="shrink-0" size={17} />
                  {item}
                </p>
              ))}
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-slate-500">
              By continuing, you agree to PropertyPulse{" "}
              <Link
                href="/"
                className="font-bold text-[#1E40AF] hover:underline"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/"
                className="font-bold text-[#1E40AF] hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
