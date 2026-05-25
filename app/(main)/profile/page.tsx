import type { Metadata } from "next";
import Profile from "../components/Profile/Profile";

export const metadata: Metadata = {
  title: "Your Profile - PropertyPulse",
  description: "Manage your profile details and listed properties.",
};

export default function ProfilePage() {
  return <Profile />;
}
