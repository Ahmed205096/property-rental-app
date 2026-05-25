import Link from "next/link";

interface IProps {
  title: string;
  body: string;
  button_message: string;
  button_color: string;
  link_path: string;
}

export default function WelcomeCards({
  title,
  body,
  button_message,
  button_color,
  link_path
}: IProps) {
  return (
    <span className="flex flex-col">
      <h4 className="text-black font-bold">{title}</h4>
      <p className="mt-[10px] text-gray-500 text-[13px] ">{body}</p>
      <Link href={link_path}>
        <button
          className={`mt-[20px] ${button_color} w-[170px] py-[9px] text-[15px] cursor-pointer rounded-[5px] text-white`}
        >
          {button_message}
        </button>
      </Link>
    </span>
  );
}
