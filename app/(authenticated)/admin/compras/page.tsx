"use client"

import { Header } from "@/components/Header";
import AvatarIcon from "@/components/AvatarIcon";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/services/api";
import Cookies from "js-cookie";
import {
  CircleCheck,
  CircleDollarSign,
  CircleX,
  Clock3,
  LoaderCircle,
  ReceiptText,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useMemo, useState } from "react";

interface TransactionsProps {
  payment_id: string;
  id: string;
  value: number;
  amount: number;
  status: string;
  payed?: string | null;
  description: string;
  created_at: string;
  payer: {
    id: string;
    name: string;
    profile_url: string;
  };
}

type PaymentFilter = "all" | "paid" | "unpaid";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR");

function isPaid(transaction: TransactionsProps) {
  const status = transaction.status?.toUpperCase();
  return Boolean(transaction.payed) || status === "PAYED" || status === "PAID";
}

function formatDate(value?: string | null) {
  if (!value) return "Pagamento pendente";

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Data indisponível" : dateFormatter.format(date);
}

function SummaryCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
          {icon}
        </span>
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
    </div>
  );
}

export default function ComprasPage() {
  useContext(AuthContext);

  const router = useRouter();
  const [transactions, setTransactions] = useState<TransactionsProps[]>([]);
  const [filter, setFilter] = useState<PaymentFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadTransactions() {
      try {
        const token = Cookies.get("bubet.token");
        if (!token) {
          router.replace("/dashboard");
          return;
        }

        const base64Url = token.split(".")[1];
        if (!base64Url) {
          router.replace("/dashboard");
          return;
        }

        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(window.atob(base64));
        if (payload.role !== "ADMIN") {
          router.replace("/dashboard");
          return;
        }

        const response = await api.get("/admin/transactions", { withCredentials: true });
        if (!Array.isArray(response.data)) {
          throw new Error("A resposta de compras veio em um formato inválido.");
        }
        if (active) setTransactions(response.data);
      } catch (requestError) {
        console.error("Não foi possível carregar as compras.", requestError);
        if (active) {
          setError("Não foi possível carregar as compras. Tente novamente mais tarde.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadTransactions();
    return () => {
      active = false;
    };
  }, [router]);

  const sortedTransactions = useMemo(
    () =>
      [...transactions].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
    [transactions],
  );

  const paidTransactions = transactions.filter(isPaid);
  const unpaidTransactions = transactions.filter((transaction) => !isPaid(transaction));
  const totalAmount = transactions.reduce((total, transaction) => total + transaction.amount, 0);
  const paidAmount = paidTransactions.reduce((total, transaction) => total + transaction.amount, 0);
  const unpaidAmount = unpaidTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0,
  );

  const visibleTransactions = sortedTransactions.filter((transaction) => {
    if (filter === "paid") return isPaid(transaction);
    if (filter === "unpaid") return !isPaid(transaction);
    return true;
  });

  const filters: { label: string; value: PaymentFilter; count: number }[] = [
    { label: "Todas", value: "all", count: transactions.length },
    { label: "Pagas", value: "paid", count: paidTransactions.length },
    { label: "Não pagas", value: "unpaid", count: unpaidTransactions.length },
  ];

  return (
    <>
      <title>Extrato de Compras</title>
      <meta name="event" content="Extrato de Compras!" />

      <div className="min-h-screen bg-slate-50">
        <Header />

        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
              Administração
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Extrato de compras
            </h1>
            <p className="mt-2 text-slate-600">
              Acompanhe os pedidos, pagamentos e valores adquiridos.
            </p>
          </div>

          <section aria-label="Resumo das compras" className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SummaryCard
              label="Valor total adquirido"
              value={currencyFormatter.format(totalAmount)}
              icon={<CircleDollarSign aria-hidden="true" className="h-5 w-5" />}
              tone="bg-emerald-50 text-emerald-700"
            />
            <SummaryCard
              label={`Pagas · ${paidTransactions.length}`}
              value={currencyFormatter.format(paidAmount)}
              icon={<CircleCheck aria-hidden="true" className="h-5 w-5" />}
              tone="bg-blue-50 text-blue-700"
            />
            <SummaryCard
              label={`Em aberto · ${unpaidTransactions.length}`}
              value={currencyFormatter.format(unpaidAmount)}
              icon={<Clock3 aria-hidden="true" className="h-5 w-5" />}
              tone="bg-amber-50 text-amber-700"
            />
          </section>

          <section aria-labelledby="transactions-heading" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h2 id="transactions-heading" className="text-lg font-semibold text-slate-900">
                  Transações
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {visibleTransactions.length}{" "}
                  {visibleTransactions.length === 1 ? "registro" : "registros"}
                </p>
              </div>

              <div
                aria-label="Filtrar compras por pagamento"
                className="flex w-full rounded-xl bg-slate-100 p-1 sm:w-auto"
                role="group"
              >
                {filters.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={filter === option.value}
                    onClick={() => setFilter(option.value)}
                    className={`flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:flex-none ${
                      filter === option.value
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {option.label}
                    <span className="ml-1.5 text-xs text-slate-400">{option.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-slate-500">
                <LoaderCircle aria-hidden="true" className="h-7 w-7 animate-spin text-emerald-700" />
                <p className="text-sm">Carregando transações...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center px-6 py-14 text-center">
                <CircleX aria-hidden="true" className="h-8 w-8 text-red-500" />
                <p className="mt-3 font-medium text-slate-900">O extrato não está disponível</p>
                <p className="mt-1 text-sm text-slate-500">{error}</p>
              </div>
            ) : visibleTransactions.length === 0 ? (
              <div className="flex flex-col items-center px-6 py-14 text-center">
                <ReceiptText aria-hidden="true" className="h-8 w-8 text-slate-400" />
                <p className="mt-3 font-medium text-slate-900">Nenhuma compra encontrada</p>
                <p className="mt-1 text-sm text-slate-500">
                  {filter === "all"
                    ? "As compras aparecerão aqui quando forem realizadas."
                    : `Não há compras ${filter === "paid" ? "pagas" : "não pagas"} no momento.`}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {visibleTransactions.map((transaction) => {
                  const paid = isPaid(transaction);

                  return (
                    <li
                      key={transaction.id}
                      className="flex flex-col gap-4 px-5 py-5 transition-colors hover:bg-slate-50/70 sm:px-6"
                    >
                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                        <div className="flex min-w-0 items-center gap-3">
                          <button
                            type="button"
                            onClick={() => router.push(`/profile/${transaction.payer.id}`)}
                            className="flex min-w-0 items-center gap-3 rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                            aria-label={`Ver perfil de ${transaction.payer.name}`}
                          >
                            <AvatarIcon
                              name={transaction.payer.name}
                              size={44}
                              src={transaction.payer.profile_url}
                            />
                            <span className="min-w-0">
                              <span className="block truncate font-semibold text-slate-900">
                                {transaction.payer.name}
                              </span>
                              <span className="mt-0.5 block text-sm text-slate-500">Comprador</span>
                            </span>
                          </button>
                        </div>

                        <div className="flex shrink-0 flex-col sm:items-end">
                          <span className="text-lg font-bold text-slate-900">
                            {currencyFormatter.format(transaction.value)}
                          </span>
                          <span
                            className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                              paid
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {paid ? (
                              <CircleCheck aria-hidden="true" className="h-3.5 w-3.5" />
                            ) : (
                              <Clock3 aria-hidden="true" className="h-3.5 w-3.5" />
                            )}
                            {paid ? "Pago" : "Não pago"}
                          </span>
                        </div>
                      </div>

                      <div className="grid gap-3 border-t border-slate-100 pt-4 text-sm sm:grid-cols-3">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Item
                          </p>
                          <p className="mt-1 font-medium text-slate-700">{transaction.description}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Data da compra
                          </p>
                          <p className="mt-1 font-medium text-slate-700">
                            {formatDate(transaction.created_at)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            {paid ? "Data do pagamento" : "Pagamento"}
                          </p>
                          <p className="mt-1 font-medium text-slate-700">
                            {paid ? formatDate(transaction.payed) : "Aguardando pagamento"}
                          </p>
                        </div>
                      </div>

                      <p className="truncate text-xs text-slate-400">
                        ID da transação: {transaction.payment_id}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </main>
      </div>
    </>
  );
}
