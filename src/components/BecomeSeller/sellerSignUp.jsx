import Image from "next/image";
import React from "react";
import SellerRegistrationForm from "./registration";

function SellerSignUpForm() {
  return (
    <div className="w-full flex flex-col lg:flex-row min-h-screen">
      {/* Image Section - Hidden on small mobile, shown from medium screens up */}
      <div className="hidden sm:block sm:w-full lg:w-1/2 relative">
        <Image
          src="/assets/becomeSeller/getReady.jpeg"
          alt="seller get started"
          fill
          className="object-cover"
          priority
          quality={100}
        />
        {/* Reddish opacity overlay */}
        <div className="absolute inset-0 bg-red-700 opacity-50 blend-multiply"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10  min-w-[80%]">
          <h1 className="text-6xl font-bold font-comfortaa text-white ">
            Ready to get started?
          </h1>
          <p className="text-white text-3xl mt-4">
            Lets grow together, join The Canuck Mall
            <br /> today and get noticed.
          </p>
        </div>
      </div>

      {/* Mobile Top Image - Only shown on small screens */}
      <div className="sm:visible lg:hidden w-full h-48 relative">
        <Image
          src="/assets/becomeSeller/getReady.jpeg"
          alt="seller get started"
          fill
          className="object-cover"
          priority
          quality={100}
        />
        {/* Reddish opacity overlay */}
        <div className="absolute inset-0 bg-red-700 opacity-50 blend-multiply"></div>
        00{" "}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
          <h1 className="text-2xl font-bold text-white">
            Ready to get started?
          </h1>
          <p className="text-white">
            Lets grow together, join The Canuck Mall
            <br /> today and get noticed.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex items-start justify-center p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="w-full max-w-md lg:max-w-lg">
          <SellerRegistrationForm />
        </div>
      </div>
    </div>
  );
}

export default SellerSignUpForm;
