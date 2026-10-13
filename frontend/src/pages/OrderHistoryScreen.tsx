import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, ChevronRight, CheckCircle2, AlertCircle, Copy, Check, Printer } from 'lucide-react';
import { orderApi } from '../services/api';
import { Order } from '../types';
import { BottomNav } from '../components/common/BottomNav';

export const OrderHistoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'ALL' | 'COMPLETED' | 'PAID' | 'PENDING_PAYMENT'>('ALL');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const statusParam = filter !== 'ALL' ? filter : undefined;
      const res = await orderApi.getUserOrders({ status: statusParam, size: 50 });
      setOrders(res.items);
    } catch {
      // Ignored
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COLLECTED':
      case 'COMPLETED':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 font-bold text-[10px]">
            Completed
          </span>
        );
      case 'PAID':
      case 'READY_FOR_COLLECTION':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-[#F1EDFF] text-[#5835F5] font-bold text-[10px]">
            Ready to Print
          </span>
        );
      case 'PRINTING':
      case 'QUEUED':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold text-[10px]">
            Processing
          </span>
        );
      case 'CANCELLED':
      case 'PAYMENT_FAILED':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-[10px]">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 font-bold text-[10px]">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] max-w-md mx-auto flex flex-col pb-24">
      {/* Top Header */}
      <div className="bg-white p-5 border-b border-gray-100 sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/home')}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <span className="text-xl font-bold">←</span>
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-[#101735]">My Orders</h1>
            <p className="text-xs text-[#64748B]">View past print history and access codes</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              filter === 'ALL'
                ? 'bg-[#5835F5] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('COMPLETED')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              filter === 'COMPLETED'
                ? 'bg-[#5835F5] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter('PAID')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              filter === 'PAID'
                ? 'bg-[#5835F5] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Ready / Processing
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="p-4 flex-1">
        {orders.length === 0 && !loading ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200 p-6">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-[#101735]">No orders yet</h3>
            <p className="text-xs text-[#64748B] mt-1">Your print history and access codes will appear here</p>
            <button
              onClick={() => navigate('/home')}
              className="mt-4 px-4 py-2 rounded-xl bg-[#5835F5] text-white text-xs font-bold shadow-xs hover:bg-[#4020D8]"
            >
              Start New Print
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs hover:border-indigo-200 hover:shadow-md active:scale-98 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F1EDFF] text-[#5835F5] flex items-center justify-center font-bold text-sm shrink-0">
                      📄
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#64748B] uppercase">
                        {order.publicOrderReference}
                      </span>
                      <h4 className="text-xs font-bold text-[#101735]">{order.machineName}</h4>
                      <p className="text-[11px] text-[#64748B]">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    {getStatusBadge(order.orderStatus)}
                    <span className="text-xs font-extrabold text-[#5835F5] block mt-1.5">
                      ₹{order.finalAmount}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-[11px]">
                  <span className="text-[#64748B]">
                    {order.totalPages} pages • {order.colorMode === 'COLOR' ? 'Color' : 'B&W'} • {order.copies} {order.copies > 1 ? 'copies' : 'copy'}
                  </span>

                  {order.accessCode && (
                    <button
                      onClick={(e) => handleCopyCode(order.accessCode!, e)}
                      className="px-2.5 py-1 rounded-lg bg-[#F1EDFF] text-[#5835F5] font-mono font-bold text-xs flex items-center gap-1.5 hover:bg-indigo-100 transition-colors"
                      title="Copy access code"
                    >
                      <span>{order.accessCode}</span>
                      {copiedCode === order.accessCode ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl modal-enter space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#64748B]">
                  {selectedOrder.publicOrderReference}
                </span>
                <h3 className="text-base font-bold text-[#101735]">{selectedOrder.machineName}</h3>
                <p className="text-xs text-[#64748B]">{selectedOrder.machineLocation}</p>
              </div>
              {getStatusBadge(selectedOrder.orderStatus)}
            </div>

            {selectedOrder.accessCode && (
              <div className="p-4 bg-[#F1EDFF] rounded-2xl border border-indigo-100 text-center">
                <span className="text-[10px] uppercase font-bold text-[#64748B] block mb-1">
                  Access Code
                </span>
                <span className="text-3xl font-extrabold font-mono text-[#5835F5] tracking-widest">
                  {selectedOrder.accessCode}
                </span>
                <p className="text-[10px] text-[#64748B] mt-1">
                  Enter at kiosk to dispense documents
                </p>
              </div>
            )}

            <div className="space-y-1.5 text-xs text-gray-600 border-t border-b border-gray-100 py-3">
              <div className="flex justify-between">
                <span>Color Mode:</span>
                <span className="font-bold text-[#101735]">{selectedOrder.colorMode}</span>
              </div>
              <div className="flex justify-between">
                <span>Print Sides:</span>
                <span className="font-bold text-[#101735]">{selectedOrder.printSides}</span>
              </div>
              <div className="flex justify-between">
                <span>Copies:</span>
                <span className="font-bold text-[#101735]">{selectedOrder.copies}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Charge:</span>
                <span className="font-bold text-[#5835F5]">₹{selectedOrder.finalAmount}</span>
              </div>
            </div>

            <div className="flex gap-2">
              
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 py-3 rounded-xl bg-[#5835F5] text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
};
