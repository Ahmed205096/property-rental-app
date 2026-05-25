"use client";
import WelcomeCards from "./Cards/WelcomeCards";
import FeaturedCards from "./Cards/FeaturedCards";
import RecentCards from "./Cards/RecentCards";
import { useEffect, useState } from "react";
import SkeletonLoader from "@/app/components/SkeletonLoader";
import Link from "next/link";

interface IFeaturedRecentProperty {
  _id: string;
  owner: string;
  type: string;
  title: string;
  description: string;
  location: {
    city: string;
    state: string;
    zipcode: string;
    street: string;
  };
  beds: number;
  baths: number;
  sqft: number;
  amenities: string[];
  rates: {
    nightly: number;
    weekly: number;
    monthly: number;
  };
  images: {
    url: string;
    public_id: string;
  }[];
}

export default function Items() {
  const [featuredProperties, setFeaturedProperties] = useState<
    IFeaturedRecentProperty[]
  >([]);
  const [recentProperties, setRecentProperties] = useState<
    IFeaturedRecentProperty[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      const [featuredResponse, recentResponse] = await Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_URL}${process.env.NEXT_PUBLIC_API_GET_FEATURED_PROPERTIES}2`,
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_URL}${process.env.NEXT_PUBLIC_API_GET_RECENT_PROPERTIES}3`,
        ),
      ]);

      const [featuredData, recentData] = await Promise.all([
        featuredResponse.json() as Promise<IFeaturedRecentProperty[]>,
        recentResponse.json() as Promise<IFeaturedRecentProperty[]>,
      ]);

      setFeaturedProperties(featuredData);
      setRecentProperties(recentData);
      setLoading(false);
    };

    void fetchProperties().catch(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="mx-auto max-w-[1280px] px-5 md:px-[100px] mt-[30px] md:mt-[50px] flex flex-col overflow-x-hidden">
        <div className="flex w-full max-sm:flex-col">
          <div className="border mr-[5px] flex justify-between max-sm:mb-[10px] md:w-1/2  rounded-[10px] bg-[#f1f3ff] p-[20px] text-gray-300">
            <WelcomeCards
              link_path="/properties"
              title="For Renters"
              body="Find your dream rental property. Bookmark properties and contact
              owner."
              button_message=" Browse Properties"
              button_color="bg-black"
            />
          </div>
          <div className="border md:ml-[5px] flex justify-between md:w-1/2  rounded-[10px] bg-[#f1f3ff] p-[20px] text-gray-300">
            <WelcomeCards
              link_path="/add-property"
              title="For Property Owners"
              body="List your properties and reach potential tenants. Rent short or long term."
              button_message=" Browse Properties"
              button_color="bg-[#3b82f6]"
            />
          </div>
        </div>

        {/* ---------------------------------- */}

        <div className="mr-[5px] flex flex-col justify-between  mt-[40px] w-full">
          <p className="text-center w-full mb-[30px] text-[#1E40AF] font-bold text-[20px]">
            Featured Properties
          </p>

          {loading ? (
            <SkeletonLoader />
          ) : (
            <div className="flex flex-col md:flex-row gap-2 justify-center items-center">
              {featuredProperties?.map((property) => (
                <FeaturedCards
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

          <h3 className="w-full mt-[30px] mb-[20px] text-center justify-center items-center font-bold text-[20px] text-[#1E40AF]">
            Recent Properties
          </h3>

          {loading ? (
            <SkeletonLoader />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {recentProperties?.map((property) => (
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
          {/* ---------------------- */}

          <div className="w-full flex justify-center items-center mt-[50px]">
            <Link
              href="/properties"
              className="flex justify-center items-center cursor-pointer hover:bg-black font-bold w-[200px] h-[50px] p-[10px] bg-[#000000dc] text-white rounded-[5px]"
            >
              View All Properties
            </Link>
          </div>

          {/* ---------------------- */}

          <div className="mb-[60px]"></div>
        </div>
      </div>
    </>
  );
}
