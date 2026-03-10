import { Star, Users, CheckCircle2, Gift, Trophy, Award, UserPlus, Download, HelpCircle, Crown } from 'lucide-react';
import { Logo } from './Logo';

interface FidelityPageProps {
  level: 'bronze' | 'prata' | 'ouro' | 'ambassador';
  balanceAmount?: number; // Para Ambassador, valor acumulado
}

export function FidelityPage({ level, balanceAmount = 150 }: FidelityPageProps) {
  // Configurações por nível
  const levelConfig = {
    bronze: {
      icon: Star,
      name: 'Bronze',
      phrase: 'Você deu o primeiro passo!',
      subPhrase: 'Continue indicando para subir de nível.',
      enrolled: 1,
      total: 4,
      benefit: 'Reconhecimento + Badge',
      remainingMessage: 'Falta 1 matrícula para o nível Prata',
      referrals: [
        { name: 'João Pedro Santos', date: '15/01/2026', status: 'Matriculado' },
        { name: 'Ana Carolina Lima', date: '10/01/2026', status: 'Em avaliação' },
      ],
      showCertificate: false,
      showBalance: false
    },
    prata: {
      icon: Star,
      name: 'Prata',
      phrase: 'Você está quase lá!',
      subPhrase: 'Mais 1 matrícula para o nível Ouro.',
      enrolled: 2,
      total: 4,
      benefit: 'Reconhecimento + Badge',
      remainingMessage: 'Falta 1 matrícula para o nível Ouro',
      referrals: [
        { name: 'João Pedro Santos', date: '15/01/2026', status: 'Matriculado' },
        { name: 'Ana Carolina Lima', date: '10/01/2026', status: 'Matriculado' },
        { name: 'Lucas Ferreira', date: '05/01/2026', status: 'Aguardando contato' },
      ],
      showCertificate: false,
      showBalance: false
    },
    ouro: {
      icon: Star,
      name: 'Ouro',
      phrase: 'Você chegou no Ouro!',
      subPhrase: 'Seu próximo mês é por nossa conta.',
      extraPhrase: 'E seu Certificado Ambassador está pronto para baixar.',
      enrolled: 3,
      total: 4,
      benefit: '1 mês grátis (R$ 320)',
      remainingMessage: 'Falta 1 matrícula para se tornar Ambassador',
      referrals: [
        { name: 'João Pedro Santos', date: '15/01/2026', status: 'Matriculado' },
        { name: 'Ana Carolina Lima', date: '10/01/2026', status: 'Matriculado' },
        { name: 'Lucas Ferreira', date: '05/01/2026', status: 'Matriculado' },
        { name: 'Mariana Costa', date: '28/12/2025', status: 'Em avaliação' },
      ],
      showCertificate: true,
      showBalance: false
    },
    ambassador: {
      icon: Crown,
      name: 'Ambassador',
      phrase: 'Você é um Embaixador EIC!',
      subPhrase: 'A cada nova matrícula você acumula R$50.',
      extraPhrase: 'Junte R$350 e troque pelo material didático.',
      enrolled: 4,
      total: 4,
      benefit: 'R$ 50 por matrícula',
      remainingMessage: 'Você chegou ao nível máximo!',
      referrals: [
        { name: 'João Pedro Santos', date: '15/01/2026', status: 'Matriculado' },
        { name: 'Ana Carolina Lima', date: '10/01/2026', status: 'Matriculado' },
        { name: 'Lucas Ferreira', date: '05/01/2026', status: 'Matriculado' },
        { name: 'Mariana Costa', date: '28/12/2025', status: 'Matriculado' },
        { name: 'Rafael Oliveira', date: '20/12/2025', status: 'Em avaliação' },
      ],
      showCertificate: true,
      showBalance: true
    }
  };

  const config = levelConfig[level];
  const LevelIcon = config.icon;
  const progress = (config.enrolled / config.total) * 100;
  
  // Cálculo do saldo para Ambassador
  const balanceProgress = (balanceAmount / 350) * 100;
  const remainingBalance = 350 - balanceAmount;
  const canRedeem = balanceAmount >= 350;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Matriculado':
        return 'bg-green-100 text-green-700';
      case 'Em avaliação':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getBadgeStyle = (level: string) => {
    switch (level) {
      case 'bronze':
        return {
          gradient: 'linear-gradient(135deg, #E8A87C 0%, #CD7F32 50%, #A0522D 100%)',
          shadow: '0 8px 24px rgba(205,127,50,0.45)',
          pillBg: '#FEF3C7',
          pillText: '#92400E'
        };
      case 'prata':
        return {
          gradient: 'linear-gradient(135deg, #E8E8F0 0%, #B0B8C8 50%, #8892A4 100%)',
          shadow: '0 8px 24px rgba(136,146,164,0.45)',
          pillBg: '#F3F4F6',
          pillText: '#374151'
        };
      case 'ouro':
        return {
          gradient: 'linear-gradient(135deg, #FFE566 0%, #F5A800 50%, #D4870A 100%)',
          shadow: '0 8px 24px rgba(245,168,0,0.55)',
          pillBg: '#FEF9C3',
          pillText: '#92400E'
        };
      case 'ambassador':
        return {
          gradient: 'linear-gradient(135deg, #FF8C42 0%, #FF5C00 50%, #6B3FA0 100%)',
          shadow: '0 8px 24px rgba(107,63,160,0.55)',
          pillBg: '#EDE7F6',
          pillText: '#6B3FA0'
        };
      default:
        return {
          gradient: 'linear-gradient(135deg, #E8A87C 0%, #CD7F32 50%, #A0522D 100%)',
          shadow: '0 8px 24px rgba(205,127,50,0.45)',
          pillBg: '#FEF3C7',
          pillText: '#92400E'
        };
    }
  };

  const badgeStyle = getBadgeStyle(level);

  return (
    <div className="max-w-[430px] mx-auto min-h-screen" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      {/* 1. HEADER - Versão limpa e elegante */}
      <header 
        className="px-6 py-6 text-white"
        style={{
          background: 'linear-gradient(135deg, #FF5C00 0%, #6B3FA0 50%, #070738 100%)'
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <Logo size="small" variant="light" />
          <div className="text-xs opacity-70">1º Sem 2026</div>
        </div>
        <div>
          <div className="text-xs opacity-80 mb-1">Olá,</div>
          <h2 
            className="text-2xl"
            style={{ 
              fontFamily: 'Playfair Display, serif',
              fontWeight: 700
            }}
          >
            Maria Silva
          </h2>
        </div>
      </header>

      <div className="px-4 pb-8">
        {/* 2. CARD DE NÍVEL ATUAL */}
        <div 
          className="bg-white rounded-2xl p-6 -mt-4 mb-4 text-center relative"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
        >
          {/* Badge com anel animado apenas no Ambassador */}
          <div className="relative inline-block mb-4">
            {level === 'ambassador' && (
              <div 
                className="absolute -inset-2 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #FF5C00, #F5A800, #6B3FA0, #FF5C00)',
                  backgroundSize: '300% 100%',
                  animation: 'shimmer 3s linear infinite',
                  opacity: 0.6
                }}
              />
            )}
            <div 
              className="relative rounded-full flex items-center justify-center"
              style={{ 
                background: badgeStyle.gradient,
                boxShadow: badgeStyle.shadow,
                width: level === 'ambassador' ? '140px' : '120px',
                height: level === 'ambassador' ? '140px' : '120px'
              }}
            >
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%)'
                }}
              />
              <LevelIcon 
                size={level === 'ambassador' ? 56 : 48} 
                className="relative z-10"
                style={{ color: '#FFFFFF' }} 
              />
            </div>
          </div>

          <div 
            className="inline-block px-4 py-1 rounded-full text-xs font-semibold mb-3"
            style={{ 
              backgroundColor: badgeStyle.pillBg,
              color: badgeStyle.pillText
            }}
          >
            {config.name.toUpperCase()}
          </div>

          <h3 
            className="text-2xl mb-2"
            style={{ 
              fontFamily: 'Playfair Display, serif',
              fontWeight: 700,
              color: '#070738'
            }}
          >
            {config.phrase}
          </h3>
          <p className="text-sm text-gray-600 mb-1">{config.subPhrase}</p>
          {config.extraPhrase && (
            <p className="text-xs text-gray-500">{config.extraPhrase}</p>
          )}
        </div>

        {/* Celebração especial para Ouro */}
        {level === 'ouro' && (
          <div 
            className="rounded-2xl p-6 text-white text-center mb-4"
            style={{
              background: 'linear-gradient(135deg, #FFE566 0%, #F5A800 50%, #D4870A 100%)',
              boxShadow: '0 4px 20px rgba(245,168,0,0.3)'
            }}
          >
            <Trophy size={32} className="mx-auto mb-3" />
            <h3 
              className="text-xl mb-2"
              style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600 }}
            >
              Seu próximo mês é por nossa conta!
            </h3>
            <p className="text-sm opacity-90">
              Você ganhou 1 mensalidade grátis no valor de R$ 320
            </p>
          </div>
        )}

        {/* 3. MÉTRICAS — 3 CARDS HORIZONTAIS */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded-2xl p-4 text-center" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <Users size={24} className="mx-auto mb-2" style={{ color: '#FF5C00' }} />
            <div className="text-2xl mb-1" style={{ color: '#070738', fontWeight: 600 }}>
              {config.referrals.length}
            </div>
            <div className="text-xs text-gray-600">Indicações</div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 text-center" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <CheckCircle2 size={24} className="mx-auto mb-2" style={{ color: '#22c55e' }} />
            <div className="text-2xl mb-1" style={{ color: '#070738', fontWeight: 600 }}>
              {config.enrolled}
            </div>
            <div className="text-xs text-gray-600">Matriculados</div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 text-center" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <Gift size={24} className="mx-auto mb-2" style={{ color: '#F5A800' }} />
            <div className="text-xs mb-1 leading-tight" style={{ color: '#070738', fontWeight: 600 }}>
              {config.benefit}
            </div>
            <div className="text-xs text-gray-600">Benefício</div>
          </div>
        </div>

        {/* 4. BARRA DE PROGRESSO (exceto Ambassador) */}
        {!config.showBalance && (
          <div className="bg-white rounded-2xl p-6 mb-4" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={20} style={{ color: '#6B3FA0' }} />
              <h4 className="text-sm" style={{ color: '#070738', fontWeight: 600 }}>
                {config.remainingMessage}
              </h4>
            </div>
            
            <div className="mb-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-500"
                  style={{ 
                    width: `${progress}%`,
                    backgroundColor: '#6B3FA0'
                  }}
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-center flex-1">
                <div 
                  className="w-3 h-3 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: config.enrolled >= 1 ? '#CD7F32' : '#e5e7eb' }}
                />
                <div className="text-xs text-gray-600">Bronze</div>
              </div>
              <div className="text-center flex-1">
                <div 
                  className="w-3 h-3 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: config.enrolled >= 2 ? '#B0B8C8' : '#e5e7eb' }}
                />
                <div className="text-xs text-gray-600">Prata</div>
              </div>
              <div className="text-center flex-1">
                <div 
                  className="w-3 h-3 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: config.enrolled >= 3 ? '#F5A800' : '#e5e7eb' }}
                />
                <div className="text-xs text-gray-600">Ouro</div>
              </div>
              <div className="text-center flex-1">
                <div 
                  className="w-3 h-3 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: config.enrolled >= 4 ? '#6B3FA0' : '#e5e7eb' }}
                />
                <div className="text-xs text-gray-600">Ambassador</div>
              </div>
            </div>
          </div>
        )}

        {/* 5. CARD DE SALDO (apenas Ambassador) */}
        {config.showBalance && (
          <div 
            className="bg-white rounded-2xl p-6 mb-4"
            style={{ 
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              border: '2px solid #6B3FA0'
            }}
          >
            <h4 className="text-sm text-gray-600 mb-2">Seu saldo</h4>
            <div 
              className="text-4xl mb-3"
              style={{ 
                fontFamily: 'Playfair Display, serif',
                fontWeight: 700,
                color: '#FF5C00'
              }}
            >
              R$ {balanceAmount}
            </div>
            <p className="text-xs text-gray-600 mb-4">
              A cada nova matrícula confirmada, você acumula R$50
            </p>

            <div className="mb-3">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min(balanceProgress, 100)}%`,
                    backgroundColor: canRedeem ? '#F5A800' : '#6B3FA0'
                  }}
                />
              </div>
            </div>

            {!canRedeem ? (
              <p className="text-sm text-gray-600">
                Faltam <span style={{ color: '#FF5C00', fontWeight: 600 }}>R$ {remainingBalance}</span> para resgatar o material didático
              </p>
            ) : (
              <button 
                className="w-full py-3 rounded-xl text-white font-semibold transition-transform active:scale-98 mt-2"
                style={{ backgroundColor: '#FF5C00' }}
              >
                Resgatar material didático
              </button>
            )}
          </div>
        )}

        {/* 6. LISTA DE INDICADOS */}
        <div className="mb-4">
          <h3 
            className="text-2xl mb-4"
            style={{ 
              fontFamily: 'Playfair Display, serif',
              fontWeight: 600,
              color: '#070738'
            }}
          >
            Suas Indicações
          </h3>
          
          <div className="space-y-3">
            {config.referrals.map((referral, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-4"
                style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium" style={{ color: '#070738' }}>
                    {referral.name}
                  </h4>
                  <span 
                    className={`text-xs px-3 py-1 rounded-full ${getStatusColor(referral.status)}`}
                  >
                    {referral.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Indicado em {referral.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 7. BOTÃO DE AÇÃO */}
        <button 
          className="w-full py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 mb-4 transition-transform active:scale-98"
          style={{ backgroundColor: '#FF5C00' }}
        >
          <UserPlus size={20} />
          Indicar um Amigo
        </button>

        {/* 8. CARD DO CERTIFICADO (Ouro e Ambassador) */}
        {config.showCertificate && (
          <div 
            className="rounded-2xl p-6 text-white text-center mb-4"
            style={{
              background: 'linear-gradient(135deg, #FF5C00 0%, #6B3FA0 100%)',
              boxShadow: '0 4px 20px rgba(255,92,0,0.3)'
            }}
          >
            <div 
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: 'rgba(245,168,0,0.3)' }}
            >
              <Award size={32} style={{ color: '#F5A800' }} />
            </div>
            <h3 
              className="text-xl mb-2"
              style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600 }}
            >
              Seu Certificado Ambassador está pronto!
            </h3>
            <p className="text-sm mb-4 opacity-90">
              Baixe, imprima e compartilhe.
            </p>
            
            {level === 'ouro' ? (
              <div className="space-y-2">
                <button 
                  className="w-full bg-white text-gray-800 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <Download size={18} />
                  Ver Certificado
                </button>
                <button 
                  className="w-full bg-transparent text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-transform active:scale-95"
                  style={{ border: '2px solid white' }}
                >
                  <HelpCircle size={18} />
                  Como usar meu mês grátis?
                </button>
              </div>
            ) : (
              <button 
                className="bg-white text-gray-800 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 mx-auto transition-transform active:scale-95"
              >
                <Download size={18} />
                Ver Certificado
              </button>
            )}
          </div>
        )}

        {/* 9. RODAPÉ */}
        <footer className="text-center pt-8 pb-4">
          <Logo size="small" variant="dark" />
          <p className="text-sm mb-2 mt-2" style={{ color: '#6B3FA0', fontWeight: 500 }}>
            eicschool.com.br
          </p>
          <p className="text-xs text-gray-500 px-8">
            Este link é exclusivo para você.
          </p>
        </footer>
      </div>

      {/* Animação do anel do Ambassador */}
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 300% 50%;
          }
        }
      `}</style>
    </div>
  );
}
