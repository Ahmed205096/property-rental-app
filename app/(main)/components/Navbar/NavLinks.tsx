import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoSearch } from "react-icons/io5";
import { GoHome } from "react-icons/go";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import { MdFavoriteBorder } from "react-icons/md";

interface IProps {
  isMobile: boolean;
}

export default function NavLinks({ isMobile }: IProps) {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home", icon: GoHome },
    { href: "/properties", label: "Properties", icon: IoSearch },
    {
      href: "/add-property",
      label: "Add Property",
      icon: IoMdAddCircleOutline,
    },

    {
      href: "/profile",
      label: "Favorit",
      icon: MdFavoriteBorder,
      mobileOnly: true,
    },
    { href: "/profile", label: "Profile", icon: FaRegUser, mobileOnly: true },
  ];

  const activeColor = "text-[#1E40AF]";
  const activeIconColor = "#1E40AF";

  if (!isMobile) {
    return (
      <div className="flex justify-between text-gray-600 text-[13px] font-bold items-center w-[300px]">
        {links
          .filter((link) => !link.mobileOnly)
          .map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative transition-colors duration-300 group ${isActive ? activeColor : "hover:text-[#1E40AF]"}`}
              >
                {link.label}
                <span
                  className={`absolute bottom-[-10px] left-1/2 -translate-x-1/2 h-[2px] bg-[#1E40AF] transition-all ${
                    isActive ? "w-full" : "w-0 group-hover:w-full duration-300"
                  }`}
                ></span>
              </Link>
            );
          })}
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] h-[65px] px-6 py-2 z-50">
      <div className="flex justify-between items-center text-gray-600 text-[12px] h-full">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={`${link.label}-${link.href}`}
              href={link.href}
              className={`flex flex-col justify-center items-center flex-1 h-full transition-colors duration-300 ${
                isActive ? activeColor : "hover:text-[#1E40AF]"
              }`}
            >
              <Icon
                size={22}
                color={isActive ? activeIconColor : "black"}
                className="transition-colors duration-300"
              />
              <p className="mt-[4px] font-medium">
                {link.label === "Add Property" ? "Add" : link.label}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
