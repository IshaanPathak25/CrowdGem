"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createHotspot } from "../../lib/utils/api-client";
import UploadThingUploader from "../components/ui/UploadThingUploader";
import CityAutoSuggest from "../components/ui/CityAutoSuggest";

export default function AddHotspot() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    category: "",
    description: "",
    averageSpend: "", 
    image: "", 
    addedBy: "Anonymous", 
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "averageSpend" ? (value === "" ? "" : Number(value)) : value,
    }));

    if (errors[id]) {
      setErrors((prev) => ({
        ...prev,
        [id]: "",
      }));
    }
  };

  const handleImageUploadComplete = (url) => {
    setFormData((prev) => ({
      ...prev,
      image: url,
    }));

    setImagePreview(url);

    if (errors.image) {
      setErrors((prev) => ({
        ...prev,
        image: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";

    if (formData.averageSpend === "" || isNaN(formData.averageSpend)) {
      newErrors.averageSpend = "Average spend amount is required";
    } else if (formData.averageSpend < 0) {
      newErrors.averageSpend = "Average spend cannot be negative";
    }

    if (!formData.image) newErrors.image = "An image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const hotspot = await createHotspot(formData);

      router.push(`/hotspot/${hotspot._id}`);
    } catch (error) {
      console.error("Error submitting hotspot:", error);
      setSubmitError(
        error.message || "Failed to create hotspot. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      

      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-6">Add a New Hotspot</h1>

        {submitError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-2"
              >
                Hotspot Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.name ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter the name of the place"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-gray-700 font-medium mb-2"
              >
                Location
              </label>
              <CityAutoSuggest
                value={formData.location}
                onChange={handleChange}
                error={errors.location}
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-gray-700 font-medium mb-2"
              >
                Category
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.category ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Select a category</option>
                <option value="food">Food</option>
                <option value="parks">Parks</option>
                <option value="nightlife">Nightlife</option>
                <option value="shopping">Shopping</option>
                <option value="culture">Culture</option>
                <option value="activities">Activities</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="averageSpend"
                className="block text-gray-700 font-medium mb-2"
              >
                Average Spend per Person ($)
              </label>
              <input
                type="number"
                id="averageSpend"
                value={formData.averageSpend}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full px-4 py-2 border ${errors.averageSpend ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="25"
              />
              {errors.averageSpend && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.averageSpend}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="block text-gray-700 font-medium mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.description ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Tell us about this place..."
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="image"
                className="block text-gray-700 font-medium mb-2"
              >
                Upload Image
              </label>
              <UploadThingUploader
                onUploadComplete={handleImageUploadComplete}
              />
              {imagePreview && (
                <div className="mt-2 text-sm text-green-600">
                  Image uploaded successfully!
                </div>
              )}
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">{errors.image}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="addedBy"
                className="block text-gray-700 font-medium mb-2"
              >
                Your Name (Optional)
              </label>
              <input
                type="text"
                id="addedBy"
                value={formData.addedBy}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Anonymous"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Link href="/">
              <button
                type="button"
                className="mr-4 px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-md disabled:bg-blue-400 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Hotspot"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}