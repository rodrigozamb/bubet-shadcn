"use client"

import { api } from "@/services/api";
import { ArrowLeft, ArrowRight, Clock3, Lightbulb, Pause, Play, Search, Target, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const DICAS_UNLOCK_AT = [3, 5, 6];
type BrequeOption = { nome: string };
type GuessHistory = {
  tentativas?: unknown[];
  palpites?: unknown[];
  acertou?: boolean;
  finished_at?: string | null;
};
const ESTATISTICAS_ACERTOS = [
  { attempts: 1, users: 18 },
  { attempts: 2, users: 31 },
  { attempts: 3, users: 26 },
  { attempts: 4, users: 15 },
  { attempts: 5, users: 8 },
  { attempts: 6, users: 4 },
];  

function tentativaOrdinal(attempt: number) {
  return `${attempt}ª`;
}

function formatarDataParaApi(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}-${month}-${date.getFullYear()}`;
}

function normalizarBrequeOption(item: unknown): BrequeOption | null {
  if (!item || typeof item !== "object") return null;

  const breque = item as { nome?: unknown };
  if (typeof breque.nome !== "string" || !breque.nome.trim()) return null;

  return { nome: breque.nome };
}

function extrairBreques(data: unknown, depth = 0): unknown[] {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object" || depth > 3) return [];

  const response = data as { breques?: unknown; items?: unknown; data?: unknown };
  for (const value of [response.breques, response.items, response.data]) {
    const breques = extrairBreques(value, depth + 1);
    if (breques.length > 0) return breques;
  }

  return [];
}

export function AdvinheOBrequeGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [attemptIndex, setAttemptIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0.1);
  const [query, setQuery] = useState("");
  const [availableOptions, setAvailableOptions] = useState<BrequeOption[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
  const [dicas, setDicas] = useState<{unlockAt: number, text: string}[]>([]);
  const [revealPoints, setRevealPoints] = useState<number[]>([]);
  const [trackLength, setTrackLength] = useState<number>(1);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [resultAnswer, setResultAnswer] = useState<string | null>(null);
  const [isRoundLost, setIsRoundLost] = useState(false);
  const [videoRef, setVideoRef] = useState<string | null>(null);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [brequeId, setBrequeId] = useState<string | number | null>(null);
  const [noChallenge, setNoChallenge] = useState(false);
  const [isSubmittingGuess, setIsSubmittingGuess] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const attemptLimit = revealPoints[attemptIndex];
  const playbackLimit = correctAnswer ? revealPoints[revealPoints.length - 1] : attemptLimit;

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    const date = formatarDataParaApi(selectedDate);
    sourceRef.current?.stop();
    sourceRef.current = null;
    audioBufferRef.current = null;
    setIsPlaying(false);
    setElapsed(0.1);
    setAttemptIndex(0);
    setWrongAnswers([]);
    setCorrectAnswer(null);
    setResultAnswer(null);
    setIsRoundLost(false);
    setVideoRef(null);
    setIsSubmittingGuess(false);
    setAudioUrl(null);
    setBrequeId(null);
    setNoChallenge(false);

    api.get(`/breques/${date}`, { withCredentials: true }).then(async (res) => {
      setBrequeId(res.data.id);
      setResultAnswer(res.data.nome ?? null);
      setVideoRef(res.data.ref ?? null);
      const url = res.data.link;
      if (url) setAudioUrl(`/api/audio-preview?url=${encodeURIComponent(url)}`);
      setRevealPoints(res.data.reveal_points);
      setTrackLength(res.data.duracao);
      const dicas = res.data.dicas as string[];
      setDicas(dicas.map((dica, index) => ({ unlockAt: DICAS_UNLOCK_AT[index], text: dica })));

      try {
        const historyResponse = await api.get<GuessHistory>(`/adivinhe/${date}/${res.data.id}`, { withCredentials: true });
        const tentativas = historyResponse.data.tentativas ?? historyResponse.data.palpites ?? [];
        const previousGuesses = tentativas.filter((tentativa): tentativa is string => typeof tentativa === "string").map((tentativa) => (
          tentativa.toLowerCase() === "pulou" ? "Pulou o palpite" : tentativa
        ));
        const finished = Boolean(historyResponse.data.finished_at);
        const acertou = historyResponse.data.acertou === true;
        const correctGuess = acertou ? previousGuesses.at(-1) ?? null : null;
        setWrongAnswers(correctGuess ? previousGuesses.slice(0, -1) : previousGuesses);
        if (correctGuess) {
          setCorrectAnswer(correctGuess);
        } else if (finished) {
          setIsRoundLost(true);
        }
        setAttemptIndex(Math.min(previousGuesses.length, res.data.reveal_points.length - 1));
      } catch {
        setWrongAnswers([]);
        setCorrectAnswer(null);
        setIsRoundLost(false);
        setAttemptIndex(0);
      }

      api.get("/breques", { withCredentials: true })
        .then((res2) => {
          const breques = extrairBreques(res2.data)
            .map(normalizarBrequeOption)
            .filter((item): item is BrequeOption => item !== null);
          const options = Array.from(new Map(breques.map((item) => [item.nome, item])).values());
          options.sort((firstOption, secondOption) => {
            const firstPart = firstOption.nome.split("-")[1]?.trim() ?? "";
            const secondPart = secondOption.nome.split("-")[1]?.trim() ?? "";
            return firstPart.localeCompare(secondPart, "pt-BR");
          });
          setAvailableOptions(options);
        })
        .catch((error) => {
          console.error("Não foi possível carregar as opções de breque.", error);
        });
    }).catch((error) => {
      if (error.response?.status === 400) {
        setNoChallenge(true);
      }
    });
  }, [selectedDate]);

  useEffect(() => {
    if (!audioUrl || audioBufferRef.current) return;

    let isMounted = true;

    fetch(audioUrl)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => {
        const audioContext = audioContextRef.current ?? new AudioContext();
        audioContextRef.current = audioContext;
        return audioContext.decodeAudioData(arrayBuffer);
      })
      .then((audioBuffer) => {
        if (isMounted) audioBufferRef.current = audioBuffer;
      });

    return () => {
      isMounted = false;
    };
  }, [audioUrl]);

  function stopAudio() {
    sourceRef.current?.stop();
    sourceRef.current?.disconnect();
    sourceRef.current = null;
    setIsPlaying(false);
  }

  async function playPreview() {
    const audioBuffer = audioBufferRef.current;
    if (!audioBuffer) return;

    const audioContext = audioContextRef.current ?? new AudioContext();
    audioContextRef.current = audioContext;
    await audioContext.resume();

    stopAudio();

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.onended = () => {
      if (sourceRef.current === source) {
        sourceRef.current = null;
        setIsPlaying(false);
      }
    };
    source.start(0);
    source.stop(audioContext.currentTime + playbackLimit);
    sourceRef.current = source;
    setElapsed(0.1);
    setIsPlaying(true);
  }

  async function carregarVideoResultado() {
    const date = formatarDataParaApi(selectedDate);
    const response = await api.get(`/breques/${date}`, { withCredentials: true });
    setVideoRef(response.data.ref);
    setResultAnswer(response.data.nome ?? null);
  }

  useEffect(() => () => {
    sourceRef.current?.stop();
    audioContextRef.current?.close();
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = window.setInterval(() => {
      setElapsed((current) => {
        const next = Math.min(current + 0.1, playbackLimit);
        return Number(next.toFixed(1));
      });
    }, 100);

    return () => window.clearInterval(timer);
  }, [isPlaying, playbackLimit]);

  const visibleTime = Math.max(elapsed, 0.1);
  const hasGuess = query.trim() !== "";
  const isRoundOver = correctAnswer !== null || isRoundLost;
  const displayedAttempt = correctAnswer
    ? wrongAnswers.length + 1
    : Math.min(attemptIndex + 1, revealPoints.length);
  const maxUsers = Math.max(...ESTATISTICAS_ACERTOS.map((stat) => stat.users));
  const firstWeekday = (calendarMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const calendarDays = Array.from({ length: Math.ceil((firstWeekday + daysInMonth) / 7) * 7 }, (_, index) => {
    const day = index - firstWeekday + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });
  const monthLabel = calendarMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const selectedDateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const firstSelectableDate = new Date(2026, 9, 1);

  return (
    <>

      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-stretch gap-6 pt-3 sm:pt-4 lg:flex-row lg:items-start lg:gap-8">
        <aside className="order-2 w-full lg:order-1 lg:w-[245px] lg:pt-[230px]" aria-label="Dicas">
          {!noChallenge && (
            <>
          <div className="rounded-[5px] border border-[#303638] bg-[#1b1f20] p-4">
            <div className="flex items-center gap-2 text-[#f0f0f0]">
              <Lightbulb size={18} className="text-[#f2c94c]" />
              <h2 className="text-[16px] font-semibold">Dicas</h2>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              {dicas.map((dica, index) => {
                const isUnlocked = attemptIndex + 1 >= dica.unlockAt;
                return (
                  <div key={dica.unlockAt} className={`rounded-[4px] border px-3 py-2 text-[13px] leading-5 ${isUnlocked ? "border-[#465d36] bg-[#253124] text-[#dbead5]" : "border-[#303638] bg-[#202526] text-[#879195]"}`}>
                    <span className="mr-1 font-semibold text-[#aeb8bb]">{index + 1}.</span>
                    {isUnlocked ? dica.text : `Desbloqueie na ${tentativaOrdinal(dica.unlockAt)} tentativa`}
                  </div>
                );
              })}
            </div>
          </div>
          {/* {isRoundOver && (
            <button onClick={() => setIsStatsModalOpen(true)} className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-[4px] bg-[#303f8f] px-4 text-[12px] font-medium text-white transition hover:bg-[#3b4daa]">
              <BarChart3 size={16} />
              Ver estatísticas
            </button>
          )} */}
            </>
          )}
        </aside>

      <section className="order-1 mx-auto flex w-full max-w-[575px] flex-col items-center lg:order-2">
        {noChallenge ? (
          <p className="mt-[230px] text-center text-base font-medium text-[#d7d9da]">
            Não há desafio para o dia selecionado. Por favor escolha outro dia
          </p>
        ) : (
          <>
        <h1 className="flex h-[230px] w-[230px] items-center justify-center">
          <img src="/adivinhe.png" alt="Adivinhe o Breque" className="h-full w-full object-contain" />
        </h1>

        <div className="mt-[24px] grid w-full grid-cols-2 gap-2 text-center">
          <div className="rounded-[5px] border border-[#303638] bg-[#1b1f20] px-3 py-2">
            <div className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.08em] text-[#8d979c]">
              <Target size={14} />
              <span>Tentativa</span>
            </div>
            <p className={`mt-1 text-[16px] font-semibold ${correctAnswer ? "text-[#6bd43b]" : "text-[#f0f0f0]"}`}>{displayedAttempt} de {revealPoints.length}</p>
          </div>
          <div className="rounded-[5px] border border-[#303638] bg-[#1b1f20] px-3 py-2">
            <div className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.08em] text-[#8d979c]">
              <Clock3 size={14} />
              <span>Limite do áudio</span>
            </div>
            <p className={`mt-1 text-[16px] font-semibold ${correctAnswer ? "text-[#6bd43b]" : "text-[#f0f0f0]"}`}>{attemptLimit} segundos</p>
          </div>
        </div>

        <div className="mt-3 flex w-full gap-1" aria-label={`Progresso: tentativa ${Math.min(attemptIndex + 1, revealPoints.length)} de ${revealPoints.length}`}>
          {revealPoints.map((point, index) => (
            <div key={point + ' - '+index} className={`h-1.5 flex-1 rounded-full transition-colors ${index < attemptIndex ? "bg-[#657075]" : index === attemptIndex ? correctAnswer ? "bg-[#4cbe1d]" : "bg-[#303f8f]" : "bg-[#303638]"}`} />
          ))}
        </div>

        <div className="mt-[52px] flex w-full flex-col gap-[7px]">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className={`flex h-[40px] items-center justify-center rounded-[5px] border text-[16px] transition ${wrongAnswers[index] === "Pulou o palpite" ? "border-transparent bg-[#303436] text-[#e2e2e2]" : wrongAnswers[index] ? "border-[#dd2929] bg-[#d62020] text-white" : correctAnswer && index === wrongAnswers.length ? "border-[#4cbe1d] bg-[#3b9f19] text-white" : "border-[#2d3234] bg-transparent text-transparent"}`}>
              {wrongAnswers[index] ?? (correctAnswer && index === wrongAnswers.length ? correctAnswer : "")}
            </div>
          ))}
        </div>

        {isRoundOver && (
          <div className="mt-6 w-full rounded-[5px] border border-[#303638] bg-[#1b1f20] p-4">
            <h2 className={`text-center text-lg font-semibold ${correctAnswer ? "text-[#6bd43b]" : "text-[#f0f0f0]"}`}>
              {correctAnswer ? "Você acertou!" : "Fim do jogo"}
            </h2>
            {(correctAnswer ?? resultAnswer) && (
              <p className="mt-2 text-center text-base font-medium text-[#6bd43b]">
                {correctAnswer ?? resultAnswer}
              </p>
            )}
            {videoRef && (
              <div className="mt-4 aspect-video overflow-hidden rounded-md bg-black">
                <iframe
                  className="h-full w-full"
                  src={videoRef}
                  title="Prévia da música"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        )}

        <div className="mt-[28px] w-full">
          <div className="relative h-[67px]">
            <div className="absolute top-0 flex -translate-x-1/2 flex-col items-center whitespace-nowrap text-[15px] text-[#d7d9da] transition-[left]" style={{ left: `${(visibleTime / trackLength) * 100}%` }}>
              <span>{visibleTime < 1 ? `${visibleTime.toFixed(1)} segundos` : `${Number(visibleTime.toFixed(1))} segundos`}</span>
              <span className="mt-[2px] h-0 w-0 border-l-[6px] border-r-[6px] border-t-[10px] border-l-transparent border-r-transparent border-t-[#d7d9da]" />
            </div>
            <div className="absolute bottom-0 flex h-5 w-full overflow-hidden rounded-[3px] bg-[#303638]">
              {revealPoints.map((point, index) => {
                const previousPoint = index === 0 ? 0 : revealPoints[index - 1];
                return <div key={point + ' - '+index} className="relative h-full border-r-2 border-[#15191a]" style={{ width: `${((point - previousPoint) / trackLength) * 100}%`, minWidth: index === 0 ? "5px" : undefined }} />;
              })}
              <div className="absolute bottom-0 left-0 h-full bg-blue-900 transition-[width]" style={{ width: `${(visibleTime / trackLength) * 100}%` }} />
            </div>
          </div>

          <button disabled={isRoundLost} aria-label={isPlaying ? "Pausar música" : "Tocar música"} onClick={() => {
            if (isPlaying) {
              stopAudio();
              return;
            }
            void playPreview();
          }} className="mx-auto mt-[25px] flex h-[53px] w-[53px] cursor-pointer items-center justify-center rounded-full bg-[#303f8f] text-white transition hover:bg-[#3b4daa] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50">
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>
        </div>

        <div className="relative mt-[27px] flex w-full gap-[7px]">
          <label className="flex h-10 flex-1 items-center rounded-[3px] bg-[#272a2c] px-3 text-[#8d979c]">
            <Search size={21} strokeWidth={2} />
            <input disabled={isRoundOver} list="breque-options" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquise o breque" className="w-full bg-transparent px-3 text-[15px] outline-none placeholder:text-[#8d979c] disabled:cursor-not-allowed disabled:opacity-50" />
          </label>
          <datalist id="breque-options">
            {availableOptions.map((option) => <option key={option.nome} value={option.nome} />)}
          </datalist>
          <button onClick={async () => {
            stopAudio();
            const answer = query.trim();
            if (!answer) {
              setIsSubmittingGuess(true);
              try {
                const date = formatarDataParaApi(selectedDate);
                await api.put(`/adivinhe/${date}/${brequeId}`, { guess: "pulou" }, { withCredentials: true });
              } finally {
                setIsSubmittingGuess(false);
              }
              setElapsed(0.1);
              setQuery("");
              setWrongAnswers((current) => [...current, "Pulou o palpite"]);
              if (attemptIndex === revealPoints.length - 1) {
                setIsRoundLost(true);
                void carregarVideoResultado();
              }
              setAttemptIndex((current) => Math.min(current + 1, revealPoints.length - 1));
              return;
            }
            const selectedOption = availableOptions.find((option) => option.nome === answer);
            if (!selectedOption || brequeId === null) return;

            setIsSubmittingGuess(true);
            let acertou = false;
            try {
              const date = formatarDataParaApi(selectedDate);
              const response = await api.put(`/adivinhe/${date}/${brequeId}`, { guess: selectedOption.nome }, { withCredentials: true });
              acertou = response.data.acertou === true;
            } finally {
              setIsSubmittingGuess(false);
            }

            setElapsed(0.1);
            setQuery("");
            if (acertou) {
              setCorrectAnswer(answer);
              void carregarVideoResultado();
              return;
            }
            setWrongAnswers((current) => [...current, answer]);
            setAvailableOptions((current) => current.filter((option) => option.nome !== selectedOption.nome));
            if (attemptIndex === revealPoints.length - 1) {
              setIsRoundLost(true);
              void carregarVideoResultado();
            }
            setAttemptIndex((current) => Math.min(current + 1, revealPoints.length - 1));
          }} disabled={isRoundOver || isSubmittingGuess} className="h-10 w-[92px] cursor-pointer rounded-[3px] bg-[#f0f0f0] text-[11px] font-medium text-[#212426] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50">{hasGuess ? "Adivinhar" : "Pular"}</button>
        </div>
        {isRoundLost && <p className="mt-3 text-sm font-medium text-[#d7d9da]">Você perdeu: as seis tentativas foram usadas.</p>}
          </>
        )}
      </section>

      <aside className="order-3 w-full lg:w-[245px] lg:pt-[230px]" aria-label="Calendário">
        <div className="rounded-[5px] border border-[#303638] bg-[#1b1f20] p-4">
          <div className="flex items-center justify-between gap-2">
            <button aria-label="Mês anterior" onClick={() => setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))} className="flex h-8 w-8 items-center justify-center rounded-[4px] text-[#aeb5b8] transition hover:bg-[#303638] hover:text-white">
              <ArrowLeft size={15} />
            </button>
            <h2 className="text-[15px] font-semibold capitalize text-[#f0f0f0]">{monthLabel}</h2>
            <button aria-label="Próximo mês" onClick={() => setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))} className="flex h-8 w-8 items-center justify-center rounded-[4px] text-[#aeb5b8] transition hover:bg-[#303638] hover:text-white">
              <ArrowRight size={15} />
            </button>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[10px] uppercase text-[#7f898d]">
            {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const dateKey = day === null ? "" : `${calendarMonth.getFullYear()}-${calendarMonth.getMonth()}-${day}`;
              const isSelected = dateKey === selectedDateKey;
              const calendarDate = day === null ? null : new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
              const isBeforeFirstSelectableDate = calendarDate !== null && calendarDate < firstSelectableDate;
              const isFutureDate = calendarDate !== null && calendarDate > today;
              const isUnavailableDate = day === null || isBeforeFirstSelectableDate || isFutureDate;
              return (
                <button key={`${dateKey}-${index}`} disabled={isUnavailableDate} onClick={() => calendarDate && !isUnavailableDate && setSelectedDate(calendarDate)} className={`flex aspect-square items-center justify-center rounded-[4px] text-[12px] transition ${day === null ? "cursor-default" : isUnavailableDate ? "cursor-not-allowed text-[#4b5559]" : isSelected ? "bg-[#303f8f] font-semibold text-white" : "text-[#c5cbcd] hover:bg-[#303638] cursor-pointer"}`}>
                  {day ?? ""}
                </button>
              );
            })}
          </div>
          <p className="mt-4 border-t border-[#303638] pt-3 text-center text-[11px] text-[#8d979c]">
            Dia selecionado: {selectedDate.toLocaleDateString("pt-BR")}
          </p>
          <button
            onClick={() => {
              const currentDate = new Date();
              setCalendarMonth(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));
              setSelectedDate(currentDate);
            }}
            className="mt-3 h-9 w-full rounded-[4px] cursor-pointer bg-[#303f8f] px-3 text-[12px] font-medium text-white transition hover:bg-[#3b4daa]"
          >
            Desafio de hoje
          </button>
        </div>
        {isRoundOver && <div className="mt-4 rounded-[5px] border border-[#303638] bg-[#1b1f20] p-4">
          <h2 className="text-[15px] font-semibold text-[#f0f0f0]">🎉 Gostou da brincadeira? </h2>
          <p className="mt-2 text-[12px] leading-5 text-[#aeb5b8] font-bold">Você pode indicar breques para a brincadeira. Clique no botão abaixo</p>
          <button type="button" onClick={() => window.open("https://forms.gle/cwztzUhCXRPM2MRh6", "_blank", "noopener,noreferrer")} className="mt-3 h-9 w-full rounded-[4px] font-bold bg-[#303f8f] cursor-pointer px-3 text-[12px] text-white transition hover:bg-[#3b4daa]">
            Quero indicar
          </button>
        </div>}
      </aside>
      </div>

      {isStatsModalOpen && (
        <div onClick={() => setIsStatsModalOpen(false)} className="fixed inset-0 z-10 flex items-center justify-center bg-black/75 px-4 py-6" role="dialog" aria-modal="true" aria-labelledby="stats-title">
          <div onClick={(event) => event.stopPropagation()} className="relative w-full max-w-[560px] rounded-lg border border-[#353a3d] bg-[#1d2122] p-5 shadow-2xl">
            <button aria-label="Fechar estatísticas" onClick={() => setIsStatsModalOpen(false)} className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-[#aeb5b8] transition hover:bg-[#303638] hover:text-white">
              <X size={18} />
            </button>
            <h2 id="stats-title" className="pr-8 text-xl font-semibold text-[#f4f4f4]">Acertos por tentativa</h2>
            <p className="mt-2 text-sm text-[#aeb5b8]">Quantidade de usuários que acertaram o breque em cada tentativa.</p>
            <div className="mt-6 flex flex-col gap-3">
              {ESTATISTICAS_ACERTOS.map((stat) => (
                <div key={stat.attempts} className="grid grid-cols-[72px_1fr_38px] items-center gap-3 text-sm">
                  <span className="text-[#c5cbcd]">{stat.attempts}</span>
                  <div className="h-5 overflow-hidden rounded-[3px] bg-[#303638]">
                    <div className="h-full rounded-[3px] bg-blue-900 transition-[width]" style={{ width: `${(stat.users / maxUsers) * 100}%` }} />
                  </div>
                  <span className="text-right font-semibold text-[#f0f0f0]">{stat.users}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
