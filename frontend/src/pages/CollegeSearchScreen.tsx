import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  MapPin,
  Building,
  ChevronRight,
  Loader2,
} from 'lucide-react';

import { collegeApi } from '../services/api';
import { College } from '../types';
import { usePrintOrder } from '../context/PrintOrderContext';
import { useAuth } from '../context/AuthContext';

export const CollegeSearchScreen: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedCollege } = usePrintOrder();
  const { user, updateProfile } = useAuth();

  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const CITIES = [
    'All',
    'Coimbatore',
    'Chennai',
    'Madurai',
    'Tiruchirappalli',
    'Salem',
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchColleges();
    }, 250);

    return () => clearTimeout(timer);
  }, [search, selectedCity]);

  const fetchColleges = async () => {
    setLoading(true);

    try {
      const cityFilter =
        selectedCity !== 'All' ? selectedCity : undefined;

      const response = await collegeApi.searchColleges({
        search: search.trim() || undefined,
        city: cityFilter,
        size: 50,
      });

      setColleges(response.items);
      setTotalCount(response.totalElements);
    } catch (error) {
      console.error('Failed to fetch colleges:', error);
      setColleges([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCollege = async (college: College) => {
    setSelectedCollege(college);

    if (user) {
      try {
        await updateProfile(undefined, college.id);
      } catch (error) {
        console.error('Failed to update selected college:', error);
      }
    }

    navigate('/home');
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md min-w-0 flex-col overflow-x-clip bg-[#F8F9FD] text-[#101735]">

      {/* Header */}
      <header className="sticky top-0 z-30 w-full min-w-0 border-b border-gray-100 bg-white shadow-sm">

        {/* Title */}
        <div className="flex min-w-0 items-center gap-2 px-3 pb-3 pt-4 sm:gap-3 sm:px-5">
          <button
            type="button"
            onClick={() => navigate('/home')}
            aria-label="Back to home"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100"
          >
            <span className="text-xl font-bold">←</span>
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-extrabold leading-tight sm:text-xl">
              Select Your College
            </h1>

            <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
              Find your campus to see available printing machines.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="w-full min-w-0 px-3 sm:px-5">
          <div className="relative w-full min-w-0">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search college name or abbreviation..."
              aria-label="Search colleges"
              className="block w-full min-w-0 rounded-2xl border border-gray-200 bg-gray-50/50 py-3 pl-10 pr-10 text-xs text-[#101735] outline-none placeholder:text-gray-400 focus:border-[#5835F5] focus:ring-2 focus:ring-[#5835F5]/20"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Clear search"
                className="absolute right-0 top-0 flex h-full items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* City Filters */}
        <div className="w-full min-w-0 overflow-hidden px-3 pb-3 pt-3 sm:px-5">
          <div className="flex w-full min-w-0 items-center gap-2 overflow-x-auto pb-1 text-xs [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CITIES.map((city) => (
              <button
                type="button"
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`shrink-0 whitespace-nowrap rounded-full px-3 py-2 font-semibold transition-colors ${
                  selectedCity === city
                    ? 'bg-[#5835F5] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* College List */}
      <main className="w-full min-w-0 flex-1 p-3 pb-8 sm:p-4">

        {/* Results Heading */}
        <div className="mb-3 flex min-w-0 items-center justify-between gap-2 px-1">
          <span className="min-w-0 text-xs font-bold uppercase tracking-wider text-[#64748B]">
            Supported Colleges ({totalCount})
          </span>

          {loading && (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[#5835F5]" />
          )}
        </div>

        {/* Loading State */}
        {loading && colleges.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white px-4 py-12 text-center">
            <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-[#5835F5]" />

            <p className="text-sm font-medium text-[#64748B]">
              Finding colleges...
            </p>
          </div>
        ) : colleges.length === 0 ? (
          /* Empty State */
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white px-4 py-12 text-center">
            <Building className="mx-auto mb-3 h-12 w-12 text-gray-300" />

            <h2 className="text-sm font-bold">
              No colleges found
            </h2>

            <p className="mt-2 text-xs leading-relaxed text-[#64748B]">
              Try a different search query or select another city.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedCity('All');
              }}
              className="mt-4 rounded-full bg-[#F1EDFF] px-4 py-2 text-xs font-bold text-[#5835F5] hover:bg-indigo-100"
            >
              Clear filters
            </button>
          </div>
        ) : (
          /* College Cards */
          <div className="flex w-full min-w-0 flex-col gap-3">
            {colleges.map((college) => {
              const badgeText =
                college.abbreviation ||
                college.collegeName.slice(0, 3).toUpperCase();

              return (
                <button
                  type="button"
                  key={college.id}
                  onClick={() => handleSelectCollege(college)}
                  className="group flex w-full min-w-0 items-center gap-2 overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 text-left shadow-sm transition-all hover:border-indigo-200 hover:shadow-md active:scale-[0.99] sm:gap-3 sm:p-4"
                >
                  {/* College Badge */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-indigo-100 bg-gradient-to-tr from-[#F1EDFF] to-indigo-50 px-1 text-center text-[10px] font-extrabold text-[#5835F5] shadow-sm sm:h-12 sm:w-12 sm:text-xs">
                    <span className="break-all">
                      {badgeText}
                    </span>
                  </div>

                  {/* College Details */}
                  <div className="min-w-0 flex-1">
                    <h2 className="break-words text-[13px] font-bold leading-snug text-[#101735] transition-colors group-hover:text-[#5835F5] sm:text-sm">
                      {college.collegeName}
                    </h2>

                    <p className="mt-1 flex min-w-0 items-start gap-1 text-xs leading-relaxed text-[#64748B]">
                      <MapPin className="mt-0.5 h-3 w-3 shrink-0" />

                      <span className="min-w-0 break-words">
                        {college.city}, {college.state}
                      </span>
                    </p>
                  </div>

                  {/* Kiosk Count and Arrow */}
                  <div className="flex max-w-[78px] shrink-0 items-center gap-1 sm:max-w-none">
                    {college.activeMachineCount > 0 && (
                      <span className="rounded-full bg-green-50 px-1.5 py-1 text-[9px] font-semibold text-green-700 sm:px-2 sm:text-[10px]">
                        {college.activeMachineCount} kiosk
                        {college.activeMachineCount > 1 ? 's' : ''}
                      </span>
                    )}

                    <ChevronRight className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};