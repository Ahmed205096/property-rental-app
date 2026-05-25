"use client";

import React, { useState, useEffect } from "react";
import { IoCloudUploadOutline, IoClose } from "react-icons/io5";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { useDropzone } from "react-dropzone";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";

async function fileToBase64(file: File) {
  const fileBuffer = await file.arrayBuffer();
  const fileArray = Array.from(new Uint8Array(fileBuffer));
  const fileData = Buffer.from(fileArray);
  const base64String = fileData.toString("base64");

  return {
    base64Data: `data:${file.type};base64,${base64String}`,
    mimeType: file.type,
  };
}

const initialFormState = {
  type: "Apartment",
  name: "",
  description: "",
  location: {
    street: "",
    city: "",
    state: "",
    zipcode: "",
  },
  beds: 1,
  baths: 1,
  square_feet: 1200,
  amenities: [] as string[],
  rates: {
    nightly: "",
    weekly: "",
    monthly: "",
  },
};

const AMENITIES_LIST = [
  "Wifi",
  "Full Kitchen",
  "Washer & Dryer",
  "Free Parking",
  "Swimming Pool",
  "Hot Tub",
  "24/7 Security",
  "Gym/Fitness Center",
  "Air Conditioning",
];

const PROPERTY_TYPES = [
  "Apartment",
  "House",
  "Condo",
  "Cabin",
  "Chalet",
  "Studio",
  "Loft",
  "Penthouse",
  "Duplex",
  "Other",
];

interface ImagePreview {
  id: string;
  url: string;
  name: string;
  file?: File;
  isExisting?: boolean;
  rawObject?: { url: string; public_id: string };
}

export default function AddPropertyForm() {
  const session = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get("edit");

  const [form, setForm] = useState(initialFormState);
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string>("");

  useEffect(() => {
    if (!editId) {
      setForm(initialFormState);
      setImages([]);
      return;
    }

    const fetchPropertyDetails = async () => {
      setLoading(true);
      setError(null);
      setSubmitMessage("Loading property details...");
      try {
        const baseUrl = process.env.NEXT_PUBLIC_URL || "";
        const propertyPath =
          process.env.NEXT_PUBLIC_API_GET_SECIFIC_PROPERTIES || "/api/property/";
        const response = await fetch(`${baseUrl}${propertyPath}${editId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch property details.");
        }

        const property = await response.json();

        // Populate form
        setForm({
          type: property.type || "Apartment",
          name: property.title || "",
          description: property.description || "",
          location: {
            street: property.location?.street || "",
            city: property.location?.city || "",
            state: property.location?.state || "",
            zipcode: property.location?.zipcode || "",
          },
          beds: property.beds || 1,
          baths: property.baths || 1,
          square_feet: property.sqft || 1200,
          amenities: property.amenities || [],
          rates: {
            nightly:
              property.rates?.nightly !== undefined &&
              property.rates?.nightly !== 0
                ? String(property.rates.nightly)
                : "",
            weekly:
              property.rates?.weekly !== undefined &&
              property.rates?.weekly !== 0
                ? String(property.rates.weekly)
                : "",
            monthly:
              property.rates?.monthly !== undefined &&
              property.rates?.monthly !== 0
                ? String(property.rates.monthly)
                : "",
          },
        });

        // Populate images
        if (property.images && Array.isArray(property.images)) {
          const initialImages = property.images.map((img: any) => ({
            id: img.public_id || Math.random().toString(),
            url: img.url,
            name: img.public_id?.split("/").pop() || "image",
            isExisting: true,
            rawObject: img,
          }));
          setImages(initialImages);
        }
      } catch (err) {
        console.error("Error loading property for edit:", err);
        setError("Failed to load property details. Please try again.");
      } finally {
        setLoading(false);
        setSubmitMessage("");
      }
    };

    fetchPropertyDetails();
  }, [editId]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedInputChange = (
    section: "location" | "rates",
    field: string,
    value: string | number,
  ) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleAmenityChange = (amenity: string) => {
    setForm((prev) => {
      const isChecked = prev.amenities.includes(amenity);
      const updatedAmenities = isChecked
        ? prev.amenities.filter((item) => item !== amenity)
        : [...prev.amenities, amenity];
      return {
        ...prev,
        amenities: updatedAmenities,
      };
    });
  };

  const processFiles = (fileList: FileList | File[]) => {
    const newImages: ImagePreview[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        newImages.push({
          id: Math.random().toString(36).substring(2, 9),
          url,
          name: file.name,
          file,
        });
      }
    }
    setImages((prev) => [...prev, ...newImages]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxSize: 5242880,
    onDrop: (acceptedFiles) => {
      processFiles(acceptedFiles);
    },
  });

  const removeImage = (id: string, url: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    if (url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Listing name is required.";
    if (!form.description.trim()) return "Description is required.";
    if (!form.location.street.trim()) return "Street address is required.";
    if (!form.location.city.trim()) return "City is required.";
    if (!form.location.state.trim()) return "State is required.";
    if (!form.location.zipcode.trim()) return "Zip code is required.";
    if (form.beds < 0) return "Beds cannot be negative.";
    if (form.baths < 0) return "Baths cannot be negative.";
    if (form.square_feet <= 0) return "Square feet must be greater than zero.";
    if (images.length === 0) return "Please upload at least one image.";

    if (!form.rates.nightly && !form.rates.weekly && !form.rates.monthly) {
      return "Please enter at least one rate (Nightly, Weekly, or Monthly).";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoading(true);
    setSubmitMessage(
      editId ? "Updating property details..." : "Preparing property images..."
    );

    try {
      const imagePayloads: any[] = [];
      const newImagesToConvert = images.filter((img) => !img.isExisting && img.file);

      setSubmitMessage(
        newImagesToConvert.length > 0
          ? `Processing ${newImagesToConvert.length} new image(s)...`
          : "Saving property details..."
      );

      // Convert new images to base64
      const base64ImagesPromises = newImagesToConvert.map((img) =>
        fileToBase64(img.file!)
      );
      const base64Results = await Promise.all(base64ImagesPromises);
      const base64Strings = base64Results.map((res) => res.base64Data);

      // Construct final images array
      let newImageIndex = 0;
      for (const img of images) {
        if (img.isExisting && img.rawObject) {
          imagePayloads.push(img.rawObject);
        } else {
          imagePayloads.push(base64Strings[newImageIndex]);
          newImageIndex++;
        }
      }

      const payload = {
        owner: session?.data?.user?.id,
        type: form.type,
        title: form.name,
        description: form.description,
        location: form.location,
        beds: Number(form.beds),
        baths: Number(form.baths),
        sqft: Number(form.square_feet),
        amenities: form.amenities,
        rates: {
          nightly: Number(form.rates.nightly) || 0,
          weekly: Number(form.rates.weekly) || 0,
          monthly: Number(form.rates.monthly) || 0,
        },
        images: imagePayloads,
      };

      const url = editId
        ? `${process.env.NEXT_PUBLIC_URL}${
            process.env.NEXT_PUBLIC_API_UPDATE_PROPERTY || "/api/property"
          }?id=${editId}`
        : `${process.env.NEXT_PUBLIC_URL}${
            process.env.NEXT_PUBLIC_API_ADD_PROPERTY || "/api/property"
          }`;

      const method = editId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        const details =
          typeof result.details === "string"
            ? result.details
            : result.details?.message;

        throw new Error(
          details ||
            result.error ||
            `Failed to ${editId ? "update" : "add"} property`
        );
      }

      setSuccess(true);
      if (!editId) {
        setForm(initialFormState);
        setImages([]);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });

      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (err) {
      console.error("Error submitting property:", err);
      const message =
        err instanceof Error
          ? err.message
          : `Something went wrong while saving the property.`;

      setError(message);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
      setSubmitMessage("");
    }
  };

  return (
    <div className="mt-[60px] pb-[80px] pt-[40px] px-[20px] bg-[#f7f8fc] flex-grow flex justify-center items-center">
      <div className="w-full max-w-[800px] bg-white border border-gray-300 rounded-[12px] p-[24px] md:p-[40px] shadow-sm">
        <h2 className="text-[#1E40AF] font-bold text-[28px] leading-tight mb-[4px]">
          {editId ? "Edit Property" : "Add Property"}
        </h2>
        <p className="text-gray-600 text-[14px] mb-[24px]">
          {editId
            ? "Modify the details below to update your property listing on PropertyPulse."
            : "Fill out the information below to list your property on PropertyPulse."}
        </p>

        {success && (
          <div className="mb-[24px] flex items-start gap-3 bg-[#e6f4ea] border border-[#a3cfbb] text-[#137333] p-[16px] rounded-[8px] animate-fadeIn">
            <FiCheckCircle size={20} className="shrink-0 mt-[2px]" />
            <div>
              <p className="font-bold text-[14px]">Success!</p>
              <p className="text-[13px] text-[#137333]/90">
                Your property has been {editId ? "updated" : "listed"} successfully and saved to database!
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-[24px] flex items-start gap-3 bg-[#fce8e6] border border-[#f5c2c7] text-[#c5221f] p-[16px] rounded-[8px] animate-fadeIn">
            <FiAlertCircle size={20} className="shrink-0 mt-[2px]" />
            <div>
              <p className="font-bold text-[14px]">Error</p>
              <p className="text-[13px] text-[#c5221f]/90">{error}</p>
            </div>
          </div>
        )}

        {loading && (
          <div
            className="mb-[24px] flex items-start gap-3 rounded-[8px] border border-blue-200 bg-blue-50 p-[16px] text-[#1E40AF]"
            role="status"
            aria-live="polite"
          >
            <span className="mt-[2px] h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-[#1E40AF]/25 border-t-[#1E40AF]" />
            <div>
              <p className="font-bold text-[14px]">
                {editId ? "Updating your listing" : "Uploading your listing"}
              </p>
              <p className="text-[13px] leading-5 text-[#1E40AF]/80">
                {submitMessage ||
                  (editId
                    ? "Updating property details. Please keep this page open."
                    : "Uploading images and saving your property. Please keep this page open.")}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-[28px]">
          <div>
            <h3 className="font-bold text-[#1E40AF] text-[18px]">Basic Info</h3>
            <hr className="border-gray-200 mt-[6px] mb-[16px]" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] mb-[16px]">
              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-bold text-gray-700">
                  Property Type
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleInputChange}
                  className="w-full h-[44px] px-[12px] bg-white border border-gray-300 rounded-[6px] text-gray-800 text-[14px] outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] transition-all cursor-pointer"
                >
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-bold text-gray-700">
                  Listing Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Modern Urban Loft"
                  className="w-full h-[44px] px-[12px] bg-white border border-gray-300 rounded-[6px] text-[14px] outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] transition-all"
                />
              </div>
            </div>
            <div className="flex flex-col gap-[6px]">
              <label className="text-[13px] font-bold text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleInputChange}
                placeholder="Describe the unique features of your property..."
                rows={5}
                className="w-full p-[12px] bg-white border border-gray-300 rounded-[6px] text-[14px] outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] transition-all resize-y"
              />
            </div>
          </div>

          <div>
            <h3 className="font-bold text-[#1E40AF] text-[18px]">Location</h3>
            <hr className="border-gray-200 mt-[6px] mb-[16px]" />
            <div className="flex flex-col gap-[6px] mb-[16px]">
              <label className="text-[13px] font-bold text-gray-700">
                Street Address
              </label>
              <input
                type="text"
                value={form.location.street}
                onChange={(e) =>
                  handleNestedInputChange("location", "street", e.target.value)
                }
                placeholder="123 Ocean Drive"
                className="w-full h-[44px] px-[12px] bg-white border border-gray-300 rounded-[6px] text-[14px] outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] transition-all"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-bold text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  value={form.location.city}
                  onChange={(e) =>
                    handleNestedInputChange("location", "city", e.target.value)
                  }
                  placeholder="Miami"
                  className="w-full h-[44px] px-[12px] bg-white border border-gray-300 rounded-[6px] text-[14px] outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] transition-all"
                />
              </div>
              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-bold text-gray-700">
                  State
                </label>
                <input
                  type="text"
                  value={form.location.state}
                  onChange={(e) =>
                    handleNestedInputChange("location", "state", e.target.value)
                  }
                  placeholder="FL"
                  className="w-full h-[44px] px-[12px] bg-white border border-gray-300 rounded-[6px] text-[14px] outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] transition-all"
                />
              </div>
              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-bold text-gray-700">
                  Zip Code
                </label>
                <input
                  type="text"
                  value={form.location.zipcode}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "location",
                      "zipcode",
                      e.target.value,
                    )
                  }
                  placeholder="33139"
                  className="w-full h-[44px] px-[12px] bg-white border border-gray-300 rounded-[6px] text-[14px] outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-[#1E40AF] text-[18px]">
              Details & Amenities
            </h3>
            <hr className="border-gray-200 mt-[6px] mb-[16px]" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] mb-[20px]">
              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-bold text-gray-700">
                  Beds
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.beds}
                  onChange={handleInputChange}
                  name="beds"
                  className="w-full h-[44px] px-[12px] bg-white border border-gray-300 rounded-[6px] text-[14px] outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] transition-all"
                />
              </div>
              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-bold text-gray-700">
                  Baths
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.baths}
                  onChange={handleInputChange}
                  name="baths"
                  className="w-full h-[44px] px-[12px] bg-white border border-gray-300 rounded-[6px] text-[14px] outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] transition-all"
                />
              </div>
              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-bold text-gray-700">
                  Sq Ft
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.square_feet}
                  onChange={handleInputChange}
                  name="square_feet"
                  className="w-full h-[44px] px-[12px] bg-white border border-gray-300 rounded-[6px] text-[14px] outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] transition-all"
                />
              </div>
            </div>
            <div className="flex flex-col gap-[8px]">
              <label className="text-[13px] font-bold text-gray-700">
                Amenities
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-[10px] gap-x-[16px]">
                {AMENITIES_LIST.map((amenity) => {
                  const isChecked = form.amenities.includes(amenity);
                  return (
                    <label
                      key={amenity}
                      className="flex items-center gap-[10px] text-[14px] text-gray-700 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleAmenityChange(amenity)}
                        className="w-[16px] h-[16px] border border-gray-300 rounded text-[#1E40AF] focus:ring-[#1E40AF] cursor-pointer"
                      />
                      <span>{amenity}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-[#1E40AF] text-[18px]">
              Rates (USD)
            </h3>
            <hr className="border-gray-200 mt-[6px] mb-[16px]" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-bold text-gray-700">
                  Nightly Rate
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-[12px] text-gray-500 text-[14px]">
                    $
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={form.rates.nightly}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "rates",
                        "nightly",
                        e.target.value,
                      )
                    }
                    placeholder="150"
                    className="w-full h-[44px] pl-[26px] pr-[12px] bg-white border border-gray-300 rounded-[6px] text-[14px] outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] transition-all"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-bold text-gray-700">
                  Weekly Rate
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-[12px] text-gray-500 text-[14px]">
                    $
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={form.rates.weekly}
                    onChange={(e) =>
                      handleNestedInputChange("rates", "weekly", e.target.value)
                    }
                    placeholder="900"
                    className="w-full h-[44px] pl-[26px] pr-[12px] bg-white border border-gray-300 rounded-[6px] text-[14px] outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] transition-all"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-bold text-gray-700">
                  Monthly Rate
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-[12px] text-gray-500 text-[14px]">
                    $
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={form.rates.monthly}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "rates",
                        "monthly",
                        e.target.value,
                      )
                    }
                    placeholder="3200"
                    className="w-full h-[44px] pl-[26px] pr-[12px] bg-white border border-gray-300 rounded-[6px] text-[14px] outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-[#1E40AF] text-[18px]">
              Property Images
            </h3>
            <hr className="border-gray-200 mt-[6px] mb-[16px]" />
            <div
              {...getRootProps()}
              className={`w-full min-h-[160px] border-2 border-dashed rounded-[10px] p-[24px] flex flex-col justify-center items-center gap-[10px] cursor-pointer transition-all ${
                isDragActive
                  ? "border-[#1E40AF] bg-[#eff3ff]"
                  : "border-gray-300 bg-[#fbfbfe] hover:bg-[#f1f4fe]"
              }`}
            >
              <input {...getInputProps()} />
              <IoCloudUploadOutline size={36} className="text-gray-400" />
              <div className="text-center">
                <p className="text-[14px] font-medium text-gray-700">
                  Drag and drop images or{" "}
                  <span className="text-[#1E40AF] font-bold underline">
                    click to browse
                  </span>
                </p>
                <p className="text-[12px] text-gray-400 mt-[4px]">
                  Supported formats: JPG, PNG (Max 5MB per file)
                </p>
              </div>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-[12px] mt-[16px]">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="relative group aspect-square rounded-[8px] overflow-hidden border border-gray-200 bg-gray-50"
                  >
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(img.id, img.url);
                      }}
                      className="absolute top-[6px] right-[6px] p-[4px] rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors shadow-sm cursor-pointer"
                    >
                      <IoClose size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[50px] bg-[#1E40AF] hover:bg-[#1a3899] text-white font-bold rounded-[8px] flex items-center justify-center gap-[8px] transition-all shadow-sm mt-[8px] disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>{editId ? "Updating property..." : "Uploading images..."}</span>
              </>
            ) : (
              <>
                <IoMdAddCircleOutline size={20} />
                <span>{editId ? "Update Property" : "Add Property"}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
