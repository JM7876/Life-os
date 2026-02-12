'use client';
import React, { useState, useMemo } from 'react';
import { useLifeOSStore, type Flight } from '@/store/useLifeOSStore';

const glassCard = {
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(4px) saturate(180%)',
  WebkitBackdropFilter: 'blur(4px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.2)',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.35), inset 0 4px 20px rgba(255, 255, 255, 0.15)',
};

const glassModal = {
  background: 'rgba(20, 10, 50, 0.85)',
  backdropFilter: 'blur(40px) saturate(180%)',
  WebkitBackdropFilter: 'blur(40px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.2)',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.35), inset 0 4px 20px rgba(255, 255, 255, 0.15)',
};

function ShineOverlay() {
  return (
    <>
      <div
        className="absolute inset-0 rounded-[1.5rem] pointer-events-none"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          boxShadow: 'inset -10px -8px 0px -11px rgba(255, 255, 255, 0.6), inset 0px -9px 0px -8px rgba(255, 255, 255, 0.6)',
          opacity: 0.5,
          filter: 'blur(1px) brightness(115%)',
        }}
      />
      <div className="absolute inset-x-0 top-0 h-16 rounded-t-[1.5rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />
    </>
  );
}

function ModalShine() {
  return (
    <>
      <div
        className="absolute inset-0 rounded-[2rem] pointer-events-none"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          boxShadow: 'inset -10px -8px 0px -11px rgba(255, 255, 255, 0.6), inset 0px -9px 0px -8px rgba(255, 255, 255, 0.6)',
          opacity: 0.5,
          filter: 'blur(1px) brightness(115%)',
        }}
      />
      <div className="absolute inset-x-0 top-0 h-20 rounded-t-[2rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />
    </>
  );
}

const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 transition-colors";
const labelCls = "block text-xs text-white/50 mb-1.5";
const btnPrimary = "w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 font-medium text-sm hover:from-cyan-600 hover:to-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity";

const emptyFlight: Flight = { airline: '', flightNumber: '', departure: '', arrival: '', departureTime: '', arrivalTime: '' };

export default function TravelTab() {
  const {
    trips, addTrip, updateTrip, deleteTrip,
    addPackingItem, togglePackingItem, deletePackingItem,
  } = useLifeOSStore();

  const [showAddTrip, setShowAddTrip] = useState(false);
  const [expandedTrip, setExpandedTrip] = useState<string | null>(null);
  const [packingInput, setPackingInput] = useState('');

  const [newTrip, setNewTrip] = useState<{
    destination: string;
    startDate: string;
    endDate: string;
    flights: Flight[];
    accommodations: string;
    notes: string;
  }>({
    destination: '',
    startDate: '',
    endDate: '',
    flights: [{ ...emptyFlight }],
    accommodations: '',
    notes: '',
  });

  const sortedTrips = useMemo(() => {
    return [...trips].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [trips]);

  const getCountdown = (startDate: string) => {
    const diff = new Date(startDate).getTime() - Date.now();
    if (diff <= 0) return { label: 'In progress / past', days: 0, urgent: false };
    const days = Math.ceil(diff / 86400000);
    if (days === 1) return { label: 'Tomorrow', days, urgent: true };
    if (days <= 7) return { label: `${days} days away`, days, urgent: true };
    if (days <= 30) return { label: `${days} days away`, days, urgent: false };
    return { label: `${days} days away`, days, urgent: false };
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formatShortDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const handleAddTrip = () => {
    if (!newTrip.destination.trim() || !newTrip.startDate || !newTrip.endDate) return;
    const flights = newTrip.flights.filter(f => f.airline.trim() || f.flightNumber.trim());
    addTrip({
      destination: newTrip.destination.trim(),
      startDate: newTrip.startDate,
      endDate: newTrip.endDate,
      flights,
      accommodations: newTrip.accommodations.trim() || undefined,
      activities: [],
      notes: newTrip.notes.trim() || undefined,
      packingList: [],
    });
    setNewTrip({ destination: '', startDate: '', endDate: '', flights: [{ ...emptyFlight }], accommodations: '', notes: '' });
    setShowAddTrip(false);
  };

  const updateFlight = (idx: number, field: keyof Flight, value: string) => {
    const updated = [...newTrip.flights];
    updated[idx] = { ...updated[idx], [field]: value };
    setNewTrip({ ...newTrip, flights: updated });
  };

  const addFlightRow = () => {
    setNewTrip({ ...newTrip, flights: [...newTrip.flights, { ...emptyFlight }] });
  };

  const removeFlightRow = (idx: number) => {
    if (newTrip.flights.length <= 1) return;
    setNewTrip({ ...newTrip, flights: newTrip.flights.filter((_, i) => i !== idx) });
  };

  const handleAddPackingItem = (tripId: string) => {
    if (!packingInput.trim()) return;
    addPackingItem(tripId, packingInput.trim());
    setPackingInput('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold mb-1">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Travel</span>
          </h2>
          <p className="text-white/60 text-sm">Plan trips, track flights, and pack smart</p>
        </div>
        <button onClick={() => setShowAddTrip(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 font-medium text-sm transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Trip
        </button>
      </div>

      {/* Trip Cards */}
      {sortedTrips.length === 0 ? (
        <div className="relative rounded-[1.5rem] p-8 overflow-hidden text-center" style={glassCard}>
          <ShineOverlay />
          <div className="relative">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 mx-auto mb-3 text-white/20"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
            <p className="text-white/40 text-sm">No trips planned yet</p>
            <button onClick={() => setShowAddTrip(true)} className="mt-3 text-cyan-400 text-sm hover:underline underline-offset-2">Plan your first trip</button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedTrips.map((trip) => {
            const countdown = getCountdown(trip.startDate);
            const isExpanded = expandedTrip === trip.id;
            const packedCount = trip.packingList.filter(p => p.packed).length;
            const totalPacking = trip.packingList.length;

            return (
              <div key={trip.id} className="relative rounded-[1.5rem] overflow-hidden transition-shadow duration-300" style={glassCard}>
                <ShineOverlay />
                <div className="relative">
                  {/* Trip Header */}
                  <div
                    className="p-4 lg:p-5 cursor-pointer"
                    onClick={() => setExpandedTrip(isExpanded ? null : trip.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-bold">{trip.destination}</h3>
                          <span className={`px-2.5 py-0.5 rounded-lg text-xs font-medium ${countdown.urgent ? 'bg-amber-500/20 text-amber-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                            {countdown.label}
                          </span>
                        </div>
                        <p className="text-sm text-white/50">
                          {formatDate(trip.startDate)} &mdash; {formatDate(trip.endDate)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteTrip(trip.id); }}
                          className="p-2 rounded-lg text-white/20 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-5 h-5 text-white/40 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
                      </div>
                    </div>

                    {/* Quick Info Row */}
                    <div className="flex flex-wrap gap-2">
                      {trip.flights.length > 0 && (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 text-xs text-white/60">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
                          {trip.flights[0].flightNumber} &middot; {trip.flights[0].departure} &rarr; {trip.flights[0].arrival}
                        </span>
                      )}
                      {trip.accommodations && (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 text-xs text-white/60">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                          {trip.accommodations}
                        </span>
                      )}
                      {totalPacking > 0 && (
                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs ${packedCount === totalPacking ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/60'}`}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                          {packedCount}/{totalPacking} packed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-white/10 p-4 lg:p-5 space-y-5">
                      {/* Flights Detail */}
                      {trip.flights.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-white/70 mb-3">Flights</h4>
                          <div className="space-y-2">
                            {trip.flights.map((flight, i) => (
                              <div key={i} className="p-3 rounded-xl bg-white/5">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{flight.airline}</span>
                                    <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 text-xs">{flight.flightNumber}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-white/60">
                                  <span className="font-medium text-white/80">{flight.departure}</span>
                                  {flight.departureTime && <span className="text-xs text-white/40">{flight.departureTime}</span>}
                                  <span className="text-white/30">&rarr;</span>
                                  <span className="font-medium text-white/80">{flight.arrival}</span>
                                  {flight.arrivalTime && <span className="text-xs text-white/40">{flight.arrivalTime}</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Accommodations */}
                      {trip.accommodations && (
                        <div>
                          <h4 className="text-sm font-semibold text-white/70 mb-2">Accommodations</h4>
                          <p className="text-sm text-white/60 p-3 rounded-xl bg-white/5">{trip.accommodations}</p>
                        </div>
                      )}

                      {/* Notes */}
                      {trip.notes && (
                        <div>
                          <h4 className="text-sm font-semibold text-white/70 mb-2">Notes</h4>
                          <p className="text-sm text-white/60 p-3 rounded-xl bg-white/5">{trip.notes}</p>
                        </div>
                      )}

                      {/* Packing List */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-white/70">Packing List</h4>
                          {totalPacking > 0 && (
                            <span className="text-xs text-white/40">{packedCount}/{totalPacking} packed</span>
                          )}
                        </div>

                        {/* Add packing item */}
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={packingInput}
                            onChange={(e) => setPackingInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAddPackingItem(trip.id); }}
                            placeholder="Add item..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors"
                          />
                          <button
                            onClick={() => handleAddPackingItem(trip.id)}
                            disabled={!packingInput.trim()}
                            className="px-3 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 disabled:opacity-30 transition-[background-color,opacity]"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                          </button>
                        </div>

                        {/* Packing items */}
                        <div className="space-y-1.5">
                          {trip.packingList.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 group">
                              <button
                                onClick={() => togglePackingItem(trip.id, item.id)}
                                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${item.packed ? 'bg-emerald-500 border-emerald-500' : 'border-white/30 hover:border-emerald-400'}`}
                              >
                                {item.packed && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                              </button>
                              <span className={`flex-1 text-sm ${item.packed ? 'line-through text-white/30' : 'text-white/80'}`}>{item.item}</span>
                              <button
                                onClick={() => deletePackingItem(trip.id, item.id)}
                                className="p-1 rounded-md text-white/0 group-hover:text-white/20 hover:!text-rose-400 transition-colors"
                              >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                              </button>
                            </div>
                          ))}
                          {totalPacking === 0 && (
                            <p className="text-white/30 text-xs text-center py-2">No items yet</p>
                          )}
                        </div>

                        {/* Packing progress bar */}
                        {totalPacking > 0 && (
                          <div className="mt-3">
                            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-[width] duration-500"
                                style={{ width: `${(packedCount / totalPacking) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Trip Modal */}
      {showAddTrip && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[60]" onClick={() => setShowAddTrip(false)} />
          <div className="fixed inset-0 z-[61] flex items-center justify-center p-4 overflow-y-auto">
            <div className="relative w-full max-w-lg rounded-[2rem] p-6 overflow-hidden my-8" style={glassModal}>
              <ModalShine />
              <div className="relative">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-semibold">New Trip</h3>
                  <button onClick={() => setShowAddTrip(false)} className="p-2 rounded-xl hover:bg-white/10 transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Destination */}
                  <div>
                    <label className={labelCls}>Destination</label>
                    <input
                      type="text"
                      value={newTrip.destination}
                      onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })}
                      placeholder="e.g. Tokyo, Japan"
                      autoFocus
                      className={inputCls}
                    />
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Start Date</label>
                      <input type="date" value={newTrip.startDate} onChange={(e) => setNewTrip({ ...newTrip, startDate: e.target.value })} className={inputCls + ' [color-scheme:dark]'} />
                    </div>
                    <div>
                      <label className={labelCls}>End Date</label>
                      <input type="date" value={newTrip.endDate} onChange={(e) => setNewTrip({ ...newTrip, endDate: e.target.value })} className={inputCls + ' [color-scheme:dark]'} />
                    </div>
                  </div>

                  {/* Flights */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className={labelCls + ' mb-0'}>Flights</label>
                      <button type="button" onClick={addFlightRow} className="text-xs text-cyan-400 hover:underline underline-offset-2">+ Add flight</button>
                    </div>
                    <div className="space-y-3">
                      {newTrip.flights.map((flight, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-white/5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-white/30">Flight {idx + 1}</span>
                            {newTrip.flights.length > 1 && (
                              <button type="button" onClick={() => removeFlightRow(idx)} className="text-xs text-rose-400/60 hover:text-rose-400">Remove</button>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input type="text" value={flight.airline} onChange={(e) => updateFlight(idx, 'airline', e.target.value)} placeholder="Airline" className={inputCls} />
                            <input type="text" value={flight.flightNumber} onChange={(e) => updateFlight(idx, 'flightNumber', e.target.value)} placeholder="Flight #" className={inputCls} />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input type="text" value={flight.departure} onChange={(e) => updateFlight(idx, 'departure', e.target.value)} placeholder="From (e.g. DTW)" className={inputCls} />
                            <input type="text" value={flight.arrival} onChange={(e) => updateFlight(idx, 'arrival', e.target.value)} placeholder="To (e.g. NRT)" className={inputCls} />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] text-white/30 mb-1">Departure Time</label>
                              <input type="time" value={flight.departureTime || ''} onChange={(e) => updateFlight(idx, 'departureTime', e.target.value)} className={inputCls + ' [color-scheme:dark]'} />
                            </div>
                            <div>
                              <label className="block text-[10px] text-white/30 mb-1">Arrival Time</label>
                              <input type="time" value={flight.arrivalTime || ''} onChange={(e) => updateFlight(idx, 'arrivalTime', e.target.value)} className={inputCls + ' [color-scheme:dark]'} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Accommodations */}
                  <div>
                    <label className={labelCls}>Hotel / Accommodations</label>
                    <input
                      type="text"
                      value={newTrip.accommodations}
                      onChange={(e) => setNewTrip({ ...newTrip, accommodations: e.target.value })}
                      placeholder="e.g. Park Hyatt Tokyo"
                      className={inputCls}
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className={labelCls}>Notes</label>
                    <textarea
                      value={newTrip.notes}
                      onChange={(e) => setNewTrip({ ...newTrip, notes: e.target.value })}
                      placeholder="Any travel notes..."
                      rows={2}
                      className={inputCls + ' resize-none'}
                    />
                  </div>

                  <button onClick={handleAddTrip} disabled={!newTrip.destination.trim() || !newTrip.startDate || !newTrip.endDate} className={btnPrimary}>
                    Add Trip
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
