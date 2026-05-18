"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";

interface Service {
  id: number;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  details_en: string;
  details_ar: string;
  icon: string | null;
  background_image: string | null;
  sort_order: number;
}

export default function ServicesPageClient() {
  const { t, locale } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const isArabic = locale === "ar";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/services`
        );
        if (!res.ok) throw new Error("Failed to fetch services");
        const data = await res.json();
        setServices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#092754] mb-4">
            {t("services", "title")}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {t("services", "subtitle")}
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">{t("common", "loading")}</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">
              {t("common", "no_services")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 block bg-white"
              >
                {/* Image */}
                <div className="relative h-56 md:h-64 bg-gray-200">
                  {service.background_image ? (
                    <Image
                      src={service.background_image}
                      alt={isArabic ? service.title_ar : service.title_en}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#092754] to-[#1a4078]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {service.icon && (
                    <div
                      className={`absolute top-4 ${
                        isArabic ? "right-4" : "left-4"
                      } bg-white/90 backdrop-blur-sm p-3 rounded-lg`}
                    >
                      <Image
                        src={service.icon}
                        alt=""
                        width={28}
                        height={28}
                        style={{
                          filter:
                            "brightness(0) saturate(100%) invert(14%) sepia(48%) saturate(1930%) hue-rotate(201deg) brightness(93%) contrast(99%)",
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className={`p-6 ${isArabic ? "text-right" : "text-left"}`}>
                  <h3 className="text-xl font-bold text-[#092754] mb-3 line-clamp-2">
                    {isArabic ? service.title_ar : service.title_en}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {isArabic
                      ? service.description_ar
                      : service.description_en}
                  </p>
                  <div
                    className={`inline-flex items-center gap-1 text-[#092754] font-semibold group-hover:gap-2 transition-all duration-300`}
                  >
                    {t("services", "view_details")}
                    {isArabic ? <FiChevronLeft /> : <FiChevronRight />}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
