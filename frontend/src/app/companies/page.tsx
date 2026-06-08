'use client';

import { useState, useEffect } from 'react';
import { useLang } from '@/lib/lang';
import { companyApi } from '@/lib/api';
import { Company } from '@/types';

export default function CompaniesPage() {
  const { t, lang } = useLang();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  const industries = ['IT', 'Finance', 'Marketing', 'Education', 'FMCG', 'Healthcare', 'Real Estate', 'Logistics', 'Retail', 'Manufacturing'];
  const locations = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ', 'Nghệ An', 'Bình Dương', 'Hải Phòng'];
  const sizes = ['10-50 employees', '50-200 employees', '200-500 employees', '500-1000 employees', '1000+ employees'];

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await companyApi.getAll();
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = !selectedIndustry || company.industry === selectedIndustry;
    const matchesLocation = !selectedLocation || company.location === selectedLocation;
    const matchesSize = !selectedSize || company.size === selectedSize;
    return matchesSearch && matchesIndustry && matchesLocation && matchesSize;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedIndustry('');
    setSelectedLocation('');
    setSelectedSize('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12 dark:from-blue-800 dark:to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">{t('companies.viewAll')}</h1>
          <p className="text-xl">{t('companies.description')}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('common.filter')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <input
                type="text"
                placeholder={t('companies.searchPlaceholder')}
                className="w-full input-field"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Industry Filter */}
            <div>
              <select
                className="w-full input-field"
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
              >
                <option value="">{t('companies.industry')}</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
            
            {/* Location Filter */}
            <div>
              <select
                className="w-full input-field"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">{t('companies.location')}</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            
            {/* Size Filter */}
            <div>
              <select
                className="w-full input-field"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option value="">{t('companies.size')}</option>
                {sizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>
          
          {(searchTerm || selectedIndustry || selectedLocation || selectedSize) && (
            <button
              onClick={clearFilters}
              className="mt-4 text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              {t('common.reset')} {t('common.filter')}
            </button>
          )}
        </div>

        {/* Companies Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">{t('common.loading')}</p>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">{t('companies.noJobs')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <div
                key={company.id}
                className="card-surface p-6 hover:shadow-lg transition"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={company.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(company.name)}`}
                    alt={company.name}
                    className="h-12 w-12 rounded-lg mr-3"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(company.name)}`;
                    }}
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{company.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{company.industry}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">📍 {company.location}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">👥 {company.size}</p>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">{company.description}</p>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  {t('companies.website')}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}