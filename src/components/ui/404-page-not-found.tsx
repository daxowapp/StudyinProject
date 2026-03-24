"use client";

import React from "react";
import Link from "next/link";

export const NotFoundPage = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-blue-50 to-white">
      {/* 404 Number */}
      <h1 className="text-[120px] sm:text-[160px] md:text-[200px] font-bold leading-none text-blue-600/10 select-none">
        404
      </h1>

      {/* Icon */}
      <div className="-mt-10 sm:-mt-14 md:-mt-16 mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 sm:h-20 sm:w-20 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      </div>

      {/* Text */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 text-center">
        Page Not Found
      </h2>
      <p className="text-gray-500 mt-3 text-center max-w-md text-sm sm:text-base">
        Sorry, the page you are looking for doesn&apos;t exist or has been moved.
      </p>

      {/* Button */}
      <Link
        href="/"
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 mt-8 rounded-lg transition-colors duration-200 text-sm sm:text-base font-medium shadow-md hover:shadow-lg"
        title="Return Home"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        <span>Return Home</span>
      </Link>
    </div>
  );
};
