
import React from "react";
import { Link } from "react-router-dom";
import FooterSection from "@/components/FooterSection";
import WorkHeader from "@/components/work/WorkHeader";
import WhyWorkWithUs from "@/components/work/WhyWorkWithUs";
import WorkApplicationForm from "@/components/work/WorkApplicationForm";

const WorkWithUs = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with gradient background */}
      <WorkHeader />

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left column - About working with us */}
          <WhyWorkWithUs />
          
          {/* Right column - Application form */}
          <WorkApplicationForm />
        </div>

        {/* Back to home button */}
        <div className="mt-12 text-center">
          <Link 
            to="/" 
            className="inline-block bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all hover:scale-105 font-medium"
          >
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>

      <FooterSection />
    </div>
  );
};

export default WorkWithUs;
