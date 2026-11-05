"use client"

import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/AuthContext";
import Cookies from "js-cookie";
import { api } from "@/services/api";
import { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Check, CirclePlus, Package, Sparkles, Ticket } from "lucide-react";

interface CodigosProps {
  id: string;
  codigo: string;
  created_at: string;
  item: {
    name: string;
    image_url: string;
  };
  quantity: string;
  reedeemed?: string;
  reedeemer?: {
    name: string;
  };
}

interface ItemsProps {
  name: string;
  id: string;
}

interface CodigoFormData {
  code: string;
  item: string;
  item_id: string;
  quantity: number;
  codeCount: number;
}

const generateRandomCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

const createUniqueCodes = (count: number) => {
  const codes = new Set<string>();

  while (codes.size < count) {
    codes.add(generateRandomCode());
  }

  return [...codes];
};

const initialFormData = (): CodigoFormData => ({
  code: generateRandomCode(),
  item: "",
  item_id: "",
  quantity: 1,
  codeCount: 1,
});

export default function ComprasPage() {
  useContext(AuthContext);

  const router = useRouter();
  const [codigos, setCodigos] = useState<CodigosProps[]>([]);
  const [items, setItems] = useState<ItemsProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemSearch, setItemSearch] = useState("");
  const [formData, setFormData] = useState<CodigoFormData>(initialFormData);

  useEffect(() => {
    const token = Cookies.get("bubet.token");
    const base64Url = token!.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    const tok = JSON.parse(window.atob(base64));

    if (tok.role !== "ADMIN") {
      router.replace("/dashboard");
      return;
    }

    const loadPageData = async () => {
      try {
        const [codesResponse, itemsResponse] = await Promise.all([
          api.get("/codigos", { withCredentials: true }),
          api.get("/codigos/items", { withCredentials: true }),
        ]);
        setCodigos(codesResponse.data.codigos);
        setItems(itemsResponse.data.items);
      } catch (error) {
        console.error("Erro ao carregar códigos promocionais:", error);
        toast.error("Não foi possível carregar os códigos promocionais.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadPageData();
  }, [router]);

  const resetForm = () => {
    setFormData(initialFormData());
    setItemSearch("");
  };

  const openCreateDialog = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleItemSearchChange = (value: string) => {
    setItemSearch(value);
    const selectedItem = items.find((item) => item.name.toLowerCase() === value.toLowerCase());

    setFormData((previous) => ({
      ...previous,
      item_id: selectedItem?.id ?? "",
    }));
  };

  const refreshCodes = async () => {
    const response = await api.get("/codigos", { withCredentials: true });
    setCodigos(response.data.codigos);
  };

  const handleCreateCodigo = async () => {
    if (!formData.item || !formData.item_id) {
      toast.error("Selecione o tipo e o item que serão resgatados pelo código.");
      return;
    }

    if (!Number.isInteger(formData.quantity) || formData.quantity < 1) {
      toast.error("A quantidade por código deve ser um número inteiro maior que zero.");
      return;
    }

    if (!Number.isInteger(formData.codeCount) || formData.codeCount < 1) {
      toast.error("Informe uma quantidade válida de códigos.");
      return;
    }

    const codes =
      formData.codeCount === 1
        ? [formData.code.trim().toUpperCase()]
        : createUniqueCodes(formData.codeCount);

    if (!codes[0]) {
      toast.error("Informe o código promocional.");
      return;
    }

    setIsCreating(true);
    let createdCount = 0;

    try {
      for (const code of codes) {
        await api.post(
          "/codigos",
          {
            code,
            item: formData.item,
            item_id: formData.item_id,
            quantity: formData.quantity,
          },
          { withCredentials: true },
        );
        createdCount += 1;
      }
    } catch (error) {
      console.error("Erro ao criar códigos promocionais:", error);

      if (createdCount > 0) {
        setIsModalOpen(false);
        resetForm();
        try {
          await refreshCodes();
        } catch (refreshError) {
          console.error("Erro ao atualizar a lista de códigos:", refreshError);
        }
        toast.error(
          `${createdCount} de ${codes.length} códigos foram criados. Confira a lista antes de tentar novamente.`,
        );
      } else {
        toast.error(
          error instanceof Error ? error.message : "Não foi possível criar os códigos.",
        );
      }

      setIsCreating(false);
      return;
    }

    setIsModalOpen(false);
    resetForm();
    let refreshFailed = false;
    try {
      await refreshCodes();
    } catch (error) {
      console.error("Erro ao atualizar a lista de códigos:", error);
      refreshFailed = true;
    }
    toast.success(
      `${createdCount} ${createdCount === 1 ? "código criado" : "códigos criados"} com sucesso!`,
    );
    if (refreshFailed) {
      toast.error("Os códigos foram criados, mas não foi possível atualizar a lista.");
    }
    setIsCreating(false);
  };

  const redeemedCount = codigos.filter((codigo) => codigo.reedeemer).length;
  const selectedItem = items.find((item) => item.id === formData.item_id);
  const totalUnits = formData.codeCount * formData.quantity;

  return (
    <>
      <title>Códigos Promocionais</title>
      <meta name="event" content="Códigos promocionais!" />

      <div className="min-h-screen bg-slate-50">
        <Header />

        <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
          <section className="mb-8 flex flex-col gap-5 rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600 p-6 text-white shadow-lg shadow-blue-900/10 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="max-w-xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-blue-50">
                <Ticket className="size-4" aria-hidden="true" />
                Área administrativa
              </div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Códigos promocionais
              </h1>
              <p className="mt-2 text-sm leading-6 text-blue-100 sm:text-base">
                Crie códigos para distribuir itens e acompanhe os resgates em um só lugar.
              </p>
            </div>
            <Button
              onClick={openCreateDialog}
              className="h-11 shrink-0 bg-white px-5 font-semibold text-blue-700 shadow-sm hover:bg-blue-50"
            >
              <CirclePlus className="size-4" aria-hidden="true" />
              Criar códigos
            </Button>
          </section>

          <section className="mb-8 grid gap-4 sm:grid-cols-2" aria-label="Resumo dos códigos">
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Ticket className="size-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Códigos criados</p>
                <p className="text-2xl font-bold text-slate-900">{codigos.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Check className="size-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Já resgatados</p>
                <p className="text-2xl font-bold text-slate-900">{redeemedCount}</p>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Todos os códigos</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Consulte o benefício e o status de cada código.
                </p>
              </div>
              <span className="rounded-full bg-slate-200/70 px-3 py-1 text-xs font-semibold text-slate-600">
                {codigos.length} {codigos.length === 1 ? "código" : "códigos"}
              </span>
            </div>

            {isLoading ? (
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
                Carregando códigos...
              </div>
            ) : codigos.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <Ticket className="size-6" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">Nenhum código por aqui ainda</h3>
                <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                  Crie seu primeiro código promocional ou gere vários de uma vez.
                </p>
                <Button onClick={openCreateDialog} className="mt-5">
                  <CirclePlus className="size-4" aria-hidden="true" />
                  Criar primeiro código
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {[...codigos]
                  .sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
                  )
                  .map((codigo) => (
                    <article
                      key={codigo.id}
                      className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-5"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="hidden size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 sm:flex">
                          <Package className="size-5" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <code className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-sm font-bold tracking-wider text-slate-800">
                              {codigo.codigo}
                            </code>
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                codigo.reedeemer
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              {codigo.reedeemer ? "Resgatado" : "Disponível"}
                            </span>
                          </div>
                          <p className="mt-2 truncate text-sm font-medium text-slate-700">
                            {codigo.quantity} × {codigo.item?.name ?? "Item"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 border-t border-slate-100 pt-3 text-sm text-slate-500 sm:max-w-52 sm:border-0 sm:pt-0 sm:text-right">
                        {codigo.reedeemer ? (
                          <>
                            <Check className="size-4 shrink-0 text-emerald-600" aria-hidden="true" />
                            <span className="truncate">Resgatado por {codigo.reedeemer.name}</span>
                          </>
                        ) : (
                          <span>Aguardando resgate</span>
                        )}
                      </div>
                    </article>
                  ))}
              </div>
            )}
          </section>
        </main>
      </div>

      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!isCreating) setIsModalOpen(open);
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto rounded-2xl p-5 sm:p-7">
          <DialogHeader>
            <div className="mb-1 flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Ticket className="size-5" aria-hidden="true" />
            </div>
            <DialogTitle className="text-xl">Criar códigos promocionais</DialogTitle>
            <DialogDescription>
              Defina o benefício e quantos códigos únicos deseja gerar.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="item-type">Tipo do item</Label>
                <Select
                  value={formData.item}
                  onValueChange={(value) =>
                    setFormData((previous) => ({ ...previous, item: value }))
                  }
                  disabled={isCreating}
                >
                  <SelectTrigger id="item-type" className="h-11">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CARD">Figurinha</SelectItem>
                    <SelectItem value="CARDPACK">Pacote</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="item_id">Item ou pacote</Label>
                <Input
                  id="item_id"
                  list="item-options"
                  placeholder="Busque pelo nome"
                  value={itemSearch}
                  onChange={(event) => handleItemSearchChange(event.target.value)}
                  disabled={isCreating}
                  className="h-11"
                />
                <datalist id="item-options">
                  {items.map((item) => (
                    <option key={item.id} value={item.name} />
                  ))}
                </datalist>
                {formData.item_id && (
                  <p className="flex items-center gap-1 text-xs font-medium text-emerald-700">
                    <Check className="size-3.5" aria-hidden="true" />
                    Item selecionado
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="quantity">Unidades por código</Label>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  step={1}
                  value={formData.quantity}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      quantity: event.target.value === "" ? 0 : Number(event.target.value),
                    }))
                  }
                  disabled={isCreating}
                  className="h-11"
                />
                <p className="text-xs text-slate-500">Quantas unidades cada resgate dará.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code-count">Quantidade de códigos</Label>
                <Input
                  id="code-count"
                  type="number"
                  min={1}
                  step={1}
                  value={formData.codeCount}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      codeCount: event.target.value === "" ? 0 : Number(event.target.value),
                    }))
                  }
                  disabled={isCreating}
                  className="h-11"
                />
                <p className="text-xs text-slate-500">Cada código poderá ser resgatado uma vez.</p>
              </div>
            </div>

            {formData.codeCount === 1 ? (
              <div className="space-y-2">
                <Label htmlFor="codigo">Código</Label>
                <Input
                  id="codigo"
                  placeholder="Digite ou use o código sugerido"
                  value={formData.code}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      code: event.target.value.toUpperCase(),
                    }))
                  }
                  disabled={isCreating}
                  className="h-11 font-mono uppercase tracking-wider"
                />
              </div>
            ) : (
              <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
                <Sparkles className="mt-0.5 size-5 shrink-0 text-blue-700" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Códigos únicos gerados automaticamente
                  </p>
                  <p className="mt-1 text-sm leading-5 text-slate-600">
                    Cada um dos {formData.codeCount} códigos terá um código próprio para compartilhar.
                  </p>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Resumo do benefício
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-800">
                <span className="rounded-lg bg-white px-3 py-2 shadow-sm">
                  {formData.codeCount} {formData.codeCount === 1 ? "código" : "códigos"}
                </span>
                <span className="text-slate-400">×</span>
                <span className="rounded-lg bg-white px-3 py-2 shadow-sm">
                  {formData.quantity} {formData.quantity === 1 ? "unidade" : "unidades"}
                  {selectedItem ? ` de ${selectedItem.name}` : ""}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-600">
                Cada código dará {formData.quantity}{" "}
                {formData.quantity === 1 ? "unidade" : "unidades"}.
                {formData.codeCount > 1 && ` No total, serão distribuídas ${totalUnits} unidades.`}
              </p>
            </div>
          </div>

          <DialogFooter className="mt-1">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isCreating}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateCodigo}
              disabled={isCreating}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isCreating ? (
                "Criando..."
              ) : (
                <>
                  <CirclePlus className="size-4" aria-hidden="true" />
                  Criar {formData.codeCount > 1 ? `${formData.codeCount} códigos` : "código"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
