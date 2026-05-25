"use client";

import getLocations from "@/app/actions/getLocations";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import { IoSearch } from "react-icons/io5";

interface HeroLocations {
  cities: string[];
  streets: string[];
  states: string[];
}

const emptyLocations: HeroLocations = {
  cities: [],
  streets: [],
  states: [],
};

export default function Hero() {
  const router = useRouter();
  const [locations, setLocations] = useState<HeroLocations>(emptyLocations);
  const [searchText, setSearchText] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");

  useEffect(() => {
    const loadLocations = async () => {
      const locationsData = await getLocations();
      setLocations(locationsData);
    };

    void loadLocations();
  }, []);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const keyword = searchText.trim();
    const location = selectedLocation === "all" ? "" : selectedLocation;

    if (!keyword && !location) {
      router.push("/properties");
      return;
    }

    const params = new URLSearchParams();
    if (keyword) params.set("search", keyword);
    if (location) params.set("location", location);

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="mt-[60px] bg-[#1938a0] overflow-hidden">
      <div className="md:mx-[100px] text-white p-[40px] md:p-[100px] flex flex-col justify-center items-center max-sm:items-start">
        <h1 className="capitalize max-sm:text-start max-sm:mt-[-20px] text-[30px] md:text-[40px] font-bold max-sm:mb-0 mb-[10px]">
          find the perfect rental
        </h1>
        <p className="text-[20px] max-sm:hidden">
          Discover the perfect property that suits your needs.
        </p>
        <form
          onSubmit={handleSearch}
          className="bg-white max-sm:bg-transparent max-sm:ml-[-8px] flex max-sm:flex-col max-sm:items-start md:flex-row items-center p-[10px] rounded-[10px] max-sm:w-full w-[550px] h-[50px] max-sm:mt-[5px] mt-[20px]"
        >
          <div className="flex max-sm:bg-white max-sm:mb-[10px] max-sm:p-[15px] max-sm:w-full rounded-[5px]">
            <CiLocationOn color="silver" strokeWidth={1} size={20} />
            <input
              className="ml-[6px] text-[14px] text-gray-400 outline-none bg-transparent h-full w-[180px] max-sm:w-full"
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Enter Keywords or Location"
            />
          </div>
          <span className="h-full mx-[15px] max-sm:hidden bg-gray-200 w-px"></span>

          <div className="max-sm:w-full">
            <select
              className="outline-0 cursor-pointer max-sm:hidden max-sm:p-[5px] rounded-[5px] text-black max-sm:w-[100px] w-[170px]"
              name="location"
              value={selectedLocation}
              onChange={(event) => setSelectedLocation(event.target.value)}
            >
              <option value="all">All</option>
              {locations.cities.length > 0 && (
                <optgroup label="Cities">
                  {locations.cities.map((city) => (
                    <option key={`city-${city}`} value={city}>
                      {city}
                    </option>
                  ))}
                </optgroup>
              )}
              {locations.states.length > 0 && (
                <optgroup label="States">
                  {locations.states.map((state) => (
                    <option key={`state-${state}`} value={state}>
                      {state}
                    </option>
                  ))}
                </optgroup>
              )}
              {locations.streets.length > 0 && (
                <optgroup label="Streets">
                  {locations.streets.map((street) => (
                    <option key={`street-${street}`} value={street}>
                      {street}
                    </option>
                  ))}
                </optgroup>
              )}
              
            </select>

            <button
              type="submit"
              className="bg-[#3B82F6] max-sm:w-full w-[105px] p-[5px] cursor-pointer rounded-[5px] max-sm:ml-0 ml-[15px] max-sm:p-[13px]"
            >
              <span className="flex justify-center px-[5px] items-center text-[14px]">
                <IoSearch /> &#160; Search
              </span>
            </button>
          </div>
        </form>
        <div className="h-[40px] w-full"></div>
      </div>
    </div>
  );
}
