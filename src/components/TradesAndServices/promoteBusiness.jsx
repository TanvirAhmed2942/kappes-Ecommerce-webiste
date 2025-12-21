"use client";

import Image from "next/image";
import { Button } from "../../components/ui/button";
import Link from "next/link";

const PromoteBusiness = () => {
  return (
    <section className="w-full px-4 py-10 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Text Content */}
        <div>
          <h2 className="text-3xl font-comfortaa md:text-4xl font-bold text-gray-900 mb-4">
            List your Trades & Services
            <br className="hidden md:block" /> inside The Canuck Mall.
          </h2>
          <p className="text-base text-gray-700 mb-6">
            With The Canuck Mall, your services are showcased to Canadian
            actively searching for trusted local providers — not buried under
            big-box ads or foreign platforms.
          </p>
          <p className="text-base text-gray-700 mb-6">
            We help you get discovered in your own community, build credibility,
            and connect with customers who value Canadian businesses. From
            increased visibility to meaningful local exposure, The Canuck Mall
            makes it easier to stand out, earn trust, and grow!!
          </p>
          <Link href="/business-listing">
            <Button className="bg-red-600 hover:bg-red-700 font-comfortaa text-lg text-white">
              Add your Business
            </Button>
          </Link>
        </div>

        {/* Image */}
        <div className="w-full">
          <Image
            src="/assets/tradesAndServies/promoteBusiness.png" // Replace with your image path
            alt="Promote your business"
            width={600}
            height={400}
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
      </div>
    </section>
  );
};

export default PromoteBusiness;
