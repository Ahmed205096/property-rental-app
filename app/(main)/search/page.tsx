import Hero from "../components/Home/Hero/Hero";
import RecentCards from "../components/Home/Items/Cards/RecentCards";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{
    search?: string;
    location?: string;
  }>;
}

interface SearchProperty {
  _id: string;
  type: string;
  title: string;
  beds: number;
  baths: number;
  sqft: number;
  location: {
    city: string;
    state: string;
  };
  rates: {
    monthly?: number;
    weekly?: number;
    nightly?: number;
  };
  images: {
    url: string;
    public_id: string;
  }[];
}

const fallbackImage =
  "/assets/images/pexels-littlehampton-bricks-2717960-4626257.jpg";

async function getSearchResults(search: string) {
  if (!search) {
    return [];
  }

  const baseUrl = process.env.NEXT_PUBLIC_URL;
  const searchPath = process.env.NEXT_PUBLIC_API_SEARCH;

  if (!baseUrl || !searchPath) {
    throw new Error("Search API URL is not configured.");
  }

  const response = await fetch(
    `${baseUrl}${searchPath}?search=${encodeURIComponent(search)}`,
    { cache: "no-store" },
  );

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new Error("Failed to load search results.");
  }

  return (await response.json()) as SearchProperty[];
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { search = "", location = "" } = await searchParams;
  const keyword = search.trim();
  const selectedLocation = location.trim();
  const queryParts = [keyword, selectedLocation].filter(Boolean);
  const query = queryParts.join(" ");
  const displayQuery = queryParts.join(" • ");
  const properties = await getSearchResults(query);

  return (
    <>
      <Hero />
      <main className="min-h-screen bg-[#f7f8fc] pb-16 pt-12">
        <div className="mx-auto max-w-[1280px] px-5 md:px-[100px]">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#1E40AF]">
              Search Results
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">
              {displayQuery
                ? `Results for "${displayQuery}"`
                : "Search properties"}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {properties.length}{" "}
              {properties.length === 1 ? "property" : "properties"} found
            </p>
          </div>

          {!query && (
            <div className="rounded-[8px] border border-gray-200 bg-white p-6 text-sm font-medium text-gray-600">
              Enter a city, state, street, zip code, or keyword from the home
              search.
            </div>
          )}

          {query && properties.length === 0 && (
            <div className="rounded-[8px] border border-gray-200 bg-white p-6 text-sm font-medium text-gray-600">
              No properties matched your search.
            </div>
          )}

          {properties.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <RecentCards
                  key={property._id}
                  id={property._id}
                  title={property.type}
                  description={property.title}
                  beds_number={property.beds}
                  baths_number={property.baths}
                  sqft={property.sqft}
                  price={
                    property.rates.monthly ||
                    property.rates.weekly ||
                    property.rates.nightly ||
                    0
                  }
                  location={`${property.location.city}, ${property.location.state}`}
                  image={property.images[0]?.url || fallbackImage}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
