"use client";

import Header from "../common/Header";

interface PropertyDescriptionProps {
  description: string;
  expect?: string[];
  activity?: string[];
  inclusions?: string[];
  pricing?: {
    startFrom: string;
    description: string;
    note: string;
  };
}

export default function PropertyDescription({
  description,
  expect,
  activity,
  inclusions,
  pricing
}: PropertyDescriptionProps) {
  return (
    <section className="mt-8 md:mt-20 max-w-[1350px] mx-auto h-full px-5 md:px-8">
      <div className="grid md:grid-cols-3 gap-5 md:gap-12">
        <div className="md:col-span-2">
          {/* Header */}
          <Header
            title="About This Property"
            className="w-full md:w-[80%] gap-2 md:gap-10 flex flex-col md:flex-row md:items-end"
          ></Header>
          <p className=" text-gray-700 leading-relaxed mb-8 text-justify mt-3">
            {description}
          </p>

          {Array.isArray(expect) && expect.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-black">
                What to Expect
              </h3>
              <ul className="space-y-3 text-gray-700">
                {expect.map((item, idx) => (
                  <li className="flex items-start gap-3" key={idx}>
                    <span className="text-black font-bold mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {Array.isArray(activity) && activity.length > 0 && (
            <div className="space-y-4 mt-7 mb-5 md:mt-10">
              <h3 className="text-xl font-semibold text-black">Activities</h3>
              <ul className="space-y-3 text-gray-700">
                {activity.map((item, idx) => (
                  <li className="flex items-start gap-3" key={idx}>
                    <span className="text-black font-bold mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Price Card */}
        <div className="md:col-span-1">
          <div className="sticky top-22 bg-black text-white p-8 rounded-lg">
            <p className="text-sm opacity-75 mb-2">Starting from</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">₹ {pricing?.startFrom}</span>
              <p className="text-sm opacity-75 mt-2 capitalize">
                {pricing?.description}
              </p>
              {pricing?.note && (
                <p className="text-sm opacity-75 mt-2 capitalize">
                  Note : {pricing?.note}
                </p>
              )}
            </div>

            <div className="space-y-3 mb-6 pb-6 border-b border-white/20">
              {inclusions &&
                inclusions.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="opacity-75">{item}</span>
                    <span>✓</span>
                  </div>
                ))}
            </div>

            <p className="text-xs opacity-75 text-center">
              All-inclusive pricing
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
