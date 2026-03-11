import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export type StatusIndicacao =
  | "Aguardando confirmação"
  | "Aguardando contato"
  | "Em avaliação"
  | "Matriculado";

export interface Indicacao {
  id: string;
  nomeIndicado: string;
  whatsappIndicado: string;
  nomeResponsavel: string;
  responsavelId: string;
  status: StatusIndicacao;
  criadoEm: string;
  origem: "admin" | "pai";
}

export interface Responsavel {
  id: string;
  nome: string;
}

export type Nivel = "iniciante" | "bronze" | "prata" | "ouro" | "ambassador";

export function calcularNivel(matriculados: number): Nivel {
  if (matriculados >= 4) return "ambassador";
  if (matriculados >= 3) return "ouro";
  if (matriculados >= 2) return "prata";
  if (matriculados >= 1) return "bronze";
  return "iniciante";
}

export function getSaldoPorNivel(nivel: Nivel, matriculados: number): number {
  if (nivel === "bronze") return 50;
  if (nivel === "prata") return 100;
  if (nivel === "ambassador") return (matriculados - 3) * 50;
  return 0;
}

export function useFidelidade(responsavelId: string) {
  const [indicacoes, setIndicacoes] = useState<Indicacao[]>([]);
  const [responsavel, setResponsavel] = useState<Responsavel | null>(null);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [solicitandoResgate, setSolicitandoResgate] = useState(false);
  const [resgateEnviado, setResgateEnviado] = useState(false);

  useEffect(() => {
    if (!responsavelId) return;

    // Busca primeiro na coleção responsaveis (cadastro direto)
    const buscarResponsavel = async () => {
      const q = query(
        collection(db, "responsaveis"),
        where("responsavelId", "==", responsavelId)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        const data = snap.docs[0].data();
        setResponsavel({ id: snap.docs[0].id, nome: data.nome });
        return true;
      }
      return false;
    };

    buscarResponsavel();

    // Escuta indicações em tempo real
    const q = query(
      collection(db, "indicacoes"),
      where("responsavelId", "==", responsavelId)
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        criadoEm: doc.data().criadoEm?.toDate?.()?.toISOString() ?? new Date().toISOString(),
      })) as Indicacao[];
      setIndicacoes(data);
      // Fallback: se não achou em responsaveis, tenta nas indicações
      if (data.length > 0) {
        setResponsavel((prev) => prev ?? { id: responsavelId, nome: data[0].nomeResponsavel });
      }
      setLoading(false);
    });

    // Timeout para marcar loading false mesmo sem indicações (responsável cadastrado mas sem indicações)
    const timer = setTimeout(() => setLoading(false), 3000);

    return () => { unsub(); clearTimeout(timer); };
  }, [responsavelId]);

  const adicionarIndicacao = async (dados: {
    nomeIndicado: string;
    whatsappIndicado: string;
  }) => {
    if (!responsavel) return;
    setEnviando(true);
    try {
      await addDoc(collection(db, "indicacoes"), {
        nomeIndicado: dados.nomeIndicado,
        whatsappIndicado: dados.whatsappIndicado,
        nomeResponsavel: responsavel.nome,
        responsavelId,
        status: "Aguardando confirmação",
        origem: "pai",
        criadoEm: serverTimestamp(),
      });
    } finally {
      setEnviando(false);
    }
  };

  const solicitarResgate = async (dados: {
    tipo: "pix" | "material_didatico";
    valor: number;
    chavePix?: string;
  }) => {
    if (!responsavel) return;
    setSolicitandoResgate(true);
    try {
      await addDoc(collection(db, "resgates"), {
        responsavelId,
        nomeResponsavel: responsavel.nome,
        tipo: dados.tipo,
        valor: dados.valor,
        chavePix: dados.chavePix ?? null,
        status: "pendente",
        criadoEm: serverTimestamp(),
        pagamentoEm: null,
      });
      setResgateEnviado(true);
      setTimeout(() => setResgateEnviado(false), 5000);
    } finally {
      setSolicitandoResgate(false);
    }
  };

  const matriculados = indicacoes.filter((i) => i.status === "Matriculado").length;
  const nivel = calcularNivel(matriculados);
  const saldoAcumulado = getSaldoPorNivel(nivel, matriculados);

  return {
    indicacoes,
    responsavel,
    loading,
    enviando,
    nivel,
    matriculados,
    saldoAcumulado,
    adicionarIndicacao,
    setResponsavel,
    solicitarResgate,
    solicitandoResgate,
    resgateEnviado,
  };
}
