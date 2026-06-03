"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { GoHome } from "react-icons/go";

const signInOptions = [
  {
    label: "Continue with Google",
    method: "google",
    icon: FaGoogle,
    className:
      "bg-white cursor-pointer border border-slate-200 text-slate-700 hover:bg-slate-50 hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 focus:ring-slate-100",
  },
  {
    label: "Continue with Facebook",
    method: "facebook",
    icon: FaFacebookF,
    className:
      "bg-[#1877F2] cursor-pointer border-transparent text-white hover:bg-[#166fe5] hover:shadow-lg hover:shadow-[#1877F2]/30 hover:-translate-y-0.5 focus:ring-blue-200",
  },
  {
    label: "Continue with GitHub",
    method: "github",
    icon: FaGithub,
    className:
      "bg-slate-900 cursor-pointer border-transparent text-white hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/30 hover:-translate-y-0.5 focus:ring-slate-200",
  },
];

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="absolute top-[10%] left-[15%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      <div className="absolute top-[20%] right-[15%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      <div className="absolute bottom-[10%] left-[30%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

      <section className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-[0_8px_40px_rgb(0,0,0,0.08)] backdrop-blur-xl lg:grid-cols-[1.1fr_1fr]">
        <div className="relative hidden min-h-[640px] p-12 lg:flex lg:flex-col lg:justify-between overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700"></div>

          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl"></div>

          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

          <div className="relative z-10 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xl font-bold text-white transition-transform hover:scale-105"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
                <GoHome size={22} className="text-white" />
              </div>
              PropertyPulse
            </Link>
          </div>

          <div className="relative z-10 max-w-md">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <p className="text-xs font-semibold tracking-wider text-emerald-100 uppercase">
                Welcome home
              </p>
            </div>

            <h1 className="text-5xl font-extrabold leading-tight text-white drop-shadow-sm">
              Manage every rental move from one{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
                calm
              </span>{" "}
              dashboard.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-blue-100/90 font-medium">
              Sign in to save listings, review property details, and continue
              conversations with owners without losing your place.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-4">
            {[
              { stat: "240+", label: "Active homes" },
              { stat: "98%", label: "Owner response" },
              { stat: "24h", label: "Listing checks" },
            ].map((item, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 hover:shadow-xl"
              >
                <p className="text-3xl font-bold text-white transition-colors group-hover:text-cyan-200">
                  {item.stat}
                </p>
                <p className="mt-1 text-xs font-medium text-blue-200/80">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex min-h-[640px] items-center justify-center bg-white px-6 py-10 sm:px-12 lg:px-16">
          <div className="w-full max-w-[420px]">
            <div className="mb-10 lg:hidden">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xl font-bold text-indigo-700"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
                  <GoHome size={22} />
                </div>
                PropertyPulse
              </Link>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Welcome back
              </h2>
              <p className="mt-3 text-base leading-relaxed text-slate-500">
                Access your saved rentals, listed properties, and account
                activity securely.
              </p>
            </div>

            <div className="space-y-4">
              {signInOptions.map(({ label, method, icon: Icon, className }) => (
                <button
                  key={label}
                  type="button"
                  onClick={async () => {
                    await signIn(`${method}`);
                  }}
                  className={`group flex h-14 w-full items-center justify-between rounded-xl border px-5 text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-4 ${className}`}
                >
                  <span className="flex items-center gap-3">
                    <Icon
                      size={22}
                      className="transition-transform group-hover:scale-110"
                    />
                    {label}
                  </span>
                  <FiArrowRight
                    size={18}
                    className="text-current opacity-70 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                  />
                </button>
              ))}
            </div>

            <p className="mt-8 text-center text-sm text-slate-500">
              By continuing, you agree to PropertyPulse{" "}
              <Link
                href="/"
                className="font-semibold text-indigo-600 transition-colors hover:text-indigo-700 hover:underline underline-offset-4"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/"
                className="font-semibold text-indigo-600 transition-colors hover:text-indigo-700 hover:underline underline-offset-4"
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
