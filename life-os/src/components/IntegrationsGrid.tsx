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
  // Productivity
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
    id: 'outlook-calendar',
    name: 'Outlook Calendar',
    description: 'Microsoft calendar sync',
    icon: '📆',
    category: 'productivity',
    status: 'connected',
    lastSync: '5 min ago',
    color: '#0078D4',
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
  
  // Communication
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
    id: 'outlook-mail',
    name: 'Outlook Mail',
    description: 'Microsoft email sync',
    icon: '📧',
    category: 'communication',
    status: 'connected',
    lastSync: '3 min ago',
    color: '#0078D4',
  },
  
  // Storage
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
    id: 'onedrive',
    name: 'OneDrive',
    description: 'Microsoft cloud storage',
    icon: '☁️',
    category: 'storage',
    status: 'disconnected',
    color: '#0078D4',
  },
  
  // Finance
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
    status: 'disconnected',
    color: '#8B5CF6',
  },
  
  // AI
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
  
  // Travel
  {
    id: 'delta',
    name: 'Delta SkyMiles',
    description: 'Flight tracking',
    icon: '✈️',
    category: 'productivity',
    status: 'disconnected',
    color: '#003366',
  },
];

// Brand icons as SVG components
const BrandIcons: Record<string, React.FC<{ className?: string }>> = {
  'google-calendar': ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="2" fill="#4285F4"/>
      <rect x="3" y="4" width="18" height="5" fill="#1967D2"/>
      <circle cx="8" cy="14" r="1.5" fill="white"/>
      <circle cx="12" cy="14" r="1.5" fill="white"/>
      <circle cx="16" cy="14" r="1.5" fill="white"/>
      <circle cx="8" cy="18" r="1.5" fill="white"/>
      <circle cx="12" cy="18" r="1.5" fill="white"/>
    </svg>
  ),
  'gmail': ({ className }) => (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" fill="#EA4335"/>
    </svg>
  ),
  'google-drive': ({ className }) => (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M8.267 14.68l-1.6 2.76H1.6L7.733 7.32l1.6 2.76-1.067 4.6z" fill="#0066DA"/>
      <path d="M22.4 17.44H8.267l1.6-2.76h10.933l1.6 2.76z" fill="#00AC47"/>
      <path d="M14.667 7.32l5.867 10.12-1.6 2.76L8.267 7.32h6.4z" fill="#FFBA00"/>
    </svg>
  ),
  'notion': ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 2.09c-.42-.326-.98-.7-2.055-.607L3.01 2.71c-.466.046-.56.28-.374.466l1.823 1.032zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.886l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952l1.448.327s0 .84-1.168.84l-3.22.186c-.094-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.62c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.886.747-.933l3.222-.186zM2.5 1.574L15.964.5c1.634-.14 2.055.04 2.708.513l3.735 2.614c.654.42.888.793.888 1.306v15.454c0 1.12-.42 1.773-1.868 1.866l-15.458.934c-1.073.046-1.587-.093-2.148-.746L1.14 18.89c-.606-.793-.886-1.447-.886-2.24V3.44c0-1.027.42-1.82 2.247-1.867z"/>
    </svg>
  ),
  'outlook-calendar': ({ className }) => (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M24 7.387v10.478c0 .23-.08.424-.238.576-.158.154-.352.232-.58.232h-8.547v-6.959l1.6 1.229c.102.078.222.117.36.117.14 0 .26-.039.36-.117l6.805-5.223c.078-.063.118-.143.16-.258v-.005c-.008-.014-.02-.03-.039-.043l-.018-.02c-.02-.018-.04-.034-.06-.05l-.026-.02c-.022-.015-.042-.028-.066-.04-.01-.006-.02-.01-.03-.016-.028-.012-.054-.023-.083-.03l-.012-.006c-.024-.006-.05-.012-.078-.015-.012-.002-.024-.002-.037-.003-.018 0-.037-.003-.055-.003H15.24l-1.3.996h10.285v.78l-7.84 6.025-7.838-6.024V7.39h2.963l-1.387-1.06H9.546v-.61L8.205 4.7v-.68c0-.23.08-.423.24-.575.158-.152.35-.23.58-.23h14.393c.228 0 .42.078.58.23.158.152.24.346.24.576v3.366H24zM8.842 5.58v-.002.002z" fill="#0078D4"/>
      <path d="M7.047 7.474l-.8-.61V4.7H0v14.515c0 .152.05.28.153.384.1.102.23.153.382.153h5.61v-5.39l1.185.91L7.047 7.474zM0 6.7h6.247l.8.612v7.9l-1.185-.907H0V6.7z" fill="#0078D4"/>
      <path d="M6.247 6.7v8.605l-1.185-.907L0 14.3v-7.6h6.247z" fill="#28A8EA"/>
      <path d="M0 19.5h6.145V14.4l-1.183-.905H0v6.005z" fill="#50D9FF"/>
    </svg>
  ),
  'outlook-mail': ({ className }) => (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M24 7.387v10.478c0 .23-.08.424-.238.576-.158.154-.352.232-.58.232h-8.547V11.03l1.6 1.23c.102.077.222.116.36.116.14 0 .26-.04.36-.117l6.805-5.223c.078-.063.118-.143.16-.258v-.005c-.008-.014-.02-.03-.039-.043l-.018-.02c-.02-.018-.04-.034-.06-.05l-.026-.02c-.022-.015-.042-.028-.066-.04-.01-.006-.02-.01-.03-.016-.028-.012-.054-.023-.083-.03l-.012-.006c-.024-.006-.05-.012-.078-.015-.012-.002-.024-.002-.037-.003-.018 0-.037-.003-.055-.003H15.24l-1.3.996h10.285v.78l-7.84 6.025-1.75-1.347v7.292h8.547c.228 0 .422-.078.58-.232.158-.152.238-.346.238-.576V7.387z" fill="#0078D4"/>
      <ellipse cx="7.212" cy="13.059" rx="7.212" ry="6.443" fill="#0078D4"/>
      <path d="M10.105 10.387c-.36-.383-.862-.574-1.506-.574-.654 0-1.16.19-1.52.57-.36.38-.54.914-.54 1.603v2.064c0 .69.18 1.226.54 1.607.36.38.866.57 1.52.57.644 0 1.147-.19 1.506-.57.36-.38.54-.917.54-1.607v-2.064c0-.69-.18-1.223-.54-1.6zm-.72 3.76c0 .357-.078.63-.233.82-.156.19-.38.284-.672.284-.293 0-.517-.095-.673-.284-.155-.19-.232-.463-.232-.82v-2.25c0-.36.077-.634.232-.825.156-.19.38-.286.673-.286.292 0 .516.096.672.286.155.19.232.465.232.824v2.25z" fill="white"/>
    </svg>
  ),
  'onedrive': ({ className }) => (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M19.453 10.11a5.498 5.498 0 00-8.98-2.08 3.5 3.5 0 00-5.55 1.35A4.5 4.5 0 005.5 18h13a4 4 0 00.953-7.89z" fill="#0078D4"/>
    </svg>
  ),
  'simplefin': ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="16" rx="2" fill="#10B981"/>
      <rect x="2" y="8" width="20" height="3" fill="#059669"/>
      <circle cx="6" cy="15" r="2" fill="white"/>
    </svg>
  ),
  'monarch': ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L2 9l10 7 10-7-10-7z" fill="#8B5CF6"/>
      <path d="M2 17l10 7 10-7M2 12l10 7 10-7" stroke="#8B5CF6" strokeWidth="2" fill="none"/>
    </svg>
  ),
  'claude': ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#D97706"/>
      <circle cx="12" cy="12" r="6" fill="#FCD34D"/>
      <circle cx="12" cy="12" r="3" fill="#D97706"/>
    </svg>
  ),
  'delta': ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L2 22h20L12 2z" fill="#003366"/>
    </svg>
  ),
};

// Integration Card Component
const IntegrationCard = ({ integration }: { integration: Integration }) => {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = BrandIcons[integration.id];

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect */}
      <div 
        className={`absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm`}
        style={{ 
          background: `linear-gradient(135deg, ${integration.color}40, ${integration.color}20)`,
        }}
      />
      
      <div className="relative bg-[#1a1a22] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all duration-300 cursor-pointer">
        {/* Status indicator */}
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

        {/* Icon */}
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${integration.color}20` }}
        >
          {IconComponent ? (
            <IconComponent className="w-7 h-7" />
          ) : (
            <span className="text-2xl">{integration.icon}</span>
          )}
        </div>

        {/* Content */}
        <h3 className="font-semibold text-white/90 mb-1">{integration.name}</h3>
        <p className="text-xs text-white/40 mb-3">{integration.description}</p>

        {/* Status & Actions */}
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

        {/* Hover Actions */}
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

// Main Integrations Grid Component
export default function IntegrationsGrid() {
  const categories = [
    { id: 'all', label: 'All Integrations' },
    { id: 'productivity', label: 'Productivity' },
    { id: 'communication', label: 'Communication' },
    { id: 'storage', label: 'Storage' },
    { id: 'finance', label: 'Finance' },
    { id: 'ai', label: 'AI' },
  ];

  const [activeCategory, setActiveCategory] = useState('all');

  const filteredIntegrations = activeCategory === 'all' 
    ? integrations 
    : integrations.filter(i => i.category === activeCategory);

  const connectedCount = integrations.filter(i => i.status === 'connected').length;

  return (
    <section className="py-16 px-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-3">Our Integrations</h2>
        <p className="text-white/50 max-w-md mx-auto">
          Connect your favorite tools and services to supercharge your Life OS experience.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm text-emerald-400">{connectedCount} of {integrations.length} connected</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              activeCategory === cat.id
                ? 'bg-violet-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-6xl mx-auto">
        {filteredIntegrations.map((integration) => (
          <IntegrationCard key={integration.id} integration={integration} />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-12">
        <p className="text-white/40 text-sm mb-4">Don't see your favorite tool?</p>
        <button className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-sm font-medium transition-colors border border-white/10 hover:border-white/20">
          Request Integration
        </button>
      </div>
    </section>
  );
}
