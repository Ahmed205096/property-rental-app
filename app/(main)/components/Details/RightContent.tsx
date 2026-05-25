"use client";
import Link from "next/link";
import { IoBookmarkSharp, IoBookmarkOutline } from "react-icons/io5";
import { SiFacebook } from "react-icons/si";
import { AiFillTwitterCircle } from "react-icons/ai";
import { IoLogoInstagram } from "react-icons/io5";
import { FaWhatsappSquare } from "react-icons/fa";
import { LuSendHorizontal } from "react-icons/lu";
import { useSession } from "next-auth/react";
import { LeftContentProps } from "./LeftContent";
import { useEffect, useState } from "react";
import { FiLock } from "react-icons/fi";
import getLocations from "@/app/actions/getLocations";

export default function RightContent({ property }: LeftContentProps) {
  const session = useSession();
  const [bookmark, setBookMark] = useState(false);
  const [contactNotice, setContactNotice] = useState(false);

  useEffect(() => {
    const check = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/${process.env.NEXT_PUBLIC_API_IS_LISTED}?userId=${session.data?.user.id}&propertyId=${property._id}`,
      );
      const data = await res.json();
      await getLocations();
      setBookMark(data);
    };
    check();
  }, [session.status, session.data, property._id]);

  const handleBookMark = async () => {
    try {
      await fetch(process.env.NEXT_PUBLIC_API_USER_LISTING || "", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookmark: property._id,
        }),
      });
      setBookMark(!bookmark);
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  const handleSendMessage = () => {
    setContactNotice(true);
  };

  const contactCard = (
    <div className="flex flex-col gap-4">
      <div>
        <h4 className="text-[#1E40AF] text-[18px] font-bold tracking-tight">
          Contact Manager
        </h4>
        <p className="text-gray-400 text-[12px] mt-0.5">Send an inquiry about this listing</p>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        <div>
          <label htmlFor="name" className="block text-[13px] font-semibold text-slate-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="John Doe"
            className="w-full border border-slate-200 focus:border-[#1E40AF] focus:ring-2 focus:ring-blue-100 rounded-lg text-[14px] p-2.5 outline-none transition-all placeholder:text-gray-300"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-[13px] font-semibold text-slate-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="john@example.com"
            className="w-full border border-slate-200 focus:border-[#1E40AF] focus:ring-2 focus:ring-blue-100 rounded-lg text-[14px] p-2.5 outline-none transition-all placeholder:text-gray-300"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-[13px] font-semibold text-slate-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            placeholder="(555) 000-0000"
            className="w-full border border-slate-200 focus:border-[#1E40AF] focus:ring-2 focus:ring-blue-100 rounded-lg text-[14px] p-2.5 outline-none transition-all placeholder:text-gray-300"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-[13px] font-semibold text-slate-700 mb-1">
            Message
          </label>
          <textarea
            id="message"
            placeholder="I am interested in this property..."
            className="w-full border resize-none border-slate-200 focus:border-[#1E40AF] focus:ring-2 focus:ring-blue-100 h-[110px] rounded-lg text-[14px] p-2.5 outline-none transition-all placeholder:text-gray-300"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleSendMessage}
        className="flex w-full bg-[#1E40AF] hover:bg-blue-700 active:scale-[0.98] transition-all text-[14px] text-white font-bold rounded-lg justify-center items-center gap-2 h-11 mt-2 shadow-sm cursor-pointer"
      >
        <LuSendHorizontal size={16} />
        <span>Send Message</span>
      </button>

      {contactNotice && (
        <div
          className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-center text-[13px] font-semibold leading-5 text-amber-800"
          role="status"
          aria-live="polite"
        >
          I bravely planned this feature, then heroically postponed it. Message
          sending is coming soon-ish.
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="col-span-1 mt-[15px] lg:col-span-2 flex flex-col gap-5">
        <div>
          <button
            onClick={() => handleBookMark()}
            className={`flex w-full items-center justify-center gap-2 h-12 font-bold rounded-xl transition-all shadow-sm cursor-pointer active:scale-[0.98]
              ${bookmark 
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100" 
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
          >
            {bookmark ? <IoBookmarkSharp size={18} /> : <IoBookmarkOutline size={18} />}
            <span>{bookmark ? "In Favourites" : "Add to Favourites"}</span>
          </button>

          <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-xl">
            <p className="text-center font-semibold text-[13px] text-slate-500 uppercase tracking-wider mb-3">
              Share This Property
            </p>
            <div className="flex items-center gap-4 justify-center text-slate-400">
              <SiFacebook className="hover:text-blue-600 transition-colors cursor-pointer" size={20} />
              <AiFillTwitterCircle className="hover:text-sky-400 transition-colors cursor-pointer" size={23} />
              <IoLogoInstagram className="hover:text-pink-600 transition-colors cursor-pointer" size={22} />
              <FaWhatsappSquare className="hover:text-emerald-500 transition-colors cursor-pointer" size={22} />
            </div>
          </div>

          <div className="relative p-6 bg-white border border-slate-100 shadow-md flex flex-col rounded-2xl overflow-hidden">
            {property.owner !== session.data?.user.id ? (
              <>{contactCard}</>
            ) : (
              <div className="w-full h-full">
                <div className="absolute inset-0 z-20 flex flex-col justify-center items-center bg-white/70 backdrop-blur-[5px] p-5 transition-all duration-300">
                  <div className="bg-white border border-slate-100 p-5 rounded-2xl flex flex-col justify-center items-center shadow-lg max-w-[85%] text-center">
                    <div className="bg-blue-50 text-[#1E40AF] p-3 rounded-full mb-3">
                      <FiLock size={22} />
                    </div>
                    <p className="font-bold text-slate-800 text-[16px] mb-1">
                      Your Listing
                    </p>
                    <p className="text-slate-500 text-[12px] leading-relaxed">
                      You are the owner of this property.
                    </p>
                  </div>
                </div>
                <div className="opacity-20 select-none pointer-events-none">
                  {contactCard}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
