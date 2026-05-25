import { notFound } from "next/navigation";
import Details, {
  type PropertyDetails,
} from "../../components/Details/Details";

export const dynamic = "force-dynamic";

interface DetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getProperty(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_URL;
  const propertyPath = process.env.NEXT_PUBLIC_API_GET_SECIFIC_PROPERTIES;

  if (!baseUrl || !propertyPath) {
    throw new Error("Property details API URL is not configured.");
  }

  const response = await fetch(`${baseUrl}${propertyPath}${id}`);

  if (response.status === 404 || response.status === 400) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("Failed to load property details.");
  }

  return (await response.json()) as PropertyDetails;
}

export default async function DetailsPage({ params }: DetailsPageProps) {
  const { id } = await params;
  const property = await getProperty(id);

  return <Details property={property} />;
}
