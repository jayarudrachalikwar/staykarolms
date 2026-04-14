import React from 'react';
import staykaroLogo from '../assets/staykaro-logo.png';

export function StaykaroLogo({ className = '', size = 'normal' }: { className?: string, size?: 'small' | 'normal' | 'large' }) {
  const sizeStyles = {
    small: {
      containerGap: 'gap-2',
      markSize: 36,
      textFontSize: 16,
      taglineShow: false,
    },
    normal: {
      containerGap: 'gap-2.5',
      markSize: 44,
      textFontSize: 20,
      taglineShow: false,
    },
    large: {
      containerGap: 'gap-3',
      markSize: 64,
      textFontSize: 30,
      taglineShow: true,
    },
  } as const;

  const s = sizeStyles[size];

  return (
    <div className={`flex items-center whitespace-nowrap shrink-0 ${s.containerGap} ${className}`}>
      <img src={staykaroLogo} alt="StayKaro logo" style={{ width: s.markSize, height: s.markSize, objectFit: 'contain', flexShrink: 0 }} />

      {/* StayKaro text + optional tagline */}
      <div className="flex flex-col leading-none shrink-0">
        <span
          style={{
            fontWeight: 800,
            fontSize: s.textFontSize,
            color: '#ff0028',
            letterSpacing: '-0.5px',
            fontFamily: "'Arial Black', Arial, sans-serif",
            lineHeight: 1,
          }}
        >
          StayKaro Pvt Ltd
        </span>
        {s.taglineShow && (
          <span
            style={{
              fontSize: 11,
              color: '#6B7280',
              marginTop: 3,
              fontFamily: 'Arial, sans-serif',
              letterSpacing: '0.02em',
            }}
          >
            Premium Student Living Platform
          </span>
        )}
      </div>
    </div>
  );
}

// Backward-compat alias used throughout the app
export const EdRealmLogo = StaykaroLogo;
