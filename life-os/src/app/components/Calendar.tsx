'use client';
import React, { useState } from 'react';

const CalendarIcons = {
  ChevronLeft: ({ className = "w-5 h-5" }: { className?: string }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="15 18 9 12 15 6"/></svg>),
  ChevronRight: ({ className = "w-5 h-5" }: { className?: string }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="9 18 15 12 9 6"/></svg>),
  Plus: ({ className = "w-5 h-5" }: { className?: string }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>),
  Clock: ({ className = "w-4 h-4" }: { className?: string }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>),
  MapPin: ({ className = "w-4 h-4" }: { className?: string }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>),
  X: ({ className = "w-5 h-5" }: { className?: string }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
};

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  duration: string;
  location?: string;
  color: 'cyan' | 'violet' | 'pink' | 'emerald' | 'amber';
  type: 'meeting' | 'personal' | 'travel' | 'deadline' | 'reminder';
}

const eventColors: Record<string, string> = {
  cyan: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  violet: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  pink: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
};

const eventDots: Record<string, string> = {
  cyan: 'bg-cyan-400',
  violet: 'bg-violet-400',
  pink: 'bg-pink-400',
  emerald: 'bg-emerald-400',
  amber: 'bg-amber-400',
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventPanel, setShowEventPanel] = useState(false);

  const events: CalendarEvent[] = [
    { id: '1', title: 'Team Standup', date: new Date(2026, 0, 20), time: '9:00 AM', duration: '30 min', location: 'Zoom', color: 'cyan', type: 'meeting' },
    { id: '2', title: 'Denver Flight', date: new Date(2026, 2, 15), time: '2:30 PM', duration: '3h 45m', location: 'DTW → DEN', color: 'violet', type: 'travel' },
    { id: '3', title: 'Portfolio Review', date: new Date(2026, 0, 20), time: '2:00 PM', duration: '1 hour', location: 'Studio', color: 'pink', type: 'personal' },
    { id: '4', title: 'Pay Amex Statement', date: new Date(2026, 0, 21), time: '11:59 PM', duration: '', color: 'amber', type: 'deadline' },
    { id: '5', title: 'Boss Meeting - Trello', date: new Date(2026, 0, 20), time: '3:00 PM', duration: '1 hour', location: 'Office', color: 'emerald', type: 'meeting' },
    { id: '6', title: 'Gym Session', date: new Date(2026, 0, 20), time: '6:00 PM', duration: '1 hour', location: 'Fitness Center', color: 'emerald', type: 'personal' },
    { id: '7', title: 'Project Deadline', date: new Date(2026, 0, 25), time: '5:00 PM', duration: '', color: 'pink', type: 'deadline' },
    { id: '8', title: 'Dentist Appointment', date: new Date(2026, 0, 28), time: '3:00 PM', duration: '1 hour', location: 'Downtown Dental', color: 'cyan', type: 'personal' },
  ];

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return { daysInMonth: lastDay.getDate(), startingDay: firstDay.getDay() };
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
  };

  const getEventsForDay = (day: number) => events.filter(event => event.date.getDate() === day && event.date.getMonth() === currentDate.getMonth() && event.date.getFullYear() === currentDate.getFullYear());

  const handleDayClick = (day: number) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    setShowEventPanel(true);
  };

  const selectedDateEvents = selectedDate ? events.filter(event => event.date.getDate() === selectedDate.getDate() && event.date.getMonth() === selectedDate.getMonth() && event.date.getFullYear() === selectedDate.getFullYear()) : [];

  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcomingEvents = events.filter(event => event.date >= today && event.date <= nextWeek).sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold">Calendar</h2>
          <p className="text-white/60 text-sm">Manage your schedule</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/25">
          <CalendarIcons.Plus className="w-4 h-4" />
          <span>Add Event</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 liquid-glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-white/10 transition-colors"><CalendarIcons.ChevronLeft /></button>
            <h3 className="text-xl font-semibold">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
            <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-white/10 transition-colors"><CalendarIcons.ChevronRight /></button>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
            {dayNames.map(day => (<div key={day} className="text-center text-xs sm:text-sm text-white/50 font-medium py-2">{day}</div>))}
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {Array.from({ length: startingDay }).map((_, index) => (<div key={`empty-${index}`} className="aspect-square" />))}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const dayEvents = getEventsForDay(day);
              const hasEvents = dayEvents.length > 0;
              return (
                <button key={day} onClick={() => handleDayClick(day)} className={`aspect-square rounded-lg sm:rounded-xl border transition-all duration-300 flex flex-col items-center justify-start pt-1 sm:pt-2 gap-0.5 sm:gap-1 ${isToday(day) ? 'bg-gradient-to-br from-violet-500/40 to-cyan-500/30 border-violet-400/60 shadow-[0_0_20px_rgba(139,92,246,0.4)]' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}`}>
                  <span className={`text-xs sm:text-sm font-medium ${isToday(day) ? 'text-white' : 'text-white/80'}`}>{day}</span>
                  {hasEvents && (<div className="flex gap-0.5 flex-wrap justify-center px-0.5">{dayEvents.slice(0, 3).map((event, i) => (<div key={i} className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${eventDots[event.color]}`} />))}{dayEvents.length > 3 && (<span className="text-[8px] text-white/50">+{dayEvents.length - 3}</span>)}</div>)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="liquid-glass rounded-2xl p-5 text-center">
            <p className="text-white/50 text-xs uppercase tracking-widest">Today</p>
            <p className="text-5xl font-bold mt-2 bg-gradient-to-br from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">{new Date().getDate()}</p>
            <p className="text-white/60 mt-1 text-sm">{dayNames[new Date().getDay()]}, {monthNames[new Date().getMonth()]}</p>
          </div>

          <div className="liquid-glass rounded-2xl p-5">
            <h4 className="font-semibold mb-4 text-white/90 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>Upcoming</h4>
            <div className="space-y-2">
              {upcomingEvents.length > 0 ? upcomingEvents.map(event => (
                <div key={event.id} className={`p-3 rounded-xl border ${eventColors[event.color]} transition-all hover:scale-[1.02] cursor-pointer`}>
                  <p className="font-medium text-sm">{event.title}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs opacity-80">
                    <CalendarIcons.Clock className="w-3 h-3" />
                    <span>{event.date.getMonth() === new Date().getMonth() && event.date.getDate() === new Date().getDate() ? 'Today' : event.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • {event.time}</span>
                  </div>
                </div>
              )) : <p className="text-white/40 text-sm text-center py-4">No upcoming events</p>}
            </div>
          </div>

          <div className="liquid-glass rounded-2xl p-5">
            <h4 className="font-semibold mb-3 text-white/90">This Month</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 rounded-lg bg-white/5"><span className="text-white/60 text-sm">Events</span><span className="font-bold text-lg">{events.filter(e => e.date.getMonth() === currentDate.getMonth()).length}</span></div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-white/5"><span className="text-white/60 text-sm">Meetings</span><span className="font-bold text-lg text-cyan-400">{events.filter(e => e.type === 'meeting' && e.date.getMonth() === currentDate.getMonth()).length}</span></div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-white/5"><span className="text-white/60 text-sm">Deadlines</span><span className="font-bold text-lg text-amber-400">{events.filter(e => e.type === 'deadline' && e.date.getMonth() === currentDate.getMonth()).length}</span></div>
            </div>
          </div>
        </div>
      </div>

      {showEventPanel && selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowEventPanel(false)}>
          <div className="liquid-glass rounded-2xl p-6 w-full max-w-md border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">{selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}</h3>
                <p className="text-white/50 text-sm">{selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <button onClick={() => setShowEventPanel(false)} className="p-2 rounded-xl hover:bg-white/10 transition-colors"><CalendarIcons.X /></button>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {selectedDateEvents.length > 0 ? selectedDateEvents.map(event => (
                <div key={event.id} className={`p-4 rounded-xl border ${eventColors[event.color]}`}>
                  <p className="font-semibold">{event.title}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm opacity-80"><CalendarIcons.Clock className="w-4 h-4" /><span>{event.time}{event.duration && ` • ${event.duration}`}</span></div>
                  {event.location && (<div className="flex items-center gap-2 mt-1 text-sm opacity-80"><CalendarIcons.MapPin className="w-4 h-4" /><span>{event.location}</span></div>)}
                </div>
              )) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center"><CalendarIcons.Plus className="w-8 h-8 text-white/30" /></div>
                  <p className="text-white/50 mb-4">No events scheduled</p>
                  <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500/20 to-cyan-500/20 text-white border border-violet-500/30 hover:border-violet-400/50 transition-colors">Add Event</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
