"use client";

import { useEffect, useState } from "react";
import Hero from "../components/Home/Hero/Hero";
import RecentCards from "../components/Home/Items/Cards/RecentCards";
import SkeletonLoader from "@/app/components/SkeletonLoader";

interface Property {
  _id: string;
  type: string;
  title: string;
  location: {
    city: string;
    state: string;
  };
  beds: number;
  baths: number;
  sqft: number;
  rates: {
    monthly: number;
  };
  images: {
    url: string;
    public_id: string;
  }[];
}

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL}${process.env.NEXT_PUBLIC_API_GET_ALL_PROPERTIES}`,
        );

        if (!response.ok) {
          throw new Error("Failed to load properties.");
        }

        const data = (await response.json()) as Property[];
        setProperties(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load properties.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

 return (
    <div>
      <Hero />
      
      <div className="mx-auto max-w-[1280px] px-5 md:px-[100px] mt-[50px] flex flex-col overflow-x-hidden">
        
        <div>
          <p className="mb-[15px] text-[20px] font-bold text-[#1E40AF]">Recent Properties</p>
        </div>

        {loading && <SkeletonLoader />}

        {error && (
          <div className="rounded-[8px] border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && properties.length === 0 && (
          <div className="rounded-[8px] border border-gray-200 bg-white p-6 text-center text-sm text-gray-600">
            No properties available yet.
          </div>
        )}

        {!loading && !error && properties.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-stretch justify-center gap-4">
            {properties.map((property) => (
              <RecentCards
                key={property._id}
                id={property._id}
                title={property.type}
                description={property.title}
                beds_number={property.beds}
                baths_number={property.baths}
                sqft={property.sqft}
                price={property.rates.monthly}
                location={`${property.location.city}, ${property.location.state}`}
                image={
                  property.images[0]?.url ||
                  "/assets/images/pexels-littlehampton-bricks-2717960-4626257.jpg"
                }
              />
            ))}
          </div>
        )}

        <div className="h-[50px] w-full" />
      </div>
    </div>
  );
}
