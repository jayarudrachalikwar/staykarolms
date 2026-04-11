import React from 'react';

export function TrailblizLogo({ className = '', size = 'normal' }: { className?: string, size?: 'small' | 'normal' | 'large' }) {
  const sizeStyles = {
    small: {
      containerGap: 'gap-2',
      markSize: 32,
      markFontSize: 11,
      textFontSize: 18,
      taglineShow: false,
    },
    normal: {
      containerGap: 'gap-2.5',
      markSize: 40,
      markFontSize: 13,
      textFontSize: 22,
      taglineShow: false,
    },
    large: {
      containerGap: 'gap-3',
      markSize: 60,
      markFontSize: 20,
      textFontSize: 34,
      taglineShow: true,
    },
  } as const;

  const s = sizeStyles[size];

  return (
    <div className={`flex items-center whitespace-nowrap shrink-0 ${s.containerGap} ${className}`}>
      {/* TB mark */}
      <div
        style={{
          width: s.markSize,
          height: s.markSize,
          borderRadius: s.markSize * 0.22,
          background: '#1A56DB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(26,86,219,0.30)',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            color: '#fff',
            fontWeight: 900,
            fontSize: s.markFontSize,
            letterSpacing: '-0.5px',
            fontFamily: 'Arial, sans-serif',
            lineHeight: 1,
          }}
        >
          TB
        </span>
      </div>

      {/* trailbliz text + optional tagline */}
      <div className="flex flex-col leading-none shrink-0">
        <span
          style={{
            fontWeight: 800,
            fontSize: s.textFontSize,
            color: '#1A56DB',
            letterSpacing: '-0.5px',
            fontFamily: "'Arial Black', Arial, sans-serif",
            lineHeight: 1,
          }}
        >
          trailbliz
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
            Empowering Students, Building Futures
          </span>
        )}
      </div>
    </div>
  );
}

// Backward-compat alias used throughout the app
export const EdRealmLogo = TrailblizLogo;
