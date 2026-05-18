"use client";

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';
import Link from 'next/link';
import { FiChevronDown } from 'react-icons/fi';

// TypeScript interface for Project
interface Project {
  id: number;
  name_en: string;
  name_ar: string;
  area_en: string;
  area_ar: string;
  type: string;
  service: string;
  main_image: string;
}

// Project types
const projectTypes = [
  { value: 'all', label: 'all_projects' },
  { value: 'housing', label: 'housing_projects' },
  { value: 'commercial', label: 'commercial_projects' },
  { value: 'industrial', label: 'industrial_projects' },
  { value: 'medical', label: 'medical_projects' },
  { value: 'governmental', label: 'governmental_projects' },
  { value: 'entertainment', label: 'entertainment_projects' },
  { value: 'mosques', label: 'mosques_projects' },
  { value: 'interior_design', label: 'interior_design_projects' },
  { value: 'support_services', label: 'support_services_projects' },
];

// Service types
const serviceTypes = [
  { value: 'all', label: 'all_services' },
  { value: 'architectural_design', label: 'architectural_design' },
  { value: 'fire_life_safety', label: 'fire_life_safety' },
  { value: 'factory_warehouses_design', label: 'factory_warehouses_design' },
  { value: 'building_permits_services', label: 'building_permits_services' },
  { value: 'contract_disputes_resolution', label: 'contract_disputes_resolution' },
  { value: 'pmo_pmc_services', label: 'pmo_pmc_services' },
  { value: 'projects_supervision_services', label: 'projects_supervision_services' },
  { value: 'infrastructure_services', label: 'infrastructure_services' },
];

export default function ProjectsPage() {
  const { t, locale } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjectType, setSelectedProjectType] = useState('all');
  const [selectedServiceType, setSelectedServiceType] = useState('all');
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);

  const projectDropdownRef = useRef<HTMLDivElement>(null);
  const serviceDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`);
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (projectDropdownRef.current && !projectDropdownRef.current.contains(event.target as Node)) {
        setShowProjectDropdown(false);
      }
      if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(event.target as Node)) {
        setShowServiceDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter projects based on selected filters
  const filteredProjects = projects.filter(project => {
    const matchesProjectType = selectedProjectType === 'all' || project.type === selectedProjectType;
    const matchesServiceType = selectedServiceType === 'all' || project.service === selectedServiceType;
    return matchesProjectType && matchesServiceType;
  });

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header Section */}
      <section className="py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl 2xl:text-6xl font-bold text-[#1a2950] mb-6">
            {t('projects_page', 'title')}
          </h1>
          <p className="text-lg md:text-xl 2xl:text-2xl text-[#1a2950] mb-12 max-w-4xl mx-auto">
            {t('projects_page', 'subtitle')}
          </p>
          
          {/* Filter Dropdowns */}
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12">
            {/* Project Type Dropdown */}
            <div className="relative w-full md:w-64" ref={projectDropdownRef}>
              <button
                onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg flex items-center justify-between text-left hover:border-gray-400 transition-colors"
              >
                <span className="text-gray-700">
                  {selectedProjectType === 'all' 
                    ? t('projects_page', 'select_project_type')
                    : t('projects_page', projectTypes.find(t => t.value === selectedProjectType)?.label || '')
                  }
                </span>
                <FiChevronDown className={`text-gray-500 transition-transform ${showProjectDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showProjectDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {projectTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => {
                        setSelectedProjectType(type.value);
                        setShowProjectDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                      {t('projects_page', type.label)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Service Type Dropdown */}
            <div className="relative w-full md:w-64" ref={serviceDropdownRef}>
              <button
                onClick={() => setShowServiceDropdown(!showServiceDropdown)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg flex items-center justify-between text-left hover:border-gray-400 transition-colors"
              >
                <span className="text-gray-700">
                  {selectedServiceType === 'all' 
                    ? t('projects_page', 'select_service_type')
                    : t('projects_page', serviceTypes.find(s => s.value === selectedServiceType)?.label || '')
                  }
                </span>
                <FiChevronDown className={`text-gray-500 transition-transform ${showServiceDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showServiceDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {serviceTypes.map((service) => (
                    <button
                      key={service.value}
                      onClick={() => {
                        setSelectedServiceType(service.value);
                        setShowServiceDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                      {t('projects_page', service.label)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">Loading projects...</p>
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 4k:grid-cols-3 gap-8">
              {filteredProjects.map((project: Project) => (
                <Link
                  key={project.id}
                  href={`/${locale}/projects/${project.id}`}
                  className="group relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 block"
                >
                  {/* Project Image */}
                  <div className="relative h-72 md:h-80 lg:h-[400px] 2xl:h-[450px] 4k:h-[500px]">
                    <Image
                      src={project.main_image || '/placeholder.svg'}
                      alt={locale === 'ar' ? project.name_ar : project.name_en}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Overlay with project info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4">
                      <div className={`text-white ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
                        <h3 className="text-lg font-bold mb-1">
                          {locale === 'ar' ? project.name_ar : project.name_en}
                        </h3>
                        <p className="text-sm text-gray-300 mb-1">
                          {t('projects_page', project.type + '_projects')} • {t('services', project.service)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {locale === 'ar' ? project.area_ar : project.area_en}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">
                {t('projects_page', 'no_projects_found')}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 