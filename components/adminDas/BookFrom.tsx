// components/forms/BookForm.tsx
"use client";

import { createBook } from "@/app/lib/api/books";
import { createBookGraphQL } from "@/app/lib/GraphQl/books";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  publicationDate: string;
  genre: string;
  copies: number;
  description?: string;
  publisher?: string;
}

interface BookFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function BookForm({ onSuccess, onCancel }: BookFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookFormData>();

  const genres = [
    "Fiction",
    "Non-Fiction",
    "Science Fiction",
    "Fantasy",
    "Mystery",
    "Thriller",
    "Romance",
    "Horror",
    "Biography",
    "History",
    "Science",
    "Technology",
    "Children",
    "Young Adult",
    "Poetry",
    "Drama",
    "Comedy",
    "Academic",
    "Other",
  ];

  const onSubmit = async (data: BookFormData) => {
    setIsLoading(true);

    try {
      if (process.env.NEXT_PUBLIC_ENABLE_GRAPHQL) {
        console.log(`ENV:${process.env.NEXT_PUBLIC_ENABLE_GRAPHQL}`);
        const res = await createBookGraphQL(data);

        if (res.data?.createBook?.success) {
          toast.success(res.data.createBook.message);
          reset();
          onSuccess?.();
        } else {
          toast.error(res.errors?.[0]?.message || "Error creating book");
        }
        return;
      }

      const res = await createBook(data);
      if (res.success) {
        toast.success("Book added successfully!");
        reset();
        onSuccess?.();
      }
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Add New Book</h2>
        <p className="text-gray-600 mt-1">
          Enter book details to add to library inventory
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Book Title *
          </label>
          <input
            id="title"
            type="text"
            {...register("title", {
              required: "Book title is required",
              minLength: {
                value: 1,
                message: "Title must be at least 1 character",
              },
            })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
              errors.title
                ? "border-red-300 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            }`}
            placeholder="Enter book title"
          />
          {errors.title && (
            <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Author */}
        <div>
          <label
            htmlFor="author"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Author *
          </label>
          <input
            id="author"
            type="text"
            {...register("author", {
              required: "Author name is required",
              minLength: {
                value: 2,
                message: "Author name must be at least 2 characters",
              },
            })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
              errors.author
                ? "border-red-300 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            }`}
            placeholder="Enter author name"
          />
          {errors.author && (
            <p className="mt-2 text-sm text-red-600">{errors.author.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ISBN */}
          <div>
            <label
              htmlFor="isbn"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              ISBN *
            </label>
            <input
              id="isbn"
              type="text"
              {...register("isbn", {
                required: "ISBN is required",
                pattern: {
                  value: /^(?:\d{10}|\d{13})$/,
                  message: "ISBN must be 10 or 13 digits",
                },
              })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
                errors.isbn
                  ? "border-red-300 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
              placeholder="Enter ISBN (10 or 13 digits)"
            />
            {errors.isbn && (
              <p className="mt-2 text-sm text-red-600">{errors.isbn.message}</p>
            )}
          </div>

          {/* Publication Date */}
          <div>
            <label
              htmlFor="publicationDate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Publication Date *
            </label>
            <input
              id="publicationDate"
              type="date"
              {...register("publicationDate", {
                required: "Publication date is required",
              })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
                errors.publicationDate
                  ? "border-red-300 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
            />
            {errors.publicationDate && (
              <p className="mt-2 text-sm text-red-600">
                {errors.publicationDate.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Genre */}
          <div>
            <label
              htmlFor="genre"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Genre *
            </label>
            <select
              id="genre"
              {...register("genre", {
                required: "Genre is required",
              })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
                errors.genre
                  ? "border-red-300 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
            >
              <option value="">Select a genre</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
            {errors.genre && (
              <p className="mt-2 text-sm text-red-600">
                {errors.genre.message}
              </p>
            )}
          </div>

          {/* Number of Copies */}
          <div>
            <label
              htmlFor="copies"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Number of Copies *
            </label>
            <input
              id="copies"
              type="number"
              min="1"
              max="1000"
              {...register("copies", {
                required: "Number of copies is required",
                min: {
                  value: 1,
                  message: "Must have at least 1 copy",
                },
                max: {
                  value: 1000,
                  message: "Cannot exceed 1000 copies",
                },
                valueAsNumber: true,
              })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
                errors.copies
                  ? "border-red-300 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
              placeholder="Enter number of copies"
            />
            {errors.copies && (
              <p className="mt-2 text-sm text-red-600">
                {errors.copies.message}
              </p>
            )}
          </div>
        </div>

        {/* Publisher (Optional) */}
        <div>
          <label
            htmlFor="publisher"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Publisher
          </label>
          <input
            id="publisher"
            type="text"
            {...register("publisher")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Enter publisher name (optional)"
          />
        </div>

        {/* Description (Optional) */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            {...register("description")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Enter book description (optional)"
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Adding Book...</span>
              </>
            ) : (
              <span>Add Book</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
