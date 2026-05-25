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

export default function FeaturedCards({
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
    <div className="mb-[10px] md:w-1/2 w-full z-10">
      <div className="flex flex-col lg:flex-row border border-gray-300 rounded-[10px] overflow-hidden bg-white">
        <div className="relative w-full lg:w-1/2 h-[200px] lg:h-auto min-h-[180px]">
          <Image
            src={`${image}`}
            alt="apartment image"
            fill
            className="object-cover rounded-t-[9px] lg:rounded-r-none lg:rounded-l-[9px]"
          />
          <span className="absolute text-[#1E40AF] text-[12px] font-bold px-[10px] mt-[7px] ml-[7px] bg-white rounded-[5px] p-[5px]">
            ${price.toLocaleString()}/mo
          </span>
        </div>

        <div className="flex-1 p-[15px] flex flex-col justify-between">
          <div>
            <p className="text-gray-500 text-[14px]">{title}</p>
            <h3 className="text-[15px] font-bold mt-[5px] text-gray-800">
              {description}
            </h3>

            <div className="flex items-center justify-between mt-[10px] w-full text-gray-700">
              <span className="flex items-center gap-1 text-[12px]">
                <IoBedOutline className="text-[14px]" />
                <p>{beds_number} Beds</p>
              </span>
              <span className="flex items-center gap-1 text-[12px]">
                <MdOutlineBathtub className="text-[14px]" />
                <p>{baths_number} Baths</p>
              </span>
              <span className="flex items-center gap-1 text-[12px]">
                <TbRulerMeasure2 className="text-[14px]" />
                <p>{sqft} sqft</p>
              </span>
            </div>

            <div className="flex justify-start items-center gap-6 text-[12px] mt-[12px]">
              <span className="flex items-center gap-1 text-[#1E40AF] font-medium">
                <HiCurrencyDollar className="text-[14px]" />
                <p>Weekly</p>
              </span>
              <span className="flex items-center gap-1 text-[#1E40AF] font-medium">
                <TbCalendarDollar className="text-[14px]" />
                <p>Monthly</p>
              </span>
            </div>
          </div>

          <div className="mt-[20px]">
            <div className="w-full bg-gray-300 h-px my-[12px]"></div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="flex items-center gap-1 font-bold text-red-500">
                <CiLocationOn strokeWidth={2} className="text-[13px]" />
                <p>{location}</p>
              </span>
              <Link
                href={id ? `/details/${id}` : "/properties"}
                className="bg-[#3b82f6] cursor-pointer hover:bg-[#2563eb] transition-colors text-white px-[15px] py-[6px] rounded-[8px] font-medium"
              >
                Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
