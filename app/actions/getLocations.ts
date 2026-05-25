"use server";

import Property from "../db/models/Property";
import dbConnect from "../db/mongo";

export interface ILocations {
  cities: string[];
  streets: string[];
  zipcodes: string[];
  states: string[];
}

interface ILocationGroupItem {
  _id: string | null;
}

interface ILocationAggregation {
  cities: ILocationGroupItem[];
  streets: ILocationGroupItem[];
  zipcodes: ILocationGroupItem[];
  states: ILocationGroupItem[];
}

const emptyLocations: ILocations = {
  cities: [],
  streets: [],
  zipcodes: [],
  states: [],
};

function hasLocationValue(value: string | null): value is string {
  return Boolean(value);
}

export default async function getLocations() {
  try {
    await dbConnect();
    const result = await Property.aggregate<ILocationAggregation>([
      {
        $facet: {
          cities: [{ $group: { _id: "$location.city" } }],
          streets: [{ $group: { _id: "$location.street" } }],
          zipcodes: [{ $group: { _id: "$location.zipcode" } }],
          states: [{ $group: { _id: "$location.state" } }],
        },
      },
    ]);

    const all_locations: ILocations = {
      cities: result[0].cities.map((item) => item._id).filter(hasLocationValue),
      streets: result[0].streets
        .map((item) => item._id)
        .filter(hasLocationValue),
      zipcodes: result[0].zipcodes
        .map((item) => item._id)
        .filter(hasLocationValue),
      states: result[0].states.map((item) => item._id).filter(hasLocationValue),
    };
    return all_locations;
  } catch {
    return emptyLocations;
  }
}
