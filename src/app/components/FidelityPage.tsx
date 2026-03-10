import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Star, Users, CheckCircle2, Gift, Trophy, Award,
  UserPlus, Download, HelpCircle, Crown, X, Loader2
} from "lucide-react";
import { useFidelidade, type Nivel } from "../../hooks/useFidelidade";

function Logo({ size = "small", variant = "light" }: { size?: "small" | "medium"; variant?: "light" | "dark" }) {
  const textColor = variant === "light" ? "#FFFFFF" : "#070738";
  const fontSize = size === "small" ? "11px" : "13px";
  return (
    <div className="flex items-center gap-2">
      <div
        className="rounded-full flex items-center justify-center font-bold text-white"
        style={{
          width: size === "small" ? 28 : 36,
          height: size === "small" ? 28 : 36,
          background: "linear-gradient(135deg, #FF5C00, #6B3FA0)",
          fontSize: size === "small" ? 13 : 16,
        }}
      >
        C
      </div>
      <div>
        <div style={{ color: textColor, fontWeight: 700, fontSize, letterSpacing: "0.05em", fontFamily: "DM Sans, sans-serif" }}>
          ESCOLA DE IDIOMAS
        </div>
        <div style={{ color: textColor, fontWeight: 400, fontSize: "9px", opacity: 0.8, letterSpacing: "0.08em" }}>
          E CULTURA
        </div>
      </div>
    </div>
  );
}

function getBadgeStyle(nivel: Nivel) {
  switch (nivel) {
    case "bronze": return {
      gradient: "linear-gradient(135deg, #E8A87C 0%, #CD7F32 50%, #A0522D 100%)",
      shadow: "0 8px 24px rgba(205,127,50,0.45)",
      pillBg: "#FEF3C7", pillText: "#92400E"
    };
    case "prata": return {
      gradient: "linear-gradient(135deg, #E8E8F0 0%, #B0B8C8 50%, #8892A4 100%)",
      shadow: "0 8px 24px rgba(136,146,164,0.45)",
      pillBg: "#F3F4F6", pillText: "#374151"
    };
    case "ouro": return {
      gradient: "linear-gradient(135deg, #FFE566 0%, #F5A800 50%, #D4870A 100%)",
      shadow: "0 8px 24px rgba(245,168,0,0.55)",
      pillBg: "#FEF9C3", pillText: "#92400E"
    };
    case "ambassador": return {
      gradient: "linear-gradient(135deg, #FF8C42 0%, #FF5C00 50%, #6B3FA0 100%)",
      shadow: "0 8px 24px rgba(107,63,160,0.55)",
      pillBg: "#EDE7F6", pillText: "#6B3FA0"
    };
  }
}

function getNivelConfig(nivel: Nivel, matriculados: number) {
  const configs = {
    bronze: {
      icon: Star, name: "Bronze",
      phrase: "Você deu o primeiro passo!",
      subPhrase: "Continue indicando para subir de nível.",
      remainingMessage: `Falta ${2 - matriculados} matrícula para o nível Prata`,
      showCertificate: false, showBalance: false,
    },
    prata: {
      icon: Star, name: "Prata",
      phrase: "Você está quase lá!",
      subPhrase: "Mais 1 matrícula para o nível Ouro.",
      remainingMessage: "Falta 1 matrícula para o nível Ouro",
      showCertificate: false, showBalance: false,
    },
    ouro: {
      icon: Trophy, name: "Ouro",
      phrase: "Você chegou no Ouro!",
      subPhrase: "Seu próximo mês é por nossa conta.",
      extraPhrase: "E seu Certificado Ambassador está pronto para baixar.",
      remainingMessage: "Falta 1 matrícula para se tornar Ambassador",
      showCertificate: true, showBalance: false,
    },
    ambassador: {
      icon: Crown, name: "Ambassador",
      phrase: "Você é um Embaixador EIC!",
      subPhrase: "A cada nova matrícula você acumula R$50.",
      extraPhrase: "Junte R$350 e troque pelo material didático.",
      remainingMessage: "Você chegou ao nível máximo!",
      showCertificate: true, showBalance: true,
    },
  };
  return configs[nivel];
}

function getStatusColor(status: string) {
  switch (status) {
    case "Matriculado": return "bg-green-100 text-green-700";
    case "Em avaliação": return "bg-yellow-100 text-yellow-700";
    case "Aguardando confirmação": return "bg-blue-100 text-blue-700";
    default: return "bg-gray-100 text-gray-600";
  }
}

interface ModalIndicacaoProps {
  onClose: () => void;
  onSubmit: (dados: { nomeIndicado: string; whatsappIndicado: string }) => Promise<void>;
  enviando: boolean;
}

function ModalIndicacao({ onClose, onSubmit, enviando }: ModalIndicacaoProps) {
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const handleSubmit = async () => {
    if (!nome.trim() || !whatsapp.trim()) return;
    await onSubmit({ nomeIndicado: nome.trim(), whatsappIndicado: whatsapp.trim() });
    setSucesso(true);
    setTimeout(() => {
      setSucesso(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="w-full max-w-[430px] bg-white rounded-t-3xl p-6 pb-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold" style={{ fontFamily: "Playfair Display, serif", color: "#070738" }}>
            Indicar um Amigo
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {sucesso ? (
          <div className="text-center py-8">
            <CheckCircle2 size={48} className="mx-auto mb-3" style={{ color: "#22c55e" }} />
            <p className="font-semibold text-lg" style={{ color: "#070738" }}>Indicação enviada!</p>
            <p className="text-sm text-gray-500 mt-1">Aguarde a confirmação da EIC.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">
              Preencha os dados do seu amigo. A indicação será confirmada pela equipe EIC.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#070738" }}>
                  Nome completo
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome do seu amigo"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-400 text-sm"
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#070738" }}>
                  WhatsApp
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-400 text-sm"
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={enviando || !nome.trim() || !whatsapp.trim()}
              className="w-full py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 transition-opacity disabled:opacity-50"
              style={{ backgroundColor: "#FF5C00" }}
            >
              {enviando ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <UserPlus size={20} />
                  Enviar Indicação
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function FidelityPage() {
  const { responsavelId } = useParams<{ responsavelId: string }>();
  const {
    indicacoes, responsavel, loading, enviando,
    nivel, matriculados, saldoAcumulado,
    adicionarIndicacao, setResponsavel,
  } = useFidelidade(responsavelId ?? "");

  const [modalAberto, setModalAberto] = useState(false);

  // Se ainda carregando e não tem responsável, tenta buscar pelo ID
  // Caso o pai nunca tenha tido indicações, precisamos de um fallback
  const nomeResponsavel = responsavel?.nome ?? "Olá!";

  const config = getNivelConfig(nivel, matriculados);
  const badgeStyle = getBadgeStyle(nivel);
  const LevelIcon = config.icon;
  const progress = Math.min((matriculados / 4) * 100, 100);
  const balanceProgress = Math.min((saldoAcumulado / 350) * 100, 100);
  const canRedeem = saldoAcumulado >= 350;
  const remainingBalance = 350 - saldoAcumulado;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F8F6FF" }}>
        <Loader2 size={32} className="animate-spin" style={{ color: "#6B3FA0" }} />
      </div>
    );
  }

  return (
    <div className="max-w-[430px] mx-auto min-h-screen" style={{ fontFamily: "DM Sans, sans-serif" }}>
      {/* HEADER */}
      <header
        className="px-6 py-6 text-white"
        style={{ background: "linear-gradient(135deg, #FF5C00 0%, #6B3FA0 50%, #070738 100%)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <Logo size="small" variant="light" />
          <div className="text-xs opacity-70">1º Sem 2026</div>
        </div>
        <div>
          <div className="text-xs opacity-80 mb-1">Olá,</div>
          <h2 className="text-2xl" style={{ fontFamily: "Playfair Display, serif", fontWeight: 700 }}>
            {nomeResponsavel}
          </h2>
        </div>
      </header>

      <div className="px-4 pb-8">
        {/* CARD DE NÍVEL */}
        <div className="bg-white rounded-2xl p-6 -mt-4 mb-4 text-center relative" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          <div className="relative inline-block mb-4">
            {nivel === "ambassador" && (
              <div
                className="absolute -inset-2 rounded-full"
                style={{
                  background: "linear-gradient(90deg, #FF5C00, #F5A800, #6B3FA0, #FF5C00)",
                  backgroundSize: "300% 100%",
                  animation: "shimmer 3s linear infinite",
                  opacity: 0.6,
                }}
              />
            )}
            <div
              className="relative rounded-full flex items-center justify-center"
              style={{
                background: badgeStyle.gradient,
                boxShadow: badgeStyle.shadow,
                width: nivel === "ambassador" ? 140 : 120,
                height: nivel === "ambassador" ? 140 : 120,
              }}
            >
              <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%)" }} />
              <LevelIcon size={nivel === "ambassador" ? 56 : 48} className="relative z-10" style={{ color: "#FFFFFF" }} />
            </div>
          </div>

          <div className="inline-block px-4 py-1 rounded-full text-xs font-semibold mb-3" style={{ backgroundColor: badgeStyle.pillBg, color: badgeStyle.pillText }}>
            {config.name.toUpperCase()}
          </div>

          <h3 className="text-2xl mb-2" style={{ fontFamily: "Playfair Display, serif", fontWeight: 700, color: "#070738" }}>
            {config.phrase}
          </h3>
          <p className="text-sm text-gray-600 mb-1">{config.subPhrase}</p>
          {"extraPhrase" in config && config.extraPhrase && (
            <p className="text-xs text-gray-500">{config.extraPhrase}</p>
          )}
        </div>

        {/* CELEBRAÇÃO OURO */}
        {nivel === "ouro" && (
          <div className="rounded-2xl p-6 text-white text-center mb-4" style={{ background: "linear-gradient(135deg, #FFE566 0%, #F5A800 50%, #D4870A 100%)", boxShadow: "0 4px 20px rgba(245,168,0,0.3)" }}>
            <Trophy size={32} className="mx-auto mb-3" />
            <h3 className="text-xl mb-2" style={{ fontFamily: "Playfair Display, serif", fontWeight: 600 }}>
              Seu próximo mês é por nossa conta!
            </h3>
            <p className="text-sm opacity-90">Você ganhou 1 mensalidade grátis no valor de R$ 320</p>
          </div>
        )}

        {/* MÉTRICAS */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded-2xl p-4 text-center" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <Users size={24} className="mx-auto mb-2" style={{ color: "#FF5C00" }} />
            <div className="text-2xl mb-1" style={{ color: "#070738", fontWeight: 600 }}>{indicacoes.length}</div>
            <div className="text-xs text-gray-600">Indicações</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <CheckCircle2 size={24} className="mx-auto mb-2" style={{ color: "#22c55e" }} />
            <div className="text-2xl mb-1" style={{ color: "#070738", fontWeight: 600 }}>{matriculados}</div>
            <div className="text-xs text-gray-600">Matriculados</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <Gift size={24} className="mx-auto mb-2" style={{ color: "#F5A800" }} />
            <div className="text-xs mb-1 leading-tight" style={{ color: "#070738", fontWeight: 600 }}>
              {nivel === "ambassador" ? `R$ ${saldoAcumulado}` : nivel === "ouro" ? "1 mês grátis" : "Badge"}
            </div>
            <div className="text-xs text-gray-600">Benefício</div>
          </div>
        </div>

        {/* BARRA DE PROGRESSO (não Ambassador) */}
        {!config.showBalance && (
          <div className="bg-white rounded-2xl p-6 mb-4" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={20} style={{ color: "#6B3FA0" }} />
              <h4 className="text-sm" style={{ color: "#070738", fontWeight: 600 }}>{config.remainingMessage}</h4>
            </div>
            <div className="mb-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: "#6B3FA0" }} />
              </div>
            </div>
            <div className="flex justify-between items-center">
              {[{ label: "Bronze", min: 1, color: "#CD7F32" }, { label: "Prata", min: 2, color: "#B0B8C8" }, { label: "Ouro", min: 3, color: "#F5A800" }, { label: "Ambassador", min: 4, color: "#6B3FA0" }].map((n) => (
                <div key={n.label} className="text-center flex-1">
                  <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ backgroundColor: matriculados >= n.min ? n.color : "#e5e7eb" }} />
                  <div className="text-xs text-gray-600">{n.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SALDO AMBASSADOR */}
        {config.showBalance && (
          <div className="bg-white rounded-2xl p-6 mb-4" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.05)", border: "2px solid #6B3FA0" }}>
            <h4 className="text-sm text-gray-600 mb-2">Seu saldo</h4>
            <div className="text-4xl mb-3" style={{ fontFamily: "Playfair Display, serif", fontWeight: 700, color: "#FF5C00" }}>
              R$ {saldoAcumulado}
            </div>
            <p className="text-xs text-gray-600 mb-4">A cada nova matrícula confirmada, você acumula R$50</p>
            <div className="mb-3">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full transition-all duration-500" style={{ width: `${balanceProgress}%`, backgroundColor: canRedeem ? "#F5A800" : "#6B3FA0" }} />
              </div>
            </div>
            {!canRedeem ? (
              <p className="text-sm text-gray-600">
                Faltam <span style={{ color: "#FF5C00", fontWeight: 600 }}>R$ {remainingBalance}</span> para resgatar o material didático
              </p>
            ) : (
              <button className="w-full py-3 rounded-xl text-white font-semibold mt-2" style={{ backgroundColor: "#FF5C00" }}>
                Resgatar material didático
              </button>
            )}
          </div>
        )}

        {/* LISTA DE INDICAÇÕES */}
        <div className="mb-4">
          <h3 className="text-2xl mb-4" style={{ fontFamily: "Playfair Display, serif", fontWeight: 600, color: "#070738" }}>
            Suas Indicações
          </h3>
          <div className="space-y-3">
            {indicacoes.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                <p className="text-gray-400 text-sm">Você ainda não fez nenhuma indicação.</p>
              </div>
            ) : (
              indicacoes.map((ind) => (
                <div key={ind.id} className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium" style={{ color: "#070738" }}>{ind.nomeIndicado}</h4>
                    <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(ind.status)}`}>{ind.status}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Indicado em {new Date(ind.criadoEm).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* BOTÃO INDICAR */}
        <button
          onClick={() => setModalAberto(true)}
          className="w-full py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 mb-4 transition-transform active:scale-98"
          style={{ backgroundColor: "#FF5C00" }}
        >
          <UserPlus size={20} />
          Indicar um Amigo
        </button>

        {/* CERTIFICADO */}
        {config.showCertificate && (
          <div className="rounded-2xl p-6 text-white text-center mb-4" style={{ background: "linear-gradient(135deg, #FF5C00 0%, #6B3FA0 100%)", boxShadow: "0 4px 20px rgba(255,92,0,0.3)" }}>
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: "rgba(245,168,0,0.3)" }}>
              <Award size={32} style={{ color: "#F5A800" }} />
            </div>
            <h3 className="text-xl mb-2" style={{ fontFamily: "Playfair Display, serif", fontWeight: 600 }}>
              Seu Certificado Ambassador está pronto!
            </h3>
            <p className="text-sm mb-4 opacity-90">Baixe, imprima e compartilhe.</p>
            {nivel === "ouro" ? (
              <div className="space-y-2">
                <button className="w-full bg-white text-gray-800 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
                  <Download size={18} /> Ver Certificado
                </button>
                <button className="w-full bg-transparent text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2" style={{ border: "2px solid white" }}>
                  <HelpCircle size={18} /> Como usar meu mês grátis?
                </button>
              </div>
            ) : (
              <button className="bg-white text-gray-800 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 mx-auto">
                <Download size={18} /> Ver Certificado
              </button>
            )}
          </div>
        )}

        {/* RODAPÉ */}
        <footer className="text-center pt-8 pb-4">
          <Logo size="small" variant="dark" />
          <p className="text-sm mb-2 mt-2" style={{ color: "#6B3FA0", fontWeight: 500 }}>eicschool.com.br</p>
          <p className="text-xs text-gray-500 px-8">Este link é exclusivo para você.</p>
        </footer>
      </div>

      {/* MODAL INDICAÇÃO */}
      {modalAberto && (
        <ModalIndicacao
          onClose={() => setModalAberto(false)}
          onSubmit={adicionarIndicacao}
          enviando={enviando}
        />
      )}

      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
      `}</style>
    </div>
  );
}
