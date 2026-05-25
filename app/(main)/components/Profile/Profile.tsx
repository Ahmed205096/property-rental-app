"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  IoPencil,
  IoListOutline,
  IoGridOutline,
  IoTrashOutline,
  IoAddOutline,
  IoBedOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";
import { MdOutlineBathtub } from "react-icons/md";
import { TbRulerMeasure2 } from "react-icons/tb";
import { CiLocationOn } from "react-icons/ci";
import { IoLogOutSharp } from "react-icons/io5";
import { signOut, useSession } from "next-auth/react";
import getUserBookmarks from "../../../actions/getUsetBookmarks";
import getUserProperties from "@/app/actions/getUserProperties";

interface Property {
  _id: string;
  type: string;
  title: string;
  description: string;
  beds: number;
  baths: number;
  sqft: number;
  rates: {
    monthly: number;
    weekly: number;
    nightly: number;
  };
  location: {
    street: string;
    city: string;
    state: string;
    zipcode: string;
  };
  images: {
    url: string;
    public_id: string;
  }[];
}

const FALLBACK_PROPERTY_IMAGE =
  "/assets/images/pexels-littlehampton-bricks-2717960-4626257.jpg";

function getPropertyImage(property: Property) {
  return property.images[0]?.url || FALLBACK_PROPERTY_IMAGE;
}

function getPropertyAddress(property: Property) {
  return [
    property.location.street,
    property.location.city,
    property.location.state,
    property.location.zipcode,
  ]
    .filter(Boolean)
    .join(", ");
}

export default function Profile() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [listings, setListings] = useState<Property[]>([]);
  const [isListingsLoading, setIsListingsLoading] = useState(true);
  const [userProperties, setUserProperties] = useState<Property[]>([]);
  const [isPropertiesLoading, setIsPropertiesLoading] = useState(true);
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const session = useSession();

  const handleDelete = async (id: string) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_DELETE_PROPERTY}?id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          typeof error === "string" ? error : error.error || "Failed to delete",
        );
      }

      setUserProperties((prev) => prev.filter((property) => property._id !== id));
      setShowNotification(
        "Property deleted successfully.",
      );
      setTimeout(() => setShowNotification(null), 3000);
    } catch (e) {
      console.error("Error deleting listing", e);
      const message =
        e instanceof Error ? e.message : "Failed to delete property.";
      setShowNotification(message);
      setTimeout(() => setShowNotification(null), 3000);
    }
  };

  const handleBookMark = async (bookmark: string) => {
    try {
      await fetch(process.env.NEXT_PUBLIC_API_USER_LISTING || "", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookmark,
        }),
      });
      setListings((prev) => prev.filter((item) => item._id !== bookmark));
      setShowNotification("Property removed from bookmarks.");
      setTimeout(() => setShowNotification(null), 3000);
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookmarks, properties] = await Promise.all([
          getUserBookmarks() as Promise<Property[]>,
          getUserProperties() as Promise<Property[]>,
        ]);
        setListings(bookmarks.filter(Boolean).reverse());
        setUserProperties(properties.filter(Boolean).reverse());
      } finally {
        setIsListingsLoading(false);
        setIsPropertiesLoading(false);
      }
    };
    fetchData();
  }, [session.status]);


  return (
    <div className="mt-[60px] ml-[20px] pb-[80px] pt-[40px] px-[20px] md:px-[60px] lg:px-[100px] bg-[#f7f8fc] flex-grow">
      {/* Page Title Header */}
      <div className="mb-[24px]  md:ml-[100px]">
        <h2 className="text-[#1E40AF] font-bold text-[32px] leading-tight mb-[4px]">
          Your Profile
        </h2>
        <p className="text-gray-600 text-[14px]">
          Manage your listings and personal information.
        </p>
      </div>

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-[12px] shadow-xl p-[28px] max-w-[360px] w-full mx-4 flex flex-col gap-[16px]">
            <h3 className="text-gray-800 font-bold text-[17px]">
              Delete Listing
            </h3>
            <p className="text-gray-500 text-[14px]">
              Are you sure you want to delete this listing? This action cannot
              be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="px-[16px] py-[8px] rounded-[8px] border border-gray-300 text-gray-700 text-[13px] font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-[16px] py-[8px] rounded-[8px] bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[13px] font-semibold transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showNotification && (
        <div className="mb-[20px] max-w-[1200px] mx-auto flex items-center gap-2 bg-[#e6f4ea] border border-[#a3cfbb] text-[#137333] p-[12px] rounded-[8px] text-[13px] font-medium transition-all animate-fadeIn">
          <IoCheckmarkCircleOutline size={18} className="shrink-0" />
          <span>{showNotification}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 md:p-[50px] gap-[30px] max-w-[1200px] mx-auto">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white border border-gray-300 rounded-[12px] p-[24px] shadow-sm flex flex-col items-center text-center">
            {/* User Avatar */}
            <div className="relative w-[130px] h-[130px] rounded-full overflow-hidden border-2 border-blue-100 shadow-sm shrink-0 select-none">
              <Image
                src={session.data?.user?.image || "/images/default-avatar.png"}
                alt="Brad Traversy Profile Picture"
                fill
                className="object-cover"
                priority
              />
              <button
                type="button"
                className="absolute bottom-[6px] right-[6px] bg-[#1E40AF] hover:bg-[#1a3899] text-white p-[6px] rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title="Change Avatar"
              >
                <IoPencil size={12} />
              </button>
            </div>

            {/* User Details */}
            <span className="text-[11px] font-bold text-gray-400 tracking-wider mt-[20px] mb-[2px]">
              FULL NAME
            </span>
            <h3 className="text-[#1E40AF] font-bold text-[20px]">
              {session.data?.user?.name || "User Name"}
            </h3>

            <span className="text-[11px] font-bold text-gray-400 tracking-wider mt-[16px] mb-[2px]">
              EMAIL ADDRESS
            </span>
            <p className="text-gray-700 text-[14px] font-medium break-all">
              {session.data?.user?.email || "User Email"}
            </p>

            {/* Edit details button */}
            <button
              type="button"
              onClick={async () => {
                await signOut();
              }}
              className="w-full mt-[10px] bg-red-800 hover:bg-red-600 text-white font-bold py-[10px] px-[16px] rounded-[8px] flex items-center justify-center gap-[8px] text-[13px] hover:shadow-sm cursor-pointer transition-all"
            >
              <IoLogOutSharp size={16} />
              <span>Logout</span>
            </button>

            {/* Separator Line */}
            <hr className="w-full border-gray-200 my-[20px]" />

            {/* Stats list info */}
            <div className="w-full flex flex-col gap-[12px] text-[13px] font-medium text-gray-600">
              <div className="flex justify-between items-center">
                <span>Account Status</span>
                <span className="bg-[#eff6ff] text-[#1E40AF] border border-blue-200 text-[10px] font-bold px-[8px] py-[2px] rounded-full uppercase tracking-wider">
                  PRO
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Your Role</span>
                <span className="text-gray-800 font-bold">
                  {session.data?.user?.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - User Listings */}
        <div className="lg:col-span-3 flex flex-col gap-[20px]">
          {/* Heading Row with Filter View Switcher */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h3 className="text-[#1E40AF] font-bold text-[22px] md:text-[24px]">
                Your Bookmarks
              </h3>
              <span className="bg-[#1E40AF] text-white text-[12px] font-bold px-[10px] py-[2px] rounded-full shadow-sm">
                {listings.length}{" "}
                {listings.length === 1 ? "Property" : "Properties"}
              </span>
            </div>

            {/* View Switchers */}
            <div className="flex border border-gray-300 rounded-[8px] overflow-hidden shadow-sm shrink-0">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-[8px] cursor-pointer transition-all ${
                  viewMode === "list"
                    ? "bg-[#eff6ff] text-[#1E40AF] font-semibold"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
                title="List View"
              >
                <IoListOutline size={18} />
              </button>
              <div className="w-px bg-gray-300"></div>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-[8px] cursor-pointer transition-all ${
                  viewMode === "grid"
                    ? "bg-[#eff6ff] text-[#1E40AF] font-semibold"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
                title="Grid View"
              >
                <IoGridOutline size={18} />
              </button>
            </div>
          </div>

          {/* User Listings Section */}
          {isListingsLoading ? (
            <div className="bg-white border border-gray-300 rounded-[12px] p-[40px] text-center shadow-sm text-sm font-semibold text-gray-500">
              Loading...
            </div>
          ) : listings.length === 0 ? (
            <div className="bg-white border border-gray-300 rounded-[12px] p-[40px] text-center shadow-sm">
              <p className="text-gray-500 font-medium">
                You don&apos;t have any active property listings.
              </p>
              <p className="text-gray-400 text-[13px] mt-[4px]">
                List a property using the button below to get started.
              </p>
            </div>
          ) : viewMode === "list" ? (
            // List View layout (Horizontal Cards matching design)
            <div className="flex flex-col gap-[16px]">
              {listings.map((item) => (
                <div
                  key={item._id}
                  className="w-full bg-white border border-gray-300 rounded-[12px] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row"
                >
                  {/* Left Column Image */}
                  <div className="relative w-full sm:w-[220px] h-[160px] sm:h-auto shrink-0 select-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getPropertyImage(item)}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-[#1c50c3] text-white text-[9px] font-bold px-[8px] py-[3px] rounded-[4px] uppercase tracking-wider shadow-sm select-none">
                      FOR RENT
                    </span>
                  </div>

                  {/* Right Column Details */}
                  <div className="p-[20px] flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex flex-col">
                          <span className="text-[12px] font-medium text-gray-400 uppercase tracking-wider select-none">
                            {item.title}
                          </span>
                          <Link
                            href={`/details/${item._id}`}
                            className="text-gray-800 font-bold text-[17px] md:text-[18px] mt-[2px] hover:text-[#1E40AF] transition-colors line-clamp-1"
                          >
                            {item.description}
                          </Link>
                        </div>
                        <span className="text-[#1E40AF] font-bold text-[17px] md:text-[18px] shrink-0">
                          ${item.rates.monthly.toLocaleString()}/mo
                        </span>
                      </div>

                      <div className="flex items-center gap-[4px] text-[12px] text-gray-500 mt-[6px]">
                        <CiLocationOn
                          className="text-red-500 text-[14px]"
                          strokeWidth={1}
                        />
                        <span className="line-clamp-1">
                          {getPropertyAddress(item)}
                        </span>
                      </div>

                      {/* Specs */}
                      <div className="flex gap-[16px] text-[12px] font-semibold text-gray-500 mt-[16px] select-none">
                        <span className="flex items-center gap-[4px]">
                          <IoBedOutline size={15} />
                          <span>{item.beds} Beds</span>
                        </span>
                        <span className="flex items-center gap-[4px]">
                          <MdOutlineBathtub size={15} />
                          <span>{item.baths} Baths</span>
                        </span>
                        <span className="flex items-center gap-[4px]">
                          <TbRulerMeasure2 size={15} />
                          <span>{item.sqft.toLocaleString()} sqft</span>
                        </span>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="flex gap-3 mt-[18px]">
                      {/* <Link
                        href="/add-property"
                        className="bg-[#1E40AF] hover:bg-[#1a3899] text-white text-[12px] font-bold py-[7px] px-[14px] rounded-[6px] flex items-center justify-center gap-[4px] cursor-pointer transition-colors shadow-sm"
                      >
                        <IoPencil size={14} />
                        <span>Edit</span>
                      </Link> */}
                      <button
                        type="button"
                        onClick={() => handleBookMark(item._id)}
                        className="bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[12px] font-bold py-[7px] px-[14px] rounded-[6px] flex items-center justify-center gap-[4px] cursor-pointer transition-colors shadow-sm"
                      >
                        <IoTrashOutline size={14} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Grid View layout (matching properties card layout)
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              {listings.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-gray-300 rounded-[12px] overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div className="relative w-full h-[180px] shrink-0 select-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getPropertyImage(item)}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-[#1c50c3] text-white text-[9px] font-bold px-[8px] py-[3px] rounded-[4px] uppercase tracking-wider shadow-sm">
                      FOR RENT
                    </span>
                    <span className="absolute top-3 right-3 bg-black/60 text-white text-[11px] font-bold px-[8px] py-[4px] rounded-[4px]">
                      ${item.rates.monthly.toLocaleString()}/mo
                    </span>
                  </div>

                  <div className="p-[16px] flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider select-none">
                        {item.title}
                      </span>
                      <h4 className="text-gray-800 font-bold text-[16px] mt-[1px] hover:text-[#1E40AF] transition-colors cursor-pointer line-clamp-1">
                        {item.description}
                      </h4>

                      <div className="flex items-center gap-[4px] text-[11px] text-gray-500 mt-[4px]">
                        <CiLocationOn
                          className="text-red-500 text-[13px]"
                          strokeWidth={1}
                        />
                        <span className="line-clamp-1">
                          {getPropertyAddress(item)}
                        </span>
                      </div>

                      {/* Specs */}
                      <div className="flex justify-between items-center text-[11px] font-semibold text-gray-500 mt-[12px] border-y border-gray-100 py-[8px] select-none">
                        <span className="flex items-center gap-[4px]">
                          <IoBedOutline size={14} />
                          <span>{item.beds} Beds</span>
                        </span>
                        <span className="flex items-center gap-[4px]">
                          <MdOutlineBathtub size={14} />
                          <span>{item.baths} Baths</span>
                        </span>
                        <span className="flex items-center gap-[4px]">
                          <TbRulerMeasure2 size={14} />
                          <span>{item.sqft} sqft</span>
                        </span>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="flex gap-3 mt-[14px]">
                      <Link
                        href="/add-property"
                        className="flex-1 bg-[#1E40AF] hover:bg-[#1a3899] text-white text-[12px] font-bold py-[7px] px-[12px] rounded-[6px] flex items-center justify-center gap-[4px] cursor-pointer transition-colors"
                      >
                        <IoPencil size={14} />
                        <span>Edit</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleBookMark(item._id)}
                        className="flex-1 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[12px] font-bold py-[7px] px-[12px] rounded-[6px] flex items-center justify-center gap-[4px] cursor-pointer transition-colors"
                      >
                        <IoTrashOutline size={14} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Your Listed Properties Section */}
          <div className="flex items-center gap-3 mt-[10px]">
            <h3 className="text-[#1E40AF] font-bold text-[22px] md:text-[24px]">
              Your Listings
            </h3>
            <span className="bg-[#1E40AF] text-white text-[12px] font-bold px-[10px] py-[2px] rounded-full shadow-sm">
              {userProperties.length}{" "}
              {userProperties.length === 1 ? "Property" : "Properties"}
            </span>
          </div>

          {isPropertiesLoading ? (
            <div className="bg-white border border-gray-300 rounded-[12px] p-[40px] text-center shadow-sm text-sm font-semibold text-gray-500">
              Loading...
            </div>
          ) : userProperties.length === 0 ? (
            <div className="bg-white border border-gray-300 rounded-[12px] p-[40px] text-center shadow-sm">
              <p className="text-gray-500 font-medium">
                You haven&apos;t listed any properties yet.
              </p>
            </div>
          ) : viewMode === "list" ? (
            <div className="flex flex-col gap-[16px]">
              {userProperties.map((item) => (
                <div
                  key={item._id}
                  className="w-full bg-white border border-gray-300 rounded-[12px] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row"
                >
                  <div className="relative w-full sm:w-[220px] h-[160px] sm:h-auto shrink-0 select-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getPropertyImage(item)}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-[#059669] text-white text-[9px] font-bold px-[8px] py-[3px] rounded-[4px] uppercase tracking-wider shadow-sm select-none">
                      YOUR LISTING
                    </span>
                  </div>

                  <div className="p-[20px] grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex flex-col">
                          <span className="text-[12px] font-medium text-gray-400 uppercase tracking-wider select-none">
                            {item.title}
                          </span>
                          <Link
                            href={`/details/${item._id}`}
                            className="text-gray-800 font-bold text-[17px] md:text-[18px] mt-[2px] hover:text-[#1E40AF] transition-colors line-clamp-1"
                          >
                            {item.description}
                          </Link>
                        </div>
                        <span className="text-[#1E40AF] font-bold text-[17px] md:text-[18px] shrink-0">
                          ${item.rates.monthly.toLocaleString()}/mo
                        </span>
                      </div>

                      <div className="flex items-center gap-[4px] text-[12px] text-gray-500 mt-[6px]">
                        <CiLocationOn
                          className="text-red-500 text-[14px]"
                          strokeWidth={1}
                        />
                        <span className="line-clamp-1">
                          {getPropertyAddress(item)}
                        </span>
                      </div>

                      <div className="flex gap-[16px] text-[12px] font-semibold text-gray-500 mt-[16px] select-none">
                        <span className="flex items-center gap-[4px]">
                          <IoBedOutline size={15} />
                          <span>{item.beds} Beds</span>
                        </span>
                        <span className="flex items-center gap-[4px]">
                          <MdOutlineBathtub size={15} />
                          <span>{item.baths} Baths</span>
                        </span>
                        <span className="flex items-center gap-[4px]">
                          <TbRulerMeasure2 size={15} />
                          <span>{item.sqft.toLocaleString()} sqft</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-[18px]">
                      <Link
                        href={`/add-property?edit=${item._id}`}
                        className="bg-[#1E40AF] hover:bg-[#1a3899] text-white text-[12px] font-bold py-[7px] px-[14px] rounded-[6px] flex items-center justify-center gap-[4px] cursor-pointer transition-colors shadow-sm"
                      >
                        <IoPencil size={14} />
                        <span>Edit</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(item._id)}
                        className="bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[12px] font-bold py-[7px] px-[14px] rounded-[6px] flex items-center justify-center gap-[4px] cursor-pointer transition-colors shadow-sm"
                      >
                        <IoTrashOutline size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              {userProperties.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-gray-300 rounded-[12px] overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div className="relative w-full h-[180px] shrink-0 select-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getPropertyImage(item)}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-[#059669] text-white text-[9px] font-bold px-[8px] py-[3px] rounded-[4px] uppercase tracking-wider shadow-sm">
                      YOUR LISTING
                    </span>
                    <span className="absolute top-3 right-3 bg-black/60 text-white text-[11px] font-bold px-[8px] py-[4px] rounded-[4px]">
                      ${item.rates.monthly.toLocaleString()}/mo
                    </span>
                  </div>

                  <div className="p-[16px] grow flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider select-none">
                        {item.title}
                      </span>
                      <Link
                        href={`/details/${item._id}`}
                        className="block text-gray-800 font-bold text-[16px] mt-px hover:text-[#1E40AF] transition-colors line-clamp-1"
                      >
                        {item.description}
                      </Link>

                      <div className="flex items-center gap-[4px] text-[11px] text-gray-500 mt-[4px]">
                        <CiLocationOn
                          className="text-red-500 text-[13px]"
                          strokeWidth={1}
                        />
                        <span className="line-clamp-1">
                          {getPropertyAddress(item)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[11px] font-semibold text-gray-500 mt-[12px] border-y border-gray-100 py-[8px] select-none">
                        <span className="flex items-center gap-[4px]">
                          <IoBedOutline size={14} />
                          <span>{item.beds} Beds</span>
                        </span>
                        <span className="flex items-center gap-[4px]">
                          <MdOutlineBathtub size={14} />
                          <span>{item.baths} Baths</span>
                        </span>
                        <span className="flex items-center gap-[4px]">
                          <TbRulerMeasure2 size={14} />
                          <span>{item.sqft.toLocaleString()} sqft</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-[14px]">
                      <Link
                        href={`/add-property?edit=${item._id}`}
                        className="flex-1 bg-[#1E40AF] hover:bg-[#1a3899] text-white text-[12px] font-bold py-[7px] px-[12px] rounded-[6px] flex items-center justify-center gap-[4px] cursor-pointer transition-colors"
                      >
                        <IoPencil size={14} />
                        <span>Edit</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(item._id)}
                        className="flex-1 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[12px] font-bold py-[7px] px-[12px] rounded-[6px] flex items-center justify-center gap-[4px] cursor-pointer transition-colors"
                      >
                        <IoTrashOutline size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add a New Listing Dashed Border Box */}
          <Link
            href="/add-property"
            className="w-full min-h-[100px] border-2 border-dashed border-gray-300 rounded-[12px] flex flex-col justify-center items-center gap-1.5 hover:border-[#1E40AF] hover:bg-white bg-[#fbfbfe] hover:text-[#1E40AF] text-gray-500 cursor-pointer transition-all p-4 select-none"
          >
            <div className="p-[4px] rounded-full border border-gray-300 text-gray-400 group-hover:text-[#1E40AF] group-hover:border-[#1E40AF] transition-colors bg-white">
              <IoAddOutline size={20} />
            </div>
            <span className="font-bold text-[14px]">Add a New Listing</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
