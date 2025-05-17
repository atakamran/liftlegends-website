
import React from "react";

const WorkHeader = () => {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-black pt-20 pb-10 relative">
      <div className="absolute -z-10 top-20 right-20 w-64 h-64 bg-gold-500 rounded-full blur-[150px] opacity-5"></div>
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
          <span className="text-gradient">همکاری با ما</span>
        </h1>
        <p className="text-white/70 text-center max-w-2xl mx-auto">
          به تیم LiftLegends بپیوندید و در ساخت آینده تناسب اندام و بدنسازی هوشمند سهیم باشید.
        </p>
      </div>
    </div>
  );
};

export default WorkHeader;
