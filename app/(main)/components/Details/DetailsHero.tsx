import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import { IoImagesOutline } from "react-icons/io5";
import type { PropertyDetails } from "./Details";

interface DetailsHeroProps {
  property: PropertyDetails;
}

export default function DetailsHero({ property }: DetailsHeroProps) {
  const heroImage =
    property.images[0]?.url ||
    "/assets/images/pexels-littlehampton-bricks-2717960-4626257.jpg";

  return (
    <>
      <div className="mt-[64px] overflow-x-clip bg-[#1E40AF] text-white w-full">
        
        <div className="w-full shadow border-b border-blue-800 py-3">
          <div className="mx-auto max-w-[1280px] px-5 md:px-[100px] flex justify-start items-center gap-2">
            <Link className="flex items-center gap-2 text-md hover:translate-x-[-5px] transition-all duration-300" href="/properties">
              <FaArrowLeft />
              Back to Properties
            </Link>
          </div>
        </div>

        <div className="relative w-full h-[400px]">
          <Image
            src={heroImage}
            alt={property.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto max-w-[1280px] px-5 md:px-[100px] pb-5">
              <span className="cursor-pointer ml-[20px] inline-flex items-center gap-1 text-black bg-white/90 backdrop-blur-sm rounded-[5px] p-[9px] px-[25px] text-[12px] font-bold shadow-md">
                <IoImagesOutline size={14} />
                {property.images.length} Photos
              </span>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}