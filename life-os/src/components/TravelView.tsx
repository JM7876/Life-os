'use client';

import React, { useState } from 'react';
import {
  Plane,
  MapPin,
  Calendar,
  Clock,
  ChevronRight,
  Luggage,
  Hotel,
  Car,
  CloudSun,
  CheckSquare,
  Square,
  Plus,
  Globe,
} from 'lucide-react';

const glassStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(4px) saturate(180%)',
  WebkitBackdropFilter: 'blur(4px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.2)',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.35), inset 0 4px 20px rgba(255, 255, 255, 0.15)',
};

interface Trip {
  id: string;
  destination: string;
  location: string;
  startDate: string;
  endDate: string;
  flight?: { airline: string; number: string; departure: string; arrival: string; from: string; to: string; duration: string; status: string };
  hotel?: { name: string; checkIn: string; checkOut: string; confirmation: string };
  carRental?: { company: string; pickUp: string; dropOff: string; confirmation: string };
  weather?: { temp: string; condition: string };
  packingList: { item: string; packed: boolean }[];
  status: 'upcoming' | 'in-progress' | 'completed';
  notes: string;
}

const trips: Trip[] = [
  {
    id: '1',
    destination: 'Denver, CO',
    location: 'Colorado, USA',
    startDate: 'Mar 15',
    endDate: 'Mar 19',
    flight: { airline: 'Delta', number: 'DL 1247', departure: '8:30 AM', arrival: '10:15 AM', from: 'DTW', to: 'DEN', duration: '3h 45m', status: 'Confirmed' },
    hotel: { name: 'The Crawford Hotel', checkIn: 'Mar 15', checkOut: 'Mar 19', confirmation: 'CRW-28491' },
    carRental: { company: 'Enterprise', pickUp: 'Mar 15, 11:00 AM', dropOff: 'Mar 19, 6:00 AM', confirmation: 'ENT-77432' },
    weather: { temp: '45°F', condition: 'Partly Cloudy' },
    packingList: [
      { item: 'Camera body + lenses', packed: true },
      { item: 'Tripod', packed: true },
      { item: 'Laptop + charger', packed: false },
      { item: 'Winter jacket', packed: false },
      { item: 'Hiking boots', packed: false },
      { item: 'Memory cards (256GB)', packed: true },
      { item: 'Battery packs', packed: false },
      { item: 'Passport / ID', packed: false },
    ],
    status: 'upcoming',
    notes: 'Landscape photography trip. Scout locations in Rocky Mountain National Park. Client meetup on Mar 17.',
  },
  {
    id: '2',
    destination: 'Austin, TX',
    location: 'Texas, USA',
    startDate: 'Apr 5',
    endDate: 'Apr 8',
    flight: { airline: 'United', number: 'UA 892', departure: '11:15 AM', arrival: '1:45 PM', from: 'DTW', to: 'AUS', duration: '3h 30m', status: 'Confirmed' },
    hotel: { name: 'Hotel Van Zandt', checkIn: 'Apr 5', checkOut: 'Apr 8', confirmation: 'HVZ-55123' },
    weather: { temp: '78°F', condition: 'Sunny' },
    packingList: [
      { item: 'Camera gear', packed: false },
      { item: 'Business cards', packed: false },
      { item: 'Light clothing', packed: false },
    ],
    status: 'upcoming',
    notes: 'Wedding photography - Thompson/Garcia wedding on Apr 6. Rehearsal dinner shoot Apr 5.',
  },
  {
    id: '3',
    destination: 'New York, NY',
    location: 'New York, USA',
    startDate: 'Jan 20',
    endDate: 'Jan 23',
    status: 'completed',
    packingList: [],
    notes: 'Product photography for Luxe Cosmetics. All deliverables sent.',
  },
];

export default function TravelView() {
  const [selectedTrip, setSelectedTrip] = useState<string>(trips[0].id);
  const [packingList, setPackingList] = useState<Record<string, { item: string; packed: boolean }[]>>(
    Object.fromEntries(trips.map(t => [t.id, [...t.packingList]]))
  );

  const activeTrip = trips.find(t => t.id === selectedTrip)!;

  const togglePacked = (tripId: string, index: number) => {
    setPackingList(prev => ({
      ...prev,
      [tripId]: prev[tripId].map((item, i) => i === index ? { ...item, packed: !item.packed } : item),
    }));
  };

  const currentPacking = packingList[selectedTrip] || [];
  const packedCount = currentPacking.filter(i => i.packed).length;

  const statusColors = {
    upcoming: 'bg-cyan-500/20 text-cyan-400',
    'in-progress': 'bg-violet-500/20 text-violet-400',
    completed: 'bg-emerald-500/20 text-emerald-400',
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
            <Plane className="w-6 h-6" />
          </div>
          Travel
        </h2>
        <p className="text-white/50 mt-1">{trips.filter(t => t.status === 'upcoming').length} upcoming trips</p>
      </div>

      {/* Trip Selector */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
        {trips.map(trip => (
          <button
            key={trip.id}
            onClick={() => setSelectedTrip(trip.id)}
            className={`relative flex-shrink-0 rounded-[1.5rem] p-4 w-[180px] sm:w-[220px] overflow-hidden transition-all ${
              selectedTrip === trip.id ? 'ring-2 ring-cyan-500/50 scale-[1.02]' : 'opacity-70 hover:opacity-100'
            }`}
            style={glassStyle}
          >
            <div className="absolute inset-x-0 top-0 h-12 rounded-t-[1.5rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${statusColors[trip.status]}`}>
                  {trip.status === 'upcoming' ? 'Upcoming' : trip.status === 'in-progress' ? 'In Progress' : 'Completed'}
                </span>
              </div>
              <p className="font-bold text-lg">{trip.destination}</p>
              <p className="text-xs text-white/40 flex items-center gap-1 mt-1">
                <Calendar className="w-3 h-3" />
                {trip.startDate} - {trip.endDate}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Trip Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flight Info */}
        <div className="lg:col-span-2 space-y-6">
          {activeTrip.flight && (
            <div className="relative rounded-[1.5rem] p-5 overflow-hidden" style={glassStyle}>
              <div className="absolute inset-x-0 top-0 h-16 rounded-t-[1.5rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400"><Plane className="w-5 h-5" /></div>
                  <h3 className="font-semibold">Flight</h3>
                  <span className="ml-auto px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                    {activeTrip.flight.status}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/10 border border-violet-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-white/50">{activeTrip.flight.airline}</p>
                      <p className="text-sm font-medium">{activeTrip.flight.number}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white/50">
                      <Clock className="w-3 h-3" />
                      {activeTrip.flight.duration}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{activeTrip.flight.from}</p>
                      <p className="text-xs text-white/50">{activeTrip.flight.departure}</p>
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      <div className="flex-1 h-px bg-gradient-to-r from-cyan-400 to-violet-400" />
                      <Plane className="w-4 h-4 text-violet-400" />
                      <div className="flex-1 h-px bg-gradient-to-r from-violet-400 to-cyan-400" />
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{activeTrip.flight.to}</p>
                      <p className="text-xs text-white/50">{activeTrip.flight.arrival}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Accommodations & Car Rental */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeTrip.hotel && (
              <div className="relative rounded-[1.5rem] p-5 overflow-hidden" style={glassStyle}>
                <div className="absolute inset-x-0 top-0 h-12 rounded-t-[1.5rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400"><Hotel className="w-5 h-5" /></div>
                    <h3 className="font-semibold text-sm">Hotel</h3>
                  </div>
                  <p className="font-bold">{activeTrip.hotel.name}</p>
                  <div className="mt-2 space-y-1 text-sm text-white/50">
                    <p>Check-in: {activeTrip.hotel.checkIn}</p>
                    <p>Check-out: {activeTrip.hotel.checkOut}</p>
                    <p className="text-xs text-white/30">Conf: {activeTrip.hotel.confirmation}</p>
                  </div>
                </div>
              </div>
            )}
            {activeTrip.carRental && (
              <div className="relative rounded-[1.5rem] p-5 overflow-hidden" style={glassStyle}>
                <div className="absolute inset-x-0 top-0 h-12 rounded-t-[1.5rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400"><Car className="w-5 h-5" /></div>
                    <h3 className="font-semibold text-sm">Car Rental</h3>
                  </div>
                  <p className="font-bold">{activeTrip.carRental.company}</p>
                  <div className="mt-2 space-y-1 text-sm text-white/50">
                    <p>Pick-up: {activeTrip.carRental.pickUp}</p>
                    <p>Drop-off: {activeTrip.carRental.dropOff}</p>
                    <p className="text-xs text-white/30">Conf: {activeTrip.carRental.confirmation}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          {activeTrip.notes && (
            <div className="relative rounded-[1.5rem] p-5 overflow-hidden" style={glassStyle}>
              <div className="absolute inset-x-0 top-0 h-12 rounded-t-[1.5rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400"><Globe className="w-5 h-5" /></div>
                  <h3 className="font-semibold text-sm">Trip Notes</h3>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">{activeTrip.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Weather + Packing List */}
        <div className="space-y-6">
          {activeTrip.weather && (
            <div className="relative rounded-[1.5rem] p-5 overflow-hidden" style={glassStyle}>
              <div className="absolute inset-x-0 top-0 h-12 rounded-t-[1.5rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />
              <div className="relative text-center">
                <CloudSun className="w-12 h-12 text-amber-400 mx-auto mb-2" />
                <p className="text-3xl font-bold">{activeTrip.weather.temp}</p>
                <p className="text-sm text-white/50">{activeTrip.weather.condition}</p>
                <p className="text-xs text-white/30 mt-1">{activeTrip.destination}</p>
              </div>
            </div>
          )}

          {currentPacking.length > 0 && (
            <div className="relative rounded-[1.5rem] p-5 overflow-hidden" style={glassStyle}>
              <div className="absolute inset-x-0 top-0 h-12 rounded-t-[1.5rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400"><Luggage className="w-5 h-5" /></div>
                  <h3 className="font-semibold text-sm">Packing List</h3>
                </div>
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-white/40 mb-1">
                    <span>{packedCount} of {currentPacking.length} packed</span>
                    <span>{Math.round((packedCount / currentPacking.length) * 100)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all"
                      style={{ width: `${(packedCount / currentPacking.length) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  {currentPacking.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => togglePacked(selectedTrip, i)}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                    >
                      {item.packed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-white/30 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${item.packed ? 'line-through text-white/30' : 'text-white/80'}`}>
                        {item.item}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
