'use client';

import React, { useState } from 'react';
import {
  Check,
  X,
  ExternalLink,
  Settings,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'productivity' | 'finance' | 'communication' | 'storage' | 'ai';
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  color: string;
}

const integrations: Integration[] = [
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Sync events and schedules',
    icon: '📅',
    category: 'productivity',
    status: 'connected',
    lastSync: '2 min ago',
    color: '#4285F4',
  },
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Email management & triage',
    icon: '✉️',
    category: 'communication',
    status: 'connected',
    lastSync: 'Just now',
    color: '#EA4335',
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    description: 'Cloud file storage',
    icon: '📁',
    category: 'storage',
    status: 'connected',
    lastSync: '10 min ago',
    color: '#34A853',
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Notes and databases',
    icon: '📝',
    category: 'productivity',
    status: 'connected',
    lastSync: '1 hr ago',
    color: '#000000',
  },
  {
    id: 'simplefin',
    name: 'SimpleFIN',
    description: 'Bank account sync',
    icon: '🏦',
    category: 'finance',
    status: 'connected',
    lastSync: '1 hr ago',
    color: '#10B981',
  },
  {
    id: 'monarch',
    name: 'Monarch Money',
    description: 'Budget tracking',
    icon: '👑',
    category: 'finance',
    status: 'connected',
    lastSync: '30 min ago',
    color: '#8B5CF6',
  },
  {
    id: 'claude',
    name: 'Claude AI',
    description: 'Your AI assistant',
    icon: '🤖',
    category: 'ai',
    status: 'connected',
    lastSync: 'Active',
    color: '#D97706',
  },
  {
    id: 'onedrive',
    name: 'OneDrive',
    description: 'Microsoft cloud storage',
    icon: '☁️',
    category: 'storage',
    status: 'disconnected',
    color: '#0078D4',
  },
];

const IntegrationCard = ({ integration }: { integration: Integration }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm`}
        style={{ 
          background: `linear-gradient(135deg, ${integration.color}40, ${integration.color}20)`,
        }}
      />
      
      <div className="relative bg-[#1a1a22] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all duration-300 cursor-pointer">
        <div className="absolute top-3 right-3">
          {integration.status === 'connected' && (
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          )}
          {integration.status === 'disconnected' && (
            <div className="w-2 h-2 rounded-full bg-gray-500" />
          )}
          {integration.status === 'error' && (
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          )}
        </div>

        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${integration.color}20` }}
        >
          <span className="text-2xl">{integration.icon}</span>
        </div>

        <h3 className="font-semibold text-white/90 mb-1">{integration.name}</h3>
        <p className="text-xs text-white/40 mb-3">{integration.description}</p>

        <div className="flex items-center justify-between">
          {integration.status === 'connected' ? (
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs text-emerald-400">Connected</span>
            </div>
          ) : integration.status === 'error' ? (
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs text-red-400">Error</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <X className="w-3.5 h-3.5 text-white/40" />
              <span className="text-xs text-white/40">Not connected</span>
            </div>
          )}

          {integration.lastSync && integration.status === 'connected' && (
            <span className="text-xs text-white/30">{integration.lastSync}</span>
          )}
        </div>

        <div className={`absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#1a1a22] to-transparent rounded-b-2xl transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center justify-center gap-2">
            {integration.status === 'connected' ? (
              <>
                <button className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white/80 flex items-center gap-1.5 transition-colors">
                  <RefreshCw className="w-3 h-3" /> Sync
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white/80 flex items-center gap-1.5 transition-colors">
                  <Settings className="w-3 h-3" /> Settings
                </button>
              </>
            ) : (
              <button 
                className="px-4 py-1.5 rounded-lg text-xs text-white font-medium flex items-center gap-1.5 transition-colors"
                style={{ backgroundColor: integration.color }}
              >
                <ExternalLink className="w-3 h-3" /> Connect
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function IntegrationsGrid() {
  const connectedCount = integrations.filter(i => i.status === 'connected').length;

  return (
    <section className="py-12 px-6">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold mb-2">Connected Services</h2>
        <p className="text-white/50 text-sm max-w-md mx-auto">
          Your integrations powering Life OS
        </p>
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-emerald-400">{connectedCount} of {integrations.length} connected</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {integrations.map((integration) => (
          <IntegrationCard key={integration.id} integration={integration} />
        ))}
      </div>
    </section>
  );
}
