interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'light' | 'dark';
}

export function Logo({ size = 'medium', variant = 'dark' }: LogoProps) {
  const dimensions = {
    small: { width: 60, height: 40, fontSize: 18 },
    medium: { width: 100, height: 60, fontSize: 32 },
    large: { width: 140, height: 80, fontSize: 44 }
  };

  const dim = dimensions[size];
  const textColor = variant === 'light' ? '#FFFFFF' : '#070738';

  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        style={{ 
          fontFamily: 'Playfair Display, serif',
          fontWeight: 700,
          fontSize: dim.fontSize,
          color: textColor,
          letterSpacing: '0.05em',
          lineHeight: 1
        }}
      >
        EIC
      </div>
      {size !== 'small' && (
        <div 
          style={{
            fontSize: size === 'large' ? 9 : 7,
            letterSpacing: '0.15em',
            color: variant === 'light' ? 'rgba(255,255,255,0.8)' : '#6B3FA0',
            marginTop: 2,
            fontWeight: 500,
            textTransform: 'uppercase'
          }}
        >
          Escola de Idiomas e Cultura
        </div>
      )}
    </div>
  );
}
