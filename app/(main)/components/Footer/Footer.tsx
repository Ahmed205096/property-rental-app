import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#d7daf1] max-sm:mb-[1000px] shadow border-t border-gray-300">
      
      <div className="mx-auto flex flex-col md:flex-row max-w-[1280px] min-h-[100px] md:h-[100px] items-center justify-between px-5 md:px-[100px] py-6 md:py-0 gap-6 md:gap-0">
        
        <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left">
          <h3 className="font-bold text-[18px] mb-[2px] text-[#1E40AF]">PropertyPulse</h3>
          <p className="text-gray-600 text-[14px] max-sm:text-[11px]">
            &copy; {new Date().getFullYear()} PropertyPulse. All rights reserved.
          </p>
        </div>

        <div className="text-gray-600 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 max-sm:text-[12px] md:text-[13px] font-semibold">
          <Link href="/" className="hover:text-[#1E40AF] transition-colors whitespace-nowrap">Privacy Policy</Link>
          <Link href="/" className="hover:text-[#1E40AF] transition-colors whitespace-nowrap">Terms of Service</Link>
          <Link href="/" className="hover:text-[#1E40AF] transition-colors whitespace-nowrap">Contact Us</Link>
          <Link href="/" className="hover:text-[#1E40AF] transition-colors whitespace-nowrap">Careers</Link>
        </div>

      </div>
      <div className="max-sm:h-[50px] w-full"></div>
    </footer>
  );
}