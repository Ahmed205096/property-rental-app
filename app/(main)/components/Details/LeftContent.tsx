import { CiLocationOn } from "react-icons/ci";
import { IoIosClose } from "react-icons/io";
import { IoBedOutline } from "react-icons/io5";
import { MdOutlineBathtub } from "react-icons/md";
import { TbRulerMeasure2 } from "react-icons/tb";
import { FaCheck } from "react-icons/fa6";
import Image from "next/image";
import type { PropertyDetails } from "./Details";

export interface LeftContentProps {
  property: PropertyDetails;
}

function formatPrice(price?: number) {
  if (!price) {
    return null;
  }

  return `$${price.toLocaleString()}`;
}

export default function LeftContent({ property }: LeftContentProps) {
  function chunk_array_into_n(array: string[], chunksCount: number) {
    const result = [];
    const chunkSize = Math.ceil(array.length / chunksCount);

    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }

    return result;
  }
  const words = property.amenities.length
    ? property.amenities
    : ["No amenities listed"];
  const amenities_columns = chunk_array_into_n(words, 3);
  const address = [
    property.location.street,
    property.location.city,
    property.location.state,
    property.location.zipcode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <div className="col-span-1 lg:col-span-4">
        {" "}
        <div className="flex flex-col p-[15px]">
          {/* 1 */}
          <div className="bg-white p-[20px] w-full border border-gray-300 rounded-[10px]">
            <p className="text-[#456ae4] text-[12px]">
              {property.type.toUpperCase()}
            </p>
            <h3 className="text-[#1E40AF] font-bold text-[20px]">
              {property.title}
            </h3>

            <span className="flex justify-start items-center gap-1 text-[12px] text-gray-600">
              <CiLocationOn color="red" strokeWidth={1} />
              <p>{address}</p>
            </span>
          </div>
          {/* 2 */}
          <div>
            <span className="grid grid-rows-3 w-full bg-white items-center mt-[20px] border border-gray-300 rounded-[10px]">
              <span className="row-span-1 bg-[#000000db] font-bold rounded-t-[9px] text-white p-[10px] px-[20px]">
                <p>Rates & Options</p>
              </span>
              <div className="row-span-2 flex gap-2 w-full justify-around p-[15px] text-[12px] text-gray-700">
                <span className="flex flex-col justify-center items-center">
                  <p>Nightly</p>
                  {formatPrice(property.rates.nightly) ? (
                    <p className="font-bold text-[#1E40AF] text-[15px]">
                      {formatPrice(property.rates.nightly)}
                    </p>
                  ) : (
                    <IoIosClose className="mt-[-5px]" color="red" size={30} />
                  )}
                </span>
                <div className="h-[50px] w-px bg-[#99a1afa8]"></div>
                <span>
                  <p>Weekly</p>
                  <p className="font-bold text-[#1E40AF] text-[15px]">
                    {formatPrice(property.rates.weekly) || "N/A"}
                  </p>
                </span>
                <div className="h-[50px] w-px bg-[#99a1afa8]"></div>{" "}
                <span>
                  <p>Monthly</p>
                  <p className="font-bold text-[#1E40AF] text-[15px]">
                    {formatPrice(property.rates.monthly) || "N/A"}
                  </p>
                </span>
              </div>
            </span>
          </div>
          {/* 3 */}
          <div>
            <span className="grid grid-rows-3 w-full bg-white items-center mt-[20px] border border-gray-300 p-[20px] rounded-[10px]">
              <span className="row-span-1 font-bold rounded-t-[9px] text-[#1E40AF] mt-[-10px]">
                <p>Description & Details</p>
                <hr className="text-gray-300 mt-[10px]" />
              </span>
              <div className="row-span-2 grid grid-rows-3 grid-cols-1 gap-2 w-full justify-start items-center text-[12px] text-gray-700">
                <div className="row-span-1 w-full gap-4 flex  font-bold text-[12px] text-[#1E40AF]">
                  <span className="flex justify-center items-center gap-1">
                    <IoBedOutline size={17} />
                    <p>{property.beds} Beds</p>
                  </span>
                  <span className="flex justify-center items-center gap-1">
                    <MdOutlineBathtub size={17} />
                    <p>{property.baths} Baths</p>
                  </span>
                  <span className="flex justify-center items-center gap-1">
                    <TbRulerMeasure2 size={17} />
                    <p>{property.sqft} sqft</p>
                  </span>
                </div>
                <div className="row-span-2 ">
                  <hr className="text-gray-300 mb-[10px]" />
                  <p className="text-justify">{property.description}</p>
                </div>
              </div>
            </span>
          </div>
          {/* 4 */}
          <div className="w-full bg-white items-center mt-[20px] border border-gray-300 p-[20px] rounded-[10px]">
            <h3 className="font-bold text-[#1E40AF] mb-[15px]">Amenities</h3>
            <div className="grid grid-cols-3 text-[12px]">
              {amenities_columns.map((column, colIndex) => (
                <span
                  key={colIndex}
                  className="col-span-1 flex flex-col gap-y-[10px]"
                >
                  {column.map((word, wordIndex) => (
                    <span
                      key={wordIndex}
                      className="flex items-center gap-2 text-[14px] text-gray-700"
                    >
                      <FaCheck className="text-[#00C04B] text-[12px] shrink-0" />
                      <p>{word}</p>
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
          {/* 5 */}
          <div className="flex flex-col justify-center w-full h-[350px] bg-white mt-[20px] border border-gray-300 p-[20px] rounded-[10px]">
            <p className="mt-[-10px] font-bold text-[#1E40AF]">Location</p>
            <div className="relative h-[280px] mt-[2px]">
              <Image
                src={"/assets/map.jpg"}
                alt="map image"
                fill
                className="object-cover mt-[5px] rounded-[9px]"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
