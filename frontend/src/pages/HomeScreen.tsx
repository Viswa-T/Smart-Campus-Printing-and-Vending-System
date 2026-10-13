import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Printer,
  MapPin,
  Bell,
  User as UserIcon,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { usePrintOrder } from '../context/PrintOrderContext';
import { collegeApi, machineApi, orderApi } from '../services/api';
import { Machine, Order } from '../types';
import { BottomNav } from '../components/common/BottomNav';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    selectedCollege,
    setSelectedCollege,
    setSelectedMachine,
  } = usePrintOrder();

  const [machines, setMachines] = useState<Machine[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadInitialData();
  }, [user]);

  const loadInitialData = async () => {
    setLoading(true);

    try {
      // 1. Resolve college
      const currentCollegeId =
        selectedCollege?.id || user?.selectedCollegeId || 1;

      const collegeDetail = await collegeApi
        .getCollegeById(currentCollegeId)
        .catch(() => null);

      if (collegeDetail) {
        setSelectedCollege(collegeDetail.college);
        setMachines(collegeDetail.machines);
      } else {
        const fallbackMachines = await machineApi.getMachines();
        setMachines(fallbackMachines);
      }

      // 2. Fetch recent user orders if logged in
      if (user) {
        const orderData = await orderApi
          .getUserOrders({ size: 3 })
          .catch(() => null);

        if (orderData) {
          setRecentOrders(orderData.items);
        }
      } else {
        setRecentOrders([]);
      }
    } catch (error) {
      console.error('Failed to load home screen data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMachine = (machine: Machine) => {
    setSelectedMachine(machine);
    navigate('/upload');
  };

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-md min-w-0 flex-col overflow-x-clip bg-[#F8F9FD] pb-24 text-[#101735]">

      {/* Header */}
      <header className="sticky top-0 z-30 flex w-full min-w-0 items-center justify-between gap-2 border-b border-gray-100 bg-white px-4 py-3 shadow-sm">

        {/* Brand */}
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#4020D8] to-[#5835F5] text-white shadow-md shadow-indigo-200">
            <Printer className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h1 className="text-xl font-extrabold tracking-tight">
              Xerox<span className="text-[#5835F5]">Go</span>
            </h1>

            <p className="-mt-1 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
              Smart Campus Printing
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            aria-label="View order history"
            onClick={() => navigate('/history')}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100"
          >
            <Bell className="h-[18px] w-[18px]" />
          </button>

          <button
            type="button"
            aria-label="Open profile"
            onClick={() => navigate('/profile')}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-[#5835F5] to-indigo-600 text-xs font-bold text-white shadow-sm"
          >
            {user ? (
              user.fullName.charAt(0).toUpperCase()
            ) : (
              <UserIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex w-full min-w-0 flex-1 flex-col gap-5 p-3 sm:p-4">

        {/* Selected College Card */}
        <section className="flex w-full min-w-0 items-center gap-2 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:gap-3 sm:p-4">

          {/* College Abbreviation */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1EDFF] text-xs font-extrabold text-[#5835F5]">
            {selectedCollege?.abbreviation || 'CAMPUS'}
          </div>

          {/* College Information */}
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-sm font-bold text-[#101735]">
              {selectedCollege
                ? selectedCollege.collegeName
                : 'Select Your Campus'}
            </h2>

            <p className="mt-1 flex min-w-0 items-center gap-1 text-xs text-[#64748B]">
              <MapPin className="h-3 w-3 shrink-0 text-[#5835F5]" />

              <span className="truncate">
                {selectedCollege
                  ? `${selectedCollege.city}, ${selectedCollege.state}`
                  : 'Browse institutions'}
              </span>
            </p>
          </div>

          {/* Change College */}
          <button
            type="button"
            onClick={() => navigate('/colleges')}
            className="shrink-0 rounded-full bg-[#F1EDFF] px-2 py-1.5 text-[11px] font-bold text-[#5835F5] transition-colors hover:bg-indigo-100 sm:px-3 sm:text-xs"
          >
            Change
          </button>
        </section>

        {/* Printing Hero Banner */}
        <section className="relative w-full min-w-0 overflow-hidden rounded-3xl bg-gradient-to-r from-[#5835F5] to-[#4020D8] p-4 text-white shadow-xl shadow-indigo-300/30 sm:p-5">

          {/* Banner Content */}
          <div className="relative z-10 min-w-0">

            {/* Price Badge */}
            <div className="mb-3 inline-flex max-w-full items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm sm:text-[11px]">
              <Sparkles className="h-3 w-3 shrink-0 text-amber-300" />

              <span>₹1/page B&W • ₹5/page Color</span>
            </div>

            {/* Heading */}
            <h2 className="max-w-full break-words text-base font-extrabold leading-snug sm:text-lg">
              Instant Document Printing
            </h2>

            {/* Description */}
            <p className="mt-2 max-w-[240px] text-xs leading-relaxed text-white/80">
              Upload PDF, Word or images and collect prints with a 6-digit PIN.
            </p>

            {/* Start Printing Button */}
            <button
              type="button"
              onClick={() => {
                if (machines.length > 0) {
                  handleSelectMachine(machines[0]);
                } else {
                  navigate('/colleges');
                }
              }}
              className="mt-4 inline-flex max-w-full items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-2.5 text-xs font-bold text-[#5835F5] shadow-md transition-all hover:bg-gray-50 active:scale-95 sm:px-4"
            >
              <span>Start Printing Now</span>
              <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            </button>
          </div>

          {/* Decorative Printer */}
          <div className="pointer-events-none absolute -bottom-4 -right-5 text-white/10 sm:-right-3">
            <Printer className="h-28 w-28 sm:h-36 sm:w-36" />
          </div>
        </section>

        {/* Nearby Printing Machines */}
        <section className="w-full min-w-0">

          {/* Section Heading */}
          <div className="mb-3 flex min-w-0 items-center justify-between gap-2 px-1">
            <h2 className="min-w-0 text-sm font-extrabold text-[#101735]">
              Nearby Printing Machines
            </h2>

            <span className="shrink-0 text-xs font-medium text-[#64748B]">
              {machines.length} available
            </span>
          </div>

          {/* Loading State */}
          {loading && machines.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center">
              <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-[#5835F5] border-t-transparent" />

              <p className="text-xs text-[#64748B]">
                Loading printing machines...
              </p>
            </div>
          ) : machines.length === 0 ? (
            /* Empty State */
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center sm:p-8">
              <Printer className="mx-auto mb-2 h-10 w-10 text-gray-300" />

              <p className="text-xs font-semibold text-gray-600">
                No kiosks found for this campus
              </p>

              <button
                type="button"
                onClick={() => navigate('/colleges')}
                className="mt-3 text-xs font-bold text-[#5835F5] hover:underline"
              >
                Choose another campus
              </button>
            </div>
          ) : (
            /* Machine Cards */
            <div className="flex w-full min-w-0 flex-col gap-3">
              {machines.map((machine) => (
                <button
                  type="button"
                  key={machine.id}
                  onClick={() => handleSelectMachine(machine)}
                  className="group flex w-full min-w-0 flex-col rounded-2xl border border-gray-100 bg-white p-3 text-left shadow-sm transition-all hover:border-indigo-200 hover:shadow-md active:scale-[0.99] sm:p-4"
                >
                  {/* Machine Information */}
                  <div className="mb-3 flex w-full min-w-0 items-start gap-3">

                    {/* Machine Icon */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F1EDFF] text-xl transition-transform group-hover:scale-105">
                      🖨️
                    </div>

                    {/* Machine Details */}
                    <div className="min-w-0 flex-1">
                      <h3 className="break-words text-sm font-bold text-[#101735] transition-colors group-hover:text-[#5835F5]">
                        {machine.machineName}
                      </h3>

                      <p className="mt-1 break-words text-xs leading-relaxed text-[#64748B]">
                        {machine.locationDescription}
                      </p>
                    </div>
                  </div>

                  {/* Machine Status */}
                  <div className="flex w-full min-w-0 items-center justify-between border-t border-gray-50 pt-3 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-green-500" />

                      <span className="break-words font-bold text-green-600">
                        {machine.operationalStatus}
                      </span>
                    </div>

                    <ChevronRight className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-hover:translate-x-1" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Recent Orders */}
        {recentOrders.length > 0 && (
          <section className="mt-1 w-full min-w-0">

            {/* Section Heading */}
            <div className="mb-3 flex items-center justify-between gap-2 px-1">
              <h2 className="text-sm font-extrabold text-[#101735]">
                Recent Orders
              </h2>

              <button
                type="button"
                onClick={() => navigate('/history')}
                className="shrink-0 text-xs font-bold text-[#5835F5] hover:underline"
              >
                View all
              </button>
            </div>

            {/* Order Cards */}
            <div className="flex w-full min-w-0 flex-col gap-3">
              {recentOrders.slice(0, 2).map((order) => (
                <div
                  key={order.id}
                  className="w-full min-w-0 space-y-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:p-4"
                >
                  {/* Order Information */}
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="break-words text-xs font-bold text-[#101735]">
                        {order.machineName}
                      </h3>

                      <p className="mt-1 break-all text-[11px] leading-relaxed text-[#64748B]">
                        {order.publicOrderReference}
                      </p>
                    </div>

                    <span className="shrink-0 text-sm font-extrabold text-[#5835F5]">
                      ₹{order.finalAmount}
                    </span>
                  </div>

                  {/* Access PIN */}
                  {order.accessCode && (
                    <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl bg-[#F1EDFF] p-2.5">
                      <span className="shrink-0 text-xs font-semibold text-[#5835F5]">
                        PIN:
                      </span>

                      <span className="break-all text-right font-mono text-sm font-extrabold tracking-widest text-[#101735]">
                        {order.accessCode}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};