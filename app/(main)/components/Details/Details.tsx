import Bagenation from "./Bagenation";
import DetailsHero from "./DetailsHero";
import LeftContent from "./LeftContent";
import RightContent from "./RightContent";

export interface PropertyDetails {
  _id: string;
  owner: string;
  type: string;
  title: string;
  description: string;
  location: {
    city: string;
    state: string;
    zipcode: string;
    street: string;
  };
  beds: number;
  baths: number;
  sqft: number;
  amenities: string[];
  rates: {
    nightly?: number;
    weekly?: number;
    monthly?: number;
  };
  images: {
    url: string;
    public_id: string;
  }[];
}

interface DetailsProps {
  property: PropertyDetails;
}

export default function Details({ property }: DetailsProps) {
  return (
    <>
      <div className="w-full">
        <DetailsHero property={property} />
        
        <div className="mx-auto max-w-[1280px] px-5 md:px-[100px] mb-[60px]">
          
          <div className="grid grid-cols-1 lg:grid-cols-6 w-full mt-[30px] gap-6">
            <LeftContent property={property} />
            <RightContent property={property} />
          </div>
          
          <Bagenation images={property.images.map((image) => image.url)} />
          
        </div>
      </div>
    </>
  );
}