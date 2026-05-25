import Image from "next/image";
import Link from "next/link";
import { IoBedOutline } from "react-icons/io5";
import { MdOutlineBathtub } from "react-icons/md";
import { TbRulerMeasure2 } from "react-icons/tb";
import { HiCurrencyDollar } from "react-icons/hi";
import { TbCalendarDollar } from "react-icons/tb";
import { CiLocationOn } from "react-icons/ci";

interface IProps {
  id?: string;
  title: string;
  description: string;
  beds_number: number;
  baths_number: number;
  sqft: number;
  location: string;
  image: string;
  price: number;
}

export default function RecentCards({
  id,
  title,
  description,
  beds_number,
  baths_number,
  sqft,
  location,
  image,
  price,
}: IProps) {
  return (
    <div className="flex flex-col w-full h-full bg-white rounded-[10px] overflow-hidden">
      <div className="relative w-full h-[200px] shrink-0">
        <Image
          src={`${image}`}
          alt="property view"
          fill
          className="object-cover"
        />
        <span className="absolute text-[12px] font-semibold text-white bg-[#1c50c3] p-[5px] px-[10px] rounded-[5px] right-[7px] top-[7px] z-10 shadow-sm">
          ${price.toLocaleString()}/mo
        </span>
      </div>

      <div className="border border-t-0 rounded-b-[10px] border-gray-300 p-[20px] flex flex-col flex-grow justify-between">
        <div>
          <p className="text-gray-500 text-[14px] line-clamp-1">{title}</p>

          <h3 className="text-[15px] font-bold mt-[5px] text-gray-800 line-clamp-2 min-h-[44px]">
            {description}
          </h3>

          <div className="mt-[15px] mb-[10px] flex justify-between items-center">
            <span className="flex justify-center items-center gap-1 text-[12px] text-gray-600">
              <IoBedOutline className="text-[14px]" />
              <p>{beds_number} Beds</p>
            </span>
            <span className="flex justify-center items-center gap-1 text-[12px] text-gray-600">
              <MdOutlineBathtub className="text-[14px]" />
              <p>{baths_number} Baths</p>
            </span>
            <span className="flex justify-center items-center gap-1 text-[12px] text-gray-600">
              <TbRulerMeasure2 className="text-[14px]" />
              <p>{sqft} sqft</p>
            </span>
          </div>

          <div className="text-[#1E40AF] text-[12px] mb-[15px] gap-6 flex justify-start items-center">
            <span className="flex justify-center items-center gap-1">
              <HiCurrencyDollar className="text-[14px]" />
              <p>Weekly</p>
            </span>
            <span className="flex justify-center items-center gap-1">
              <TbCalendarDollar className="text-[14px]" />
              <p>Monthly</p>
            </span>
          </div>
        </div>

        <div>
          <hr className="text-gray-200 mb-[10px]" />
          <div className="flex justify-between items-center text-[11px]">
            <span className="flex justify-center items-center font-bold text-red-500 max-w-[70%]">
              <CiLocationOn
                className="text-[14px] shrink-0"
                strokeWidth={1.5}
              />
              <p className="line-clamp-1 ml-1">{location}</p>
            </span>
            <span>
              <Link
                href={id ? `/details/${id}` : "/properties"}
                className="bg-[#3b82f6] cursor-pointer hover:bg-[#2563eb] transition-colors text-white px-[15px] py-[6px] rounded-[8px] font-medium shadow-sm"
              >
                Details
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
