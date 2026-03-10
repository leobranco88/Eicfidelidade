import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Users, CheckCircle2, Gift, Trophy, Award,
  UserPlus, Download, Crown, Star, X, Loader2, Rocket,
  Banknote, BookOpen, CheckCheck
} from "lucide-react";
import { useFidelidade, type Nivel } from "../../hooks/useFidelidade";

const EIC_LOGO = "https://raw.githubusercontent.com/leobranco88/Studentprogressreportdesign/main/src/assets/eic-logo-transparente.png";

function getBadgeStyle(nivel: Nivel) {
  switch (nivel) {
    case "iniciante": return { gradient: "linear-gradient(135deg, #E8E8E8 0%, #C8C8C8 50%, #A0A0A0 100%)", shadow: "0 8px 24px rgba(160,160,160,0.35)", pillBg: "#F5F0E8", pillText: "#8B7355" };
    case "bronze": return { gradient: "linear-gradient(135deg, #E8A87C 0%, #CD7F32 50%, #A0522D 100%)", shadow: "0 8px 24px rgba(205,127,50,0.45)", pillBg: "#FEF3C7", pillText: "#92400E" };
    case "prata": return { gradient: "linear-gradient(135deg, #E8E8F0 0%, #B0B8C8 50%, #8892A4 100%)", shadow: "0 8px 24px rgba(136,146,164,0.45)", pillBg: "#F3F4F6", pillText: "#374151" };
    case "ouro": return { gradient: "linear-gradient(135deg, #FFE566 0%, #F5A800 50%, #D4870A 100%)", shadow: "0 8px 24px rgba(245,168,0,0.55)", pillBg: "#FEF9C3", pillText: "#92400E" };
    case "ambassador": return { gradient: "linear-gradient(135deg, #FF8C42 0%, #FF5C00 50%, #6B3FA0 100%)", shadow: "0 8px 24px rgba(107,63,160,0.55)", pillBg: "#EDE7F6", pillText: "#6B3FA0" };
  }
}

function getNivelConfig(nivel: Nivel) {
  const configs = {
    iniciante: { icon: Rocket, name: "Iniciante", phrase: "Bem-vindo ao programa!", subPhrase: "Indique um amigo para começar sua jornada.", showCertificate: false, showBalance: false, showResgate: false },
    bronze:    { icon: Star,   name: "Bronze",    phrase: "Você chegou no Bronze!", subPhrase: "Você tem R$50 disponíveis para resgatar.", showCertificate: false, showBalance: false, showResgate: true },
    prata:     { icon: Star,   name: "Prata",     phrase: "Você chegou no Prata!", subPhrase: "Você tem R$100 disponíveis para resgatar.", showCertificate: false, showBalance: false, showResgate: true },
    ouro:      { icon: Trophy, name: "Ouro",      phrase: "Você chegou no Ouro!", subPhrase: "Seu próximo mês é por nossa conta!", showCertificate: false, showBalance: false, showResgate: false },
    ambassador:{ icon: Crown,  name: "Ambassador",phrase: "Você é um Embaixador EIC!", subPhrase: "A cada nova matrícula você acumula R$50.", showCertificate: true, showBalance: true, showResgate: true },
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

interface ModalResgateProps {
  nivel: Nivel;
  saldo: number;
  onClose: () => void;
  onConfirmar: (dados: { tipo: "pix" | "material_didatico"; valor: number; chavePix?: string }) => Promise<void>;
  enviando: boolean;
  enviado: boolean;
}

function ModalResgate({ nivel, saldo, onClose, onConfirmar, enviando, enviado }: ModalResgateProps) {
  const [tipo, setTipo] = useState<"pix" | "material_didatico">("pix");
  const [valor, setValor] = useState(nivel === "bronze" ? 50 : nivel === "prata" ? 100 : 50);
  const [chavePix, setChavePix] = useState("");

  const isFixo = nivel === "bronze" || nivel === "prata";
  const multiplos = isFixo ? [saldo] : Array.from({ length: Math.floor(saldo / 50) }, (_, i) => (i + 1) * 50);
  const podeMaterial = nivel === "ambassador" && saldo >= 350;

  const handleConfirmar = async () => {
    if (tipo === "pix" && !chavePix.trim()) return;
    await onConfirmar({ tipo, valor: tipo === "material_didatico" ? 350 : valor, chavePix: tipo === "pix" ? chavePix.trim() : undefined });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="w-full max-w-[430px] bg-white rounded-t-3xl p-6 pb-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold" style={{ fontFamily: "Playfair Display, serif", color: "#070738" }}>Resgatar Benefício</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X size={20} className="text-gray-500" /></button>
        </div>

        {enviado ? (
          <div className="text-center py-8">
            <CheckCheck size={48} className="mx-auto mb-3" style={{ color: "#22c55e" }} />
            <p className="font-semibold text-lg" style={{ color: "#070738", fontFamily: "Playfair Display, serif" }}>Solicitação enviada!</p>
            <p className="text-sm text-gray-500 mt-2 px-4">
              {tipo === "pix"
                ? "O pagamento será realizado via PIX no dia 30. A equipe EIC confirmará em breve."
                : "A equipe EIC entrará em contato para combinar a entrega do material didático."}
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-xl p-3 mb-5 flex items-center justify-between" style={{ backgroundColor: "#F5F3FF" }}>
              <span className="text-sm text-gray-600">Valor disponível</span>
              <span className="font-bold text-lg" style={{ color: "#FF5C00" }}>R$ {saldo}</span>
            </div>

            {/* Tipo — só Ambassador pode escolher entre PIX e material */}
            {nivel === "ambassador" && (
              <>
                <p className="text-sm font-medium mb-3" style={{ color: "#070738" }}>Como deseja resgatar?</p>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <button onClick={() => setTipo("pix")}
                    className="p-4 rounded-xl border-2 text-center transition-all"
                    style={{ borderColor: tipo === "pix" ? "#6B3FA0" : "#E5E7EB", backgroundColor: tipo === "pix" ? "#F5F3FF" : "white" }}>
                    <Banknote size={24} className="mx-auto mb-1" style={{ color: tipo === "pix" ? "#6B3FA0" : "#9CA3AF" }} />
                    <p className="text-sm font-semibold" style={{ color: tipo === "pix" ? "#6B3FA0" : "#070738" }}>PIX</p>
                    <p className="text-xs text-gray-500">Receba no dia 30</p>
                  </button>
                  <button onClick={() => podeMaterial && setTipo("material_didatico")}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${!podeMaterial ? "opacity-40 cursor-not-allowed" : ""}`}
                    style={{ borderColor: tipo === "material_didatico" ? "#6B3FA0" : "#E5E7EB", backgroundColor: tipo === "material_didatico" ? "#F5F3FF" : "white" }}>
                    <BookOpen size={24} className="mx-auto mb-1" style={{ color: tipo === "material_didatico" ? "#6B3FA0" : "#9CA3AF" }} />
                    <p className="text-sm font-semibold" style={{ color: tipo === "material_didatico" ? "#6B3FA0" : "#070738" }}>Material</p>
                    <p className="text-xs text-gray-500">{podeMaterial ? "R$ 350" : `Faltam R$ ${350 - saldo}`}</p>
                  </button>
                </div>
              </>
            )}

            {/* Valor — Ambassador pode escolher múltiplos */}
            {tipo === "pix" && nivel === "ambassador" && (
              <div className="mb-5">
                <p className="text-sm font-medium mb-2" style={{ color: "#070738" }}>Valor a resgatar</p>
                <div className="flex flex-wrap gap-2">
                  {multiplos.map((v) => (
                    <button key={v} onClick={() => setValor(v)}
                      className="px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all"
                      style={{ borderColor: valor === v ? "#FF5C00" : "#E5E7EB", backgroundColor: valor === v ? "#FFF3ED" : "white", color: valor === v ? "#FF5C00" : "#6B7280" }}>
                      R$ {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chave PIX */}
            {tipo === "pix" && (
              <div className="mb-5">
                <label className="block text-sm font-medium mb-1" style={{ color: "#070738" }}>Sua chave PIX</label>
                <input type="text" value={chavePix} onChange={(e) => setChavePix(e.target.value)}
                  placeholder="CPF, e-mail, telefone ou chave aleatória"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-400 text-sm"
                  style={{ fontFamily: "DM Sans, sans-serif" }} />
              </div>
            )}

            <p className="text-xs text-gray-400 mb-4 text-center">
              {tipo === "pix" ? "Pagamentos realizados todo dia 30 do mês corrente." : "A entrega será combinada com a equipe EIC em até 2 dias úteis."}
            </p>

            <button onClick={handleConfirmar} disabled={enviando || (tipo === "pix" && !chavePix.trim())}
              className="w-full py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ backgroundColor: "#FF5C00" }}>
              {enviando ? <Loader2 size={20} className="animate-spin" /> : <><CheckCheck size={20} />Confirmar Solicitação</>}
            </button>
          </>
        )}
      </div>
    </div>
  );
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
    setTimeout(() => { setSucesso(false); onClose(); }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="w-full max-w-[430px] bg-white rounded-t-3xl p-6 pb-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold" style={{ fontFamily: "Playfair Display, serif", color: "#070738" }}>Indicar um Amigo</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X size={20} className="text-gray-500" /></button>
        </div>
        {sucesso ? (
          <div className="text-center py-8">
            <CheckCircle2 size={48} className="mx-auto mb-3" style={{ color: "#22c55e" }} />
            <p className="font-semibold text-lg" style={{ color: "#070738" }}>Indicação enviada!</p>
            <p className="text-sm text-gray-500 mt-1">Aguarde a confirmação da EIC.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">Preencha os dados do seu amigo. A indicação será confirmada pela equipe EIC.</p>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#070738" }}>Nome completo</label>
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do seu amigo"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-400 text-sm"
                  style={{ fontFamily: "DM Sans, sans-serif" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#070738" }}>WhatsApp</label>
                <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="(11) 99999-9999"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-400 text-sm"
                  style={{ fontFamily: "DM Sans, sans-serif" }} />
              </div>
            </div>
            <button onClick={handleSubmit} disabled={enviando || !nome.trim() || !whatsapp.trim()}
              className="w-full py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ backgroundColor: "#FF5C00" }}>
              {enviando ? <Loader2 size={20} className="animate-spin" /> : <><UserPlus size={20} />Enviar Indicação</>}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function FidelityPage() {
  const { responsavelId } = useParams<{ responsavelId: string }>();
  const { indicacoes, responsavel, loading, enviando, nivel, matriculados, saldoAcumulado, adicionarIndicacao, solicitarResgate, solicitandoResgate, resgateEnviado } = useFidelidade(responsavelId ?? "");
  const [timedOut, setTimedOut] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalResgateAberto, setModalResgateAberto] = useState(false);

  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setTimedOut(true), 6000);
    return () => clearTimeout(timer);
  }, [loading]);

  if (loading && timedOut) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F8F6FF" }}>
        <div className="text-center px-6">
          <img src={EIC_LOGO} alt="EIC" style={{ width: 120, margin: "0 auto 24px" }} />
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#070738", fontFamily: "Playfair Display, serif" }}>Link inválido</h1>
          <p className="text-gray-500 text-sm">Este link não existe ou foi desativado.<br />Entre em contato com a EIC para obter seu link pessoal.</p>
          <p className="mt-6 text-sm font-medium" style={{ color: "#6B3FA0" }}>eicschool.com.br</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ backgroundColor: "#F8F6FF" }}>
        <img src={EIC_LOGO} alt="EIC" style={{ width: 120 }} />
        <Loader2 size={32} className="animate-spin" style={{ color: "#6B3FA0" }} />
        <p className="text-sm text-gray-500" style={{ fontFamily: "DM Sans, sans-serif" }}>Carregando seu programa de fidelidade...</p>
      </div>
    );
  }

  const nomeResponsavel = responsavel?.nome ?? "";
  const config = getNivelConfig(nivel);
  const badgeStyle = getBadgeStyle(nivel);
  const LevelIcon = config.icon;
  const progress = Math.min((matriculados / 4) * 100, 100);
  const balanceProgress = Math.min((saldoAcumulado / 350) * 100, 100);
  const remainingBalance = 350 - saldoAcumulado;

  return (
    <div className="max-w-[430px] mx-auto min-h-screen" style={{ fontFamily: "DM Sans, sans-serif" }}>
      <header className="px-6 py-6 text-white" style={{ background: "linear-gradient(135deg, #FF5C00 0%, #6B3FA0 50%, #070738 100%)" }}>
        <div className="flex items-center justify-between mb-4">
          <img src={EIC_LOGO} alt="EIC" style={{ width: 80, filter: "brightness(0) invert(1)" }} />
          <div className="text-xs opacity-70">1º Sem 2026</div>
        </div>
        <div>
          <div className="text-xs opacity-80 mb-1">Olá,</div>
          <h2 className="text-2xl" style={{ fontFamily: "Playfair Display, serif", fontWeight: 700 }}>{nomeResponsavel}</h2>
        </div>
      </header>

      <div className="px-4 pb-8">
        {/* Badge */}
        <div className="bg-white rounded-2xl p-6 -mt-4 mb-4 text-center relative" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          <div className="relative inline-block mb-4">
            {nivel === "ambassador" && (
              <div className="absolute -inset-2 rounded-full" style={{ background: "linear-gradient(90deg, #FF5C00, #F5A800, #6B3FA0, #FF5C00)", backgroundSize: "300% 100%", animation: "shimmer 3s linear infinite", opacity: 0.6 }} />
            )}
            <div className="relative rounded-full flex items-center justify-center" style={{ background: badgeStyle.gradient, boxShadow: badgeStyle.shadow, width: nivel === "ambassador" ? 140 : 120, height: nivel === "ambassador" ? 140 : 120 }}>
              <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%)" }} />
              <LevelIcon size={nivel === "ambassador" ? 56 : 48} className="relative z-10" style={{ color: "#FFFFFF" }} />
            </div>
          </div>
          <div className="inline-block px-4 py-1 rounded-full text-xs font-semibold mb-3" style={{ backgroundColor: badgeStyle.pillBg, color: badgeStyle.pillText }}>
            {config.name.toUpperCase()}
          </div>
          <h3 className="text-2xl mb-2" style={{ fontFamily: "Playfair Display, serif", fontWeight: 700, color: "#070738" }}>{config.phrase}</h3>
          <p className="text-sm text-gray-600">{config.subPhrase}</p>
        </div>

        {/* Banner Ouro */}
        {nivel === "ouro" && (
          <div className="rounded-2xl p-6 text-white text-center mb-4" style={{ background: "linear-gradient(135deg, #FFE566 0%, #F5A800 50%, #D4870A 100%)", boxShadow: "0 4px 20px rgba(245,168,0,0.3)" }}>
            <Trophy size={32} className="mx-auto mb-3" />
            <h3 className="text-xl mb-2" style={{ fontFamily: "Playfair Display, serif", fontWeight: 600 }}>Seu próximo mês é por nossa conta!</h3>
            <p className="text-sm opacity-90">Você ganhou 1 mensalidade grátis no valor de R$ 320</p>
          </div>
        )}

        {/* Sinalizador de resgate Bronze/Prata */}
        {(nivel === "bronze" || nivel === "prata") && (
          <div className="rounded-2xl p-5 mb-4 flex items-center justify-between" style={{ background: nivel === "bronze" ? "linear-gradient(135deg, #E8A87C, #CD7F32)" : "linear-gradient(135deg, #E8E8F0, #8892A4)", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
            <div>
              <p className="text-white font-bold text-lg" style={{ fontFamily: "Playfair Display, serif" }}>R$ {saldoAcumulado} disponíveis!</p>
              <p className="text-white text-xs opacity-90 mt-0.5">Resgate via PIX até o dia 30</p>
            </div>
            <button onClick={() => setModalResgateAberto(true)}
              className="px-4 py-2 rounded-xl font-semibold text-sm"
              style={{ backgroundColor: "white", color: nivel === "bronze" ? "#CD7F32" : "#374151" }}>
              Resgatar
            </button>
          </div>
        )}

        {/* Stats */}
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
            <div className="text-sm mb-1 font-semibold" style={{ color: "#070738" }}>
              {nivel === "ambassador" ? `R$ ${saldoAcumulado}` : nivel === "ouro" ? "1 mês" : nivel === "bronze" ? "R$50" : nivel === "prata" ? "R$100" : "—"}
            </div>
            <div className="text-xs text-gray-600">Benefício</div>
          </div>
        </div>

        {/* Barra de progresso */}
        {!config.showBalance && (
          <div className="bg-white rounded-2xl p-6 mb-4" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={20} style={{ color: "#6B3FA0" }} />
              <h4 className="text-sm font-semibold" style={{ color: "#070738" }}>
                {matriculados < 4 ? `Falta${4 - matriculados > 1 ? "m" : ""} ${4 - matriculados} matrícula${4 - matriculados > 1 ? "s" : ""} para Ambassador` : "Nível máximo atingido!"}
              </h4>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
              <div className="h-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: "#6B3FA0" }} />
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

        {/* Saldo Ambassador */}
        {config.showBalance && (
          <div className="bg-white rounded-2xl p-6 mb-4" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.05)", border: "2px solid #6B3FA0" }}>
            <h4 className="text-sm text-gray-600 mb-2">Seu saldo</h4>
            <div className="text-4xl mb-3" style={{ fontFamily: "Playfair Display, serif", fontWeight: 700, color: "#FF5C00" }}>R$ {saldoAcumulado}</div>
            <p className="text-xs text-gray-600 mb-4">A cada nova matrícula confirmada, você acumula R$50</p>
            <div className="mb-4">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full transition-all duration-500" style={{ width: `${balanceProgress}%`, backgroundColor: saldoAcumulado >= 350 ? "#F5A800" : "#6B3FA0" }} />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-400">R$ 0</span>
                <span className="text-xs text-gray-400">R$ 350 (material)</span>
              </div>
            </div>
            {remainingBalance > 0 && saldoAcumulado > 0 && (
              <p className="text-sm text-gray-600 mb-4">Faltam <span style={{ color: "#FF5C00", fontWeight: 600 }}>R$ {remainingBalance}</span> para resgatar o material didático</p>
            )}
            {saldoAcumulado >= 50 && (
              <button onClick={() => setModalResgateAberto(true)}
                className="w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2"
                style={{ backgroundColor: "#FF5C00" }}>
                <Banknote size={18} /> Resgatar saldo
              </button>
            )}
          </div>
        )}

        {/* Indicações */}
        <div className="mb-4">
          <h3 className="text-2xl mb-4" style={{ fontFamily: "Playfair Display, serif", fontWeight: 600, color: "#070738" }}>Suas Indicações</h3>
          <div className="space-y-3">
            {indicacoes.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                <p className="text-gray-400 text-sm">Você ainda não fez nenhuma indicação.</p>
              </div>
            ) : indicacoes.map((ind) => (
              <div key={ind.id} className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium" style={{ color: "#070738" }}>{ind.nomeIndicado}</h4>
                  <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(ind.status)}`}>{ind.status}</span>
                </div>
                <p className="text-sm text-gray-500">Indicado em {new Date(ind.criadoEm).toLocaleDateString("pt-BR")}</p>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => setModalAberto(true)} className="w-full py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 mb-4" style={{ backgroundColor: "#FF5C00" }}>
          <UserPlus size={20} />Indicar um Amigo
        </button>

        {/* Certificado Ambassador */}
        {config.showCertificate && (
          <div className="rounded-2xl p-6 text-white text-center mb-4" style={{ background: "linear-gradient(135deg, #FF5C00 0%, #6B3FA0 100%)", boxShadow: "0 4px 20px rgba(255,92,0,0.3)" }}>
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: "rgba(245,168,0,0.3)" }}>
              <Award size={32} style={{ color: "#F5A800" }} />
            </div>
            <h3 className="text-xl mb-2" style={{ fontFamily: "Playfair Display, serif", fontWeight: 600 }}>Seu Certificado Ambassador está pronto!</h3>
            <p className="text-sm mb-4 opacity-90">Baixe, imprima e compartilhe.</p>
            <button className="bg-white text-gray-800 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 mx-auto">
              <Download size={18} /> Ver Certificado
            </button>
          </div>
        )}

        <footer className="text-center pt-8 pb-4">
          <img src={EIC_LOGO} alt="EIC" style={{ width: 90, margin: "0 auto 8px" }} />
          <p className="text-sm mb-2" style={{ color: "#6B3FA0", fontWeight: 500 }}>eicschool.com.br</p>
          <p className="text-xs text-gray-500 px-8">Este link é exclusivo para você.</p>
        </footer>
      </div>

      {modalAberto && <ModalIndicacao onClose={() => setModalAberto(false)} onSubmit={adicionarIndicacao} enviando={enviando} />}
      {modalResgateAberto && (
        <ModalResgate
          nivel={nivel}
          saldo={saldoAcumulado}
          onClose={() => setModalResgateAberto(false)}
          onConfirmar={async (dados) => { await solicitarResgate(dados); }}
          enviando={solicitandoResgate}
          enviado={resgateEnviado}
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
