import { useState } from 'react';
import { FidelityPage } from './components/FidelityPage';

export default function App() {
  // Para demonstração, vamos criar um estado para alternar entre os níveis
  const [level, setLevel] = useState<'bronze' | 'prata' | 'ouro' | 'ambassador'>('bronze');
  const [balance, setBalance] = useState(150);

  return (
    <div className="min-h-screen bg-[#F8F6FF]">
      {/* Controles de demonstração - remover em produção */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => setLevel('bronze')}
            className="px-3 py-1 rounded text-xs bg-white shadow-md"
            style={{ opacity: level === 'bronze' ? 1 : 0.5 }}
          >
            Bronze
          </button>
          <button
            onClick={() => setLevel('prata')}
            className="px-3 py-1 rounded text-xs bg-white shadow-md"
            style={{ opacity: level === 'prata' ? 1 : 0.5 }}
          >
            Prata
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setLevel('ouro')}
            className="px-3 py-1 rounded text-xs bg-white shadow-md"
            style={{ opacity: level === 'ouro' ? 1 : 0.5 }}
          >
            Ouro
          </button>
          <button
            onClick={() => setLevel('ambassador')}
            className="px-3 py-1 rounded text-xs bg-white shadow-md"
            style={{ opacity: level === 'ambassador' ? 1 : 0.5 }}
          >
            Ambassador
          </button>
        </div>
        {level === 'ambassador' && (
          <div className="bg-white shadow-md rounded p-2">
            <div className="text-xs mb-1">Saldo: R$ {balance}</div>
            <input
              type="range"
              min="0"
              max="400"
              step="50"
              value={balance}
              onChange={(e) => setBalance(Number(e.target.value))}
              className="w-full"
            />
          </div>
        )}
      </div>

      <FidelityPage level={level} balanceAmount={balance} />
    </div>
  );
}