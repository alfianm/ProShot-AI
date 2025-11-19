import React from 'react';
import { HeadshotStyle } from '../types';

interface StyleSelectorProps {
  selectedStyleId: string | null;
  onSelect: (style: HeadshotStyle) => void;
}

export const PREDEFINED_STYLES: HeadshotStyle[] = [
  {
    id: 'corporate',
    name: 'Corporate Professional',
    description: 'Grey gradient backdrop, soft studio lighting, business attire.',
    promptFragment: 'Generate a high-quality professional headshot. The subject should be wearing business professional attire. The background is a clean, neutral grey studio backdrop with soft, flattering lighting. High resolution, photorealistic.',
    icon: '🏢'
  },
  {
    id: 'startup',
    name: 'Modern Startup',
    description: 'Blurred modern office background, smart casual look.',
    promptFragment: 'Create a modern, approachable headshot suitable for a tech startup. The subject should wear smart casual clothing. The background is a bright, blurred modern open-plan office with glass and greenery. Natural lighting.',
    icon: '🚀'
  },
  {
    id: 'outdoor',
    name: 'Natural Outdoor',
    description: 'Golden hour lighting, nature bokeh background.',
    promptFragment: 'Generate a warm, natural headshot taken outdoors. The background is a soft bokeh of trees or a park during golden hour. The lighting is warm and sun-kissed. The subject appears relaxed and friendly.',
    icon: '🌳'
  },
  {
    id: 'studio-bw',
    name: 'Studio B&W',
    description: 'High contrast, artistic black and white portrait.',
    promptFragment: 'Create an artistic black and white studio headshot. High contrast lighting, dramatic shadows, sharp focus on the eyes. Plain black or dark grey background. Classic and timeless style.',
    icon: '📸'
  },
  {
    id: 'cyberpunk',
    name: 'Neon/Creative',
    description: 'Vibrant colors, neon lights, creative edge.',
    promptFragment: 'Generate a creative headshot with a cyberpunk aesthetic. Neon lighting in blue and pink hues illuminating the subject. Dark background with bokeh city lights. stylized and bold.',
    icon: '🌃'
  }
];

export const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyleId, onSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {PREDEFINED_STYLES.map((style) => (
        <button
          key={style.id}
          onClick={() => onSelect(style)}
          className={`
            relative flex flex-col items-start p-4 rounded-xl border-2 transition-all duration-200 text-left
            ${selectedStyleId === style.id 
              ? 'border-indigo-600 bg-indigo-50 shadow-md' 
              : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'}
          `}
        >
          <span className="text-2xl mb-2">{style.icon}</span>
          <h3 className={`font-semibold ${selectedStyleId === style.id ? 'text-indigo-900' : 'text-slate-800'}`}>
            {style.name}
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            {style.description}
          </p>
          
          {selectedStyleId === style.id && (
            <div className="absolute top-3 right-3 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};