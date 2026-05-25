"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface PropertyGalleryProps {
  images: string[];
}

export default function PropertyGallery({ images }: PropertyGalleryProps) {
  const galleryImages = images.length
    ? images
    : ["/assets/images/pexels-littlehampton-bricks-2717960-4626257.jpg"];

  const [index, setIndex] = useState<number>(-1);
  const images_count = galleryImages.length - 1;
  const isOdd = galleryImages.length % 2 !== 0;

  const slides = galleryImages.map((src) => ({ src }));

  return (
    <div className="relative flex flex-col w-full mb-10 mt-[40px]">
      <p className="mb-[20px] text-[20px] font-bold text-[#1E40AF] text-center">
        Property Gallery
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {galleryImages.map((src, idx) => (
          <div
            key={idx}
            onClick={() => setIndex(idx)}
            className={`relative h-[250px] md:h-[300px] w-full rounded-[10px] overflow-hidden cursor-pointer shadow-sm
              ${idx === images_count && isOdd ? "md:col-span-2" : "col-span-1"}
            `}
          >
            <Image
              src={src}
              alt="Property"
              fill
              className="object-cover hover:scale-105 duration-300"
            />
          </div>
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={slides}
      />
    </div>
  );
}
