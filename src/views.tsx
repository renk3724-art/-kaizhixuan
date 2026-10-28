import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { cn } from "./utils/cn";
import {
  BRAND_MARK,
  BRAND_SPOKEN,
  cleanHandle,
  deliveryTemplate,
  encodeOrder,
  filters,
  getProduct,
  hasAssist,
  hasPack,
  orderLink,
  orderSummary,
  pick,
  products,
  prompts,
  sellerLink,
  totalOf,
  xianyuPost,
  xPost,
  yuan,
  type ContactType,
  type MarkName,
  type OrderStatus,
  type PayMethod,
  type Product,
} from "./data";
import { useShop } from "./store";

export function Wordmark({ tone = "ink", className = "" }: { tone?: "ink" | "cream"; className?: string }) {
  const ink = tone === "cream" ? "text-[#f7f1e6]" : "text-[#1a1714]";
  const accent = tone === "cream" ? "text-[#e7c98a]" : "text-[#c44832]";
  return (
    <span className={cn("inline-flex items-baseline font-serif leading-none tracking-[-0.045em]", ink, className)} aria-label={BRAND_MARK}>
      <span>R</span>
      <span className={cn("-translate-y-[0.32em] px-[0.02em] font-sans text-[0.58em]", accent)} aria-hidden="true">ˉ</span>
      <span>k</span>
      <span className="ml-[0.04em] italic">AI</span>
    </span>
  );
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "true");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

const btnBlack =
  "flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#141210] text-[15px] font-medium text-white transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40";
const btnGhost =
  "flex h-12 w-full items-center justify-center rounded-full border border-[#e0d4c2] bg-white text-[15px] text-[#1a1714] transition active:scale-[0.99]";
const btnRed =
  "flex h-12 w-full items-center justify-center rounded-full bg-[#c44832] text-[15px] font-medium text-white transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40";
const fieldCls =
  "w-full rounded-2xl border border-[#e4d9c6] bg-white px-3.5 py-3 text-[16px] text-[#1a1714] outline-none placeholder:text-[#b3a898] focus:border-[#c44832]";

export function IconSearch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-4 w-4", className)} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16.5L20 20.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconBag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-5 w-5", className)} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M6.5 8h11l-.8 11.2a1.5 1.5 0 0 1-1.5 1.3H8.8a1.5 1.5 0 0 1-1.5-1.3L6.5 8Z" />
      <path d="M9 8V7a3 3 0 0 1 6 0v1" strokeLinecap="round" />
    </svg>
  );
}

export function IconHeadset({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-5 w-5", className)} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M4.5 13a7.5 7.5 0 0 1 15 0" strokeLinecap="round" />
      <rect x="3" y="12.5" width="4" height="6.5" rx="1.4" />
      <rect x="17" y="12.5" width="4" height="6.5" rx="1.4" />
      <path d="M21 16.5v.8a2.8 2.8 0 0 1-2.8 2.8H15" strokeLinecap="round" />
    </svg>
  );
}

export function IconHome({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-5 w-5", className)} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M4 11.5 12 4l8 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 10.5V20h10v-9.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconOrders({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-5 w-5", className)} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M7 4.5h8l3 3V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1Z" />
      <path d="M15 4.5V8h4M9 12h6M9 16h4" strokeLinecap="round" />
    </svg>
  );
}

export function IconDesk({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-5 w-5", className)} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M5 19V8.5A3.5 3.5 0 0 1 8.5 5h7A3.5 3.5 0 0 1 19 8.5V19" strokeLinecap="round" />
      <path d="M8 19v-4h8v4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 5v3" strokeLinecap="round" />
    </svg>
  );
}

export function IconChevron({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-4 w-4", className)} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconClose({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-4 w-4", className)} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

export function Mark({ name }: { name: MarkName }) {
  const shell: Record<MarkName, string> = {
    star: "bg-[#1c1848] text-[#f6efe2]",
    seal: "bg-[#141210] text-[#e7c98a]",
    wave: "bg-[#1d5fbf] text-white",
    orbit: "bg-[#141210] text-white",
    prism: "bg-[#f7f3ea] text-[#1a1714] ring-1 ring-[#eadfce]",
    fold: "bg-[#1c6b52] text-white",
    pro: "bg-[#143f34] text-white",
    spark: "bg-[#c4643f] text-white",
    pages: "bg-[#f3ead8] text-[#6e4c22] ring-1 ring-[#e6d5b8]",
    bolt: "bg-[#c44832] text-white",
    film: "bg-[#e4ddd3] text-[#5c534a]",
  };
  return (
    <span className={cn("grid h-14 w-14 shrink-0 place-items-center rounded-[18px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]", shell[name])}>
      <MarkGlyph name={name} />
    </span>
  );
}

function MarkGlyph({ name }: { name: MarkName }) {
  if (name === "star") {
    return (
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
        <path fill="#f2c14e" d="M16 3.2l2.7 8h8.4l-6.8 5 2.6 8.1L16 19.6 9.1 24.3l2.6-8.1-6.8-5h8.4z" />
      </svg>
    );
  }
  if (name === "seal") {
    return (
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
        <circle cx="16" cy="16" r="8" fill="none" stroke="#e7c98a" strokeWidth="1.6" />
        <path d="M16 10.5v6.2M13.4 14.2h5.2" stroke="#e7c98a" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="16" cy="19.2" r="1.1" fill="#e7c98a" />
      </svg>
    );
  }
  if (name === "wave") {
    return (
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
        <path d="M7 13c2.2 0 2.2-3 4.4-3S13.6 13 15.8 13s2.2-3 4.4-3 2.2 3 4.4 3" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M7 19c2.2 0 2.2-3 4.4-3s2.2 3 4.4 3 2.2-3 4.4-3 2.2 3 4.4 3" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "orbit") {
    return (
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
        <circle cx="16" cy="16" r="6.5" fill="none" stroke="white" strokeWidth="1.6" />
        <circle cx="21.5" cy="12" r="1.5" fill="white" />
        <path d="M8 22.5c6-2 10-8 16-9" fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "prism") {
    return (
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
        <path d="M16 5l9 18H7z" fill="#dbe7ff" />
        <path d="M16 5l9 18h-4.2L16 11.2z" fill="#f2c14e" />
        <path d="M16 5L7 23h4.4L16 11.2z" fill="#e07a8a" />
      </svg>
    );
  }
  if (name === "fold") {
    return (
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
        <path d="M8 9.5h12.5a3 3 0 0 1 3 3V19a3 3 0 0 1-3 3H13l-4.2 3.2V22H8a3 3 0 0 1-3-3v-6.5a3 3 0 0 1 3-3Z" fill="white" />
      </svg>
    );
  }
  if (name === "pro") {
    return (
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
        <rect x="8" y="10" width="14" height="12" rx="2" fill="white" opacity="0.45" />
        <rect x="11" y="7.5" width="14" height="12" rx="2" fill="white" />
      </svg>
    );
  }
  if (name === "spark") {
    return (
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
        <path fill="white" d="M16 5l1.6 7.2L25 14l-7.4 1.8L16 23l-1.6-7.2L7 14l7.4-1.8z" />
      </svg>
    );
  }
  if (name === "pages") {
    return (
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
        <path d="M10 8h12v14H10z" fill="none" stroke="#6e4c22" strokeWidth="1.5" />
        <path d="M12 12h8M12 15.5h8M12 19h5" stroke="#6e4c22" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "bolt") {
    return (
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
        <path fill="white" d="M17.5 5L9 17.2h6.2L13.8 27 23 14.2h-6.1z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
      <rect x="7" y="9" width="18" height="14" rx="2" fill="none" stroke="#5c534a" strokeWidth="1.5" />
      <path d="M7 13h18M12 9v4M20 9v4" stroke="#5c534a" strokeWidth="1.4" />
    </svg>
  );
}

export function Pill({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "gold" | "sage" | "blue" | "gray" | "amber" | "red";
}) {
  const tones = {
    gold: "border border-[#ead9b8] bg-[#f8efe2] text-[#6e4c22]",
    sage: "bg-[#e7f4ec] text-[#246848]",
    blue: "bg-[#e7f1fb] text-[#2c5f90]",
    gray: "bg-[#f1ece4] text-[#5e564e]",
    amber: "bg-[#fbf0dc] text-[#8a5a12]",
    red: "bg-[#fdecea] text-[#a33b28]",
  };
  return <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] leading-5", tones[tone])}>{children}</span>;
}

export function Overlay({ onClose, label, children }: { onClose: () => void; label: string; children: ReactNode }) {
  const { t } = useShop();
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 xl:hidden">
      <button type="button" className="fade-in absolute inset-0 bg-[#1a1714]/45" aria-label={t.closeAria} onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className="sheet-in absolute inset-x-0 bottom-0 flex max-h-[min(92dvh,860px)] flex-col rounded-t-[28px] bg-[#f7f3ea] shadow-[0_-24px_60px_rgba(0,0,0,0.28)]"
      >
        <div className="relative px-4 pb-1 pt-3">
          <div className="mx-auto h-1 w-10 rounded-full bg-[#e0d5c4]" />
          <button type="button" onClick={onClose} aria-label={t.closeAria} className="absolute top-2 right-3 grid h-9 w-9 place-items-center rounded-full bg-white text-[#1a1714]">
            <IconClose />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">{children}</div>
      </div>
    </div>
  );
}

function stockCopy(stock: Product["stock"], t: ReturnType<typeof useShop>["t"]) {
  if (stock === "many") return t.stockMany;
  if (stock === "low") return t.stockLow;
  if (stock === "preorder") return t.stockPre;
  return t.stockOut;
}

function deliveryCopy(delivery: Product["delivery"], t: ReturnType<typeof useShop>["t"]) {
  if (delivery === "online") return t.deliveryOnline;
  if (delivery === "auto") return t.deliveryAuto;
  return t.deliveryQueue;
}

export function ProductDetail() {
  const { selectedId, lang, t, unitPrice, agentUnlocked, agentPreview, addToCart, beginCheckout, setSheet, openDetail } = useShop();
  const product = selectedId ? getProduct(selectedId) : undefined;
  const [qty, setQty] = useState(1);
  useEffect(() => setQty(1), [selectedId]);
  if (!product) return null;
  const price = unitPrice(product);
  const soldOut = product.stock === "out";
  return (
    <div>
      <button type="button" onClick={() => setSheet(null)} className="mb-3 text-[13px] text-[#8a7d6d]">
        ← {t.back}
      </button>
      <div className="flex items-start gap-3">
        <Mark name={product.mark} />
        <div className="min-w-0">
          <h2 className="font-serif text-[28px] leading-tight text-[#1a1714]">{pick(lang, product.title)}</h2>
          <p className="mt-1 text-[12px] text-[#8a7d6d]">
            {t.detailEta} · {pick(lang, product.eta)}
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-end gap-3">
        <p className="font-serif text-[42px] leading-none tabular-nums text-[#1a1714]">{yuan(price)}</p>
        {product.was && (
          <p className="mb-1 text-[13px] text-[#b3a898] line-through">
            {t.wasLabel} {yuan(product.was)}
          </p>
        )}
        {agentUnlocked && product.agentPrice && (
          <p className="mb-1 text-[12px] text-[#6e4c22]">{t.agentPriceLabel}</p>
        )}
      </div>
      {agentPreview && product.agentPrice && !agentUnlocked && (
        <p className="mt-1 text-[12px] text-[#8a6232]">
          {t.agentPriceLabel} {yuan(product.agentPrice)} · {t.previewHint}
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Pill tone={product.stock === "low" ? "amber" : product.stock === "out" ? "red" : "gray"}>{stockCopy(product.stock, t)}</Pill>
        <Pill tone="sage">{deliveryCopy(product.delivery, t)}</Pill>
        {product.tags[lang].map((tag) => (
          <Pill key={tag} tone="gold">
            {tag}
          </Pill>
        ))}
        {product.recommended && <Pill tone="blue">{t.recommend}</Pill>}
      </div>
      {soldOut ? (
        <p className="mt-4 rounded-2xl bg-[#fdecea] px-3 py-3 text-[13px] text-[#a33b28]">{t.outDetail}</p>
      ) : (
        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center rounded-full border border-[#e4d9c6] bg-white">
            <button type="button" className="grid h-10 w-10 place-items-center text-lg" onClick={() => setQty((n) => Math.max(1, n - 1))} aria-label="-">
              −
            </button>
            <span className="w-6 text-center text-[15px] tabular-nums">{qty}</span>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center text-lg"
              onClick={() => setQty((n) => Math.min(product.maxQty, n + 1))}
              aria-label="+"
            >
              +
            </button>
          </div>
          <p className="text-[12px] text-[#8a7d6d]">
            {t.total} {yuan(price * qty)}
          </p>
        </div>
      )}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button type="button" className={btnGhost} disabled={soldOut} onClick={() => addToCart(product.id, qty)}>
          {t.addCart}
        </button>
        <button
          type="button"
          className={btnBlack}
          disabled={soldOut}
          onClick={() => beginCheckout("now", [{ id: product.id, qty }])}
        >
          {soldOut ? t.soldOut : t.buyNow}
        </button>
      </div>
      <p className="mt-4 text-[14px] leading-relaxed text-[#3f382f]">{pick(lang, product.summary)}</p>
      <ul className="mt-3 space-y-2">
        {product.points[lang].map((point) => (
          <li key={point} className="flex gap-2 text-[13px] leading-relaxed text-[#4e463c]">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#c44832]" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
      {product.id === "agent" && (
        <div className="mt-4 rounded-2xl bg-[#f7f0e2] p-3">
          <p className="text-[13px] font-medium text-[#6e4c22]">{t.agentTable}</p>
          <p className="mt-1 text-[12px] text-[#8a6232]">{t.noIncome}</p>
          <ul className="mt-2 space-y-1.5">
            {products
              .filter((item) => item.agentPrice)
              .map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 text-[13px]">
                  <button type="button" className="truncate text-left underline decoration-[#e4d3b0]" onClick={() => openDetail(item.id)}>
                    {pick(lang, item.title)}
                  </button>
                  <span className="shrink-0 tabular-nums">
                    <span className="mr-1 text-[#b3a898] line-through">{yuan(item.price)}</span>
                    {yuan(item.agentPrice ?? item.price)}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      )}
      {product.id === "pack" && (
        <div className="mt-4">
          <PromptBlock locked />
        </div>
      )}
    </div>
  );
}

function PromptBlock({ locked }: { locked: boolean }) {
  const { lang, t, toast } = useShop();
  const visible = locked ? prompts.slice(0, 2) : prompts;
  const copyOne = async (body: string) => {
    const ok = await copyText(body);
    toast(ok ? t.copied : t.copyFail);
  };
  const copyAll = async () => {
    const text = prompts.map((item) => `${pick(lang, item.title)}\n${pick(lang, item.body)}`).join("\n\n");
    const ok = await copyText(text);
    toast(ok ? t.copied : t.copyFail);
  };
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[13px] text-[#6f655b]">{locked ? t.previewLock : t.unlocked}</p>
        {!locked && (
          <button type="button" className="text-[12px] text-[#c44832]" onClick={copyAll}>
            {t.copyAll}
          </button>
        )}
      </div>
      <div className="space-y-2">
        {visible.map((item) => (
          <article key={item.id} className="rounded-2xl border border-[#eadfce] bg-white p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[14px] font-medium">{pick(lang, item.title)}</h3>
                <p className="text-[12px] text-[#8a7d6d]">{pick(lang, item.scene)}</p>
              </div>
              <button type="button" className="shrink-0 text-[12px] text-[#c44832]" onClick={() => copyOne(pick(lang, item.body))}>
                {t.copyPrompt}
              </button>
            </div>
            <p className="mt-2 text-[12.5px] leading-relaxed text-[#4e463c]">{pick(lang, item.body)}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export function CartPanel() {
  const { t, lang, cart, setCartQty, unitPrice, beginCheckout, orders, openOrder, setChatOpen, openDetail } = useShop();
  const lines = cart
    .map((line) => {
      const product = getProduct(line.id);
      return product ? { line, product } : null;
    })
    .filter((item): item is { line: { id: string; qty: number }; product: Product } => Boolean(item));
  const total = totalOf(cart, unitPrice);
  const latest = orders.find((order) => order.status === "pending" || order.status === "paid");
  const featured = products[0];
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-serif text-[28px] leading-none">{t.cart}</h2>
        <button type="button" onClick={() => setChatOpen(true)} className="text-[13px] text-[#c44832]">
          {t.cs}
        </button>
      </div>
      {latest && (
        <button
          type="button"
          onClick={() => openOrder(latest.id)}
          className="mb-3 flex w-full items-center justify-between rounded-2xl bg-[#1a1714] px-3 py-3 text-left text-white"
        >
          <span>
            <span className="block text-[11px] text-white/60">{t.continueOrder}</span>
            <span className="font-serif text-[18px]">
              {latest.id} · {yuan(latest.total)}
            </span>
          </span>
          <span className="text-[12px] text-white/80">{statusLabel(latest.status, t)}</span>
        </button>
      )}
      {lines.length === 0 ? (
        <div className="rounded-[22px] border border-dashed border-[#e0d4c2] bg-white/70 px-4 py-6">
          <p className="font-serif text-[24px]">{t.emptyCart}</p>
          <p className="mt-1 text-[13px] leading-relaxed text-[#6f655b]">{t.emptyCartHint}</p>
          <button type="button" onClick={() => openDetail(featured.id)} className="mt-4 flex items-center gap-3 text-left">
            <Mark name={featured.mark} />
            <span>
              <span className="block text-[14px] font-medium">{pick(lang, featured.title)}</span>
              <span className="font-serif text-[20px]">{yuan(unitPrice(featured))}</span>
            </span>
          </button>
          <button type="button" className={cn(btnBlack, "mt-4")} onClick={() => openDetail(featured.id)}>
            {t.seeFeatured}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {lines.map(({ line, product }) => (
            <div key={line.id} className="flex gap-3 rounded-2xl bg-white p-3">
              <button type="button" onClick={() => openDetail(product.id)} aria-label={pick(lang, product.title)}>
                <Mark name={product.mark} />
              </button>
              <div className="min-w-0 flex-1">
                <button type="button" className="text-left text-[14px] font-medium leading-snug" onClick={() => openDetail(product.id)}>
                  {pick(lang, product.title)}
                </button>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-[#eadfce]">
                    <button type="button" className="grid h-8 w-8 place-items-center" onClick={() => setCartQty(line.id, line.qty - 1)} aria-label="-">
                      −
                    </button>
                    <span className="w-5 text-center text-[13px] tabular-nums">{line.qty}</span>
                    <button type="button" className="grid h-8 w-8 place-items-center" onClick={() => setCartQty(line.id, line.qty + 1)} aria-label="+">
                      +
                    </button>
                  </div>
                  <span className="font-serif text-[20px] tabular-nums">{yuan(unitPrice(product) * line.qty)}</span>
                </div>
              </div>
            </div>
          ))}
          <div className="flex items-end justify-between px-1 pt-1">
            <span className="text-[13px] text-[#6f655b]">{t.total}</span>
            <span className="font-serif text-[32px] leading-none tabular-nums">{yuan(total)}</span>
          </div>
          <button type="button" className={btnBlack} onClick={() => beginCheckout("cart", cart)}>
            {t.checkout}
          </button>
        </div>
      )}
    </div>
  );
}

function statusLabel(status: OrderStatus, t: ReturnType<typeof useShop>["t"]) {
  if (status === "pending") return t.pending;
  if (status === "paid") return t.paid;
  if (status === "done") return t.done;
  return t.closed;
}

export function CheckoutForm() {
  const { t, lang, draft, cart, unitPrice, createOrder, setSheet, settings } = useShop();
  const lines = draft ?? cart;
  const [contactType, setContactType] = useState<ContactType>("wechat");
  const [contact, setContact] = useState("");
  const [note, setNote] = useState("");
  const [payMethod, setPayMethod] = useState<PayMethod>("wechat");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const assist = hasAssist(lines);
  const pack = hasPack(lines);
  const total = totalOf(lines, unitPrice);
  const detailed = lines
    .map((line) => {
      const product = getProduct(line.id);
      return product ? { line, product } : null;
    })
    .filter((item): item is { line: { id: string; qty: number }; product: Product } => Boolean(item));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (contact.trim().length < 3) {
      setError(t.needContact);
      return;
    }
    if (contactType === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.trim())) {
      setError(t.badEmail);
      return;
    }
    if (!agreed) {
      setError(t.needAgree);
      return;
    }
    if (sending) return;
    setSending(true);
    setError("");
    const order = createOrder({ contact, contactType, payMethod, note });
    if (!order) setSending(false);
  };

  return (
    <form onSubmit={submit}>
      <button type="button" onClick={() => setSheet("cart")} className="mb-3 text-[13px] text-[#8a7d6d]">
        ← {t.backCart}
      </button>
      <h2 className="font-serif text-[28px] leading-none">{t.checkout}</h2>
      <p className="mt-2 text-[13px] text-[#6f655b]">
        {settings.shopNameZh} · {t.noCard}
      </p>
      <ul className="mt-4 space-y-2">
        {detailed.map(({ line, product }) => (
          <li key={line.id} className="flex items-center justify-between gap-3 text-[13px]">
            <span className="truncate">
              {pick(lang, product.title)} × {line.qty}
            </span>
            <span className="shrink-0 tabular-nums">{yuan(unitPrice(product) * line.qty)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex items-end justify-between">
        <span className="text-[13px] text-[#6f655b]">{t.total}</span>
        <span className="font-serif text-[32px] leading-none tabular-nums">{yuan(total)}</span>
      </div>
      {assist && <p className="mt-3 rounded-2xl bg-[#fbf0dc] px-3 py-2 text-[12.5px] leading-relaxed text-[#8a5a12]">{t.passwordBanner}</p>}
      {pack && <p className="mt-2 text-[12px] text-[#246848]">{t.fileUnlockHint}</p>}
      <fieldset className="mt-4">
        <legend className="mb-2 text-[13px] text-[#6f655b]">{t.contactQ}</legend>
        <div className="grid grid-cols-3 gap-1 rounded-full bg-[#efe7da] p-1">
          {(["wechat", "telegram", "email"] as ContactType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setContactType(type)}
              className={cn("h-9 rounded-full text-[13px]", contactType === type ? "bg-white shadow-sm" : "text-[#6f655b]")}
            >
              {type === "wechat" ? t.wechat : type === "telegram" ? t.telegram : t.email}
            </button>
          ))}
        </div>
        <input
          className={cn(fieldCls, "mt-2")}
          value={contact}
          onChange={(event) => setContact(event.target.value)}
          placeholder={contactType === "wechat" ? t.contactPhWechat : contactType === "telegram" ? t.contactPhTg : t.contactPhEmail}
          autoComplete={contactType === "email" ? "email" : "username"}
          maxLength={40}
        />
      </fieldset>
      <label className="mt-3 block text-[13px] text-[#6f655b]">
        {t.note} · {t.noteOptional}
        <textarea
          className={cn(fieldCls, "mt-2 min-h-20 resize-none")}
          value={note}
          maxLength={180}
          onChange={(event) => setNote(event.target.value)}
          placeholder={assist ? t.notePhAssist : t.notePh}
        />
      </label>
      <fieldset className="mt-3">
        <legend className="mb-2 text-[13px] text-[#6f655b]">{t.payMethod}</legend>
        <div className="space-y-2">
          {(
            [
              ["wechat", t.payWechat, t.payWechatHint],
              ["alipay", t.payAlipay, t.payAlipayHint],
              ["chat", t.payChat, t.payChatHint],
            ] as const
          ).map(([id, label, hint]) => (
            <button
              key={id}
              type="button"
              onClick={() => setPayMethod(id)}
              className={cn(
                "flex w-full items-start gap-3 rounded-2xl border px-3 py-3 text-left",
                payMethod === id ? "border-[#c44832] bg-white" : "border-[#eadfce] bg-white/60",
              )}
            >
              <span className={cn("mt-0.5 h-4 w-4 rounded-full border", payMethod === id ? "border-[#c44832] bg-[#c44832] shadow-[inset_0_0_0_3px_white]" : "border-[#d9cbb8]")} />
              <span>
                <span className="block text-[14px] font-medium">{label}</span>
                <span className="block text-[12px] text-[#8a7d6d]">{hint}</span>
              </span>
            </button>
          ))}
        </div>
      </fieldset>
      <label className="mt-3 flex items-start gap-2 text-[12.5px] leading-relaxed text-[#4e463c]">
        <input type="checkbox" className="mt-1 accent-[#c44832]" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
        <span>{t.agree}</span>
      </label>
      {error && <p className="mt-2 text-[13px] text-[#c44832]">{error}</p>}
      <button type="submit" className={cn(btnRed, "mt-4")} disabled={sending || detailed.length === 0}>
        {t.placeOrder} · {yuan(total)}
      </button>
    </form>
  );
}

function StatusSeal({ status }: { status: OrderStatus }) {
  const { t } = useShop();
  const label = status === "pending" ? t.sealPending : status === "paid" ? t.sealPaid : status === "done" ? t.sealDone : t.sealClosed;
  const color =
    status === "done" ? "border-[#246848] text-[#246848]" : status === "closed" ? "border-[#c8bfb2] text-[#8a7d6d]" : "border-[#c44832] text-[#c44832]";
  return (
    <div className={cn("seal-pop grid h-[68px] w-[68px] place-items-center rounded-full border-2 text-[13px] font-medium", color)}>
      {label}
    </div>
  );
}

function Steps({ status }: { status: OrderStatus }) {
  const { t } = useShop();
  const labels = [t.stepOrder, t.stepDeclare, t.stepCheck, t.stepSend];
  const current = status === "pending" ? 1 : status === "paid" ? 2 : status === "done" ? 4 : 0;
  return (
    <ol className="mt-4 grid grid-cols-4 gap-2">
      {labels.map((label, index) => (
        <li key={label} className="text-center">
          <div className={cn("mb-1 h-1 rounded-full", index < current ? "bg-[#c44832]" : "bg-[#eadfce]")} />
          <span className={cn("text-[10px]", index < current ? "text-[#1a1714]" : "text-[#b3a898]")}>{label}</span>
        </li>
      ))}
    </ol>
  );
}

export function PaySlip() {
  const { t, lang, activeOrder, settings, declarePaid, setChatOpen, setView, toast } = useShop();
  if (!activeOrder) {
    return <p className="text-[14px] text-[#6f655b]">{t.emptyOrders}</p>;
  }
  const order = activeOrder;
  const summary = orderSummary(order, settings, lang);
  const payNote = lang === "zh" ? settings.payNoteZh : settings.payNoteEn;
  const showFile = order.items.some((item) => item.id === "pack") && (order.status === "paid" || order.status === "done");
  const copy = async (text: string) => {
    const ok = await copyText(text);
    toast(ok ? t.copied : t.copyFail);
  };
  return (
    <div>
      <article className="rounded-[24px] border border-[#eadfce] bg-white px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] tracking-[0.16em] text-[#8a7d6d]">{BRAND_SPOKEN}</p>
            <Wordmark className="mt-1 text-[28px]" />
            <p className="mt-1 font-serif text-[44px] leading-none tabular-nums">{yuan(order.total)}</p>
            <p className="mt-2 text-[13px] text-[#6f655b]">
              {statusLabel(order.status, t)} · {order.id}
            </p>
          </div>
          <StatusSeal status={order.status} />
        </div>
        <Steps status={order.status} />
        <div className="my-4 border-t border-dashed border-[#e4d7c4]" />
        <ul className="space-y-1.5 text-[13px]">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-3">
              <span className="min-w-0 truncate">
                {lang === "zh" ? item.titleZh : item.titleEn} × {item.qty}
              </span>
              <span className="shrink-0 tabular-nums">{yuan(item.price * item.qty)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[12px] text-[#8a7d6d]">
          {t.yourContact} · {order.contact}
        </p>
      </article>
      <div className="mt-3 rounded-[22px] bg-[#141210] px-4 py-4 text-white">
        <p className="text-[11px] tracking-wide text-white/55">{order.payMethod === "alipay" ? t.sellerAli : order.payMethod === "chat" ? t.sellerTg : t.sellerWechat}</p>
        <p className="mt-1 break-all font-serif text-[30px] leading-tight">
          {order.payMethod === "alipay" ? settings.alipay : order.payMethod === "chat" ? `@${cleanHandle(settings.telegram)}` : settings.wechat}
        </p>
        <p className="mt-2 text-[12.5px] leading-relaxed text-white/75">{order.payMethod === "chat" ? t.dmPay : payNote}</p>
      </div>
      <p className="mt-3 text-[12.5px] leading-relaxed text-[#8a5a12]">{t.amountMatch}</p>
      <p className="mt-1 text-[12.5px] leading-relaxed text-[#6f655b]">{t.noPassword}</p>
      <p className="mt-1 text-[12.5px] text-[#6f655b]">{t.seatWaitHint}</p>
      <p className="mt-3 text-[11px] text-[#8a7d6d]">{t.summaryLabel}</p>
      <pre className="mt-1 select-all whitespace-pre-wrap rounded-2xl bg-white p-3 font-sans text-[12.5px] leading-relaxed text-[#3d342c]">{summary}</pre>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button type="button" className={btnGhost} onClick={() => copy(order.payMethod === "alipay" ? settings.alipay : order.payMethod === "chat" ? settings.telegram : settings.wechat)}>
          {order.payMethod === "alipay" ? t.alipay : order.payMethod === "chat" ? t.telegram : t.copyWechat}
        </button>
        <button type="button" className={btnGhost} onClick={() => copy(order.id)}>
          {t.copyId}
        </button>
        <button type="button" className={btnGhost} onClick={() => copy(summary)}>
          {t.copySummary}
        </button>
        <button type="button" className={btnGhost} onClick={() => copy(orderLink(encodeOrder(order)))}>
          {t.copyLink}
        </button>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <a className={cn(btnGhost, "h-11 text-[13px]")} href={`https://t.me/${cleanHandle(settings.telegram)}`} target="_blank" rel="noreferrer">
          {t.openTg}
        </a>
        <a className={cn(btnGhost, "h-11 text-[13px]")} href={`https://x.com/${cleanHandle(settings.xHandle)}`} target="_blank" rel="noreferrer">
          {t.openX}
        </a>
      </div>
      {order.status === "pending" ? (
        <button type="button" className={cn(btnRed, "mt-3")} onClick={() => declarePaid(order.id)}>
          {t.declaredBtn}
        </button>
      ) : (
        <p className="mt-3 rounded-full bg-[#f1ece4] py-3 text-center text-[13px] text-[#5e564e]">{order.status === "paid" ? t.declaredDone : statusLabel(order.status, t)}</p>
      )}
      <div className="mt-3 flex items-center justify-between text-[12px] text-[#8a7d6d]">
        <button type="button" className="underline" onClick={() => setChatOpen(true)}>
          {t.askCs}
        </button>
        <button
          type="button"
          className="underline"
          onClick={() => {
            setView("desk");
          }}
        >
          {t.iAmDesk}
        </button>
      </div>
      {order.deliveryNote && (
        <div className="mt-4 rounded-2xl bg-[#e7f4ec] p-3 text-[13px] leading-relaxed text-[#246848]">
          <p className="text-[11px] tracking-wide">{t.wroteNote}</p>
          <p className="mt-1 whitespace-pre-wrap">{order.deliveryNote}</p>
        </div>
      )}
      {showFile && (
        <div className="mt-4">
          <PromptBlock locked={false} />
        </div>
      )}
    </div>
  );
}

export function OrdersView() {
  const { t, lang, orders, openOrder, reorder, setView } = useShop();
  const [lookup, setLookup] = useState("");
  const [miss, setMiss] = useState(false);
  const find = (event: FormEvent) => {
    event.preventDefault();
    const id = lookup.trim().toUpperCase();
    const found = orders.find((order) => order.id.toUpperCase() === id);
    if (!found) {
      setMiss(true);
      return;
    }
    setMiss(false);
    openOrder(found.id);
  };
  return (
    <div className="px-4 pb-28 pt-4 xl:pb-8">
      <button type="button" onClick={() => setView("shop")} className="mb-3 text-[13px] text-[#8a7d6d]">
        ← {t.home}
      </button>
      <h1 className="font-serif text-[32px] leading-none">{t.orders}</h1>
      <form onSubmit={find} className="mt-4 flex gap-2">
        <input className={fieldCls} value={lookup} onChange={(event) => setLookup(event.target.value)} placeholder={t.lookupPh} />
        <button type="submit" className="h-12 shrink-0 rounded-2xl bg-[#141210] px-4 text-[14px] text-white">
          {t.view}
        </button>
      </form>
      {miss && <p className="mt-2 text-[12.5px] leading-relaxed text-[#a33b28]">{t.notFound}</p>}
      {orders.length === 0 ? (
        <div className="mt-8 rounded-[22px] border border-dashed border-[#e0d4c2] px-4 py-8">
          <p className="font-serif text-[26px]">{t.emptyOrders}</p>
        </div>
      ) : (
        <ul className="mt-4 space-y-2">
          {orders.map((order) => (
            <li key={order.id} className="rounded-2xl border border-[#eadfce] bg-white p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-serif text-[22px] leading-none">{order.id}</p>
                  <p className="mt-1 text-[12px] text-[#8a7d6d]">{order.items.map((item) => (lang === "zh" ? item.titleZh : item.titleEn)).join("、")}</p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-[22px] tabular-nums">{yuan(order.total)}</p>
                  <p className="text-[12px] text-[#8a7d6d]">{statusLabel(order.status, t)}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button type="button" className="rounded-full bg-[#141210] px-3 py-1.5 text-[12px] text-white" onClick={() => openOrder(order.id)}>
                  {t.look}
                </button>
                {order.status !== "closed" && (
                  <button type="button" className="rounded-full border border-[#eadfce] px-3 py-1.5 text-[12px]" onClick={() => reorder(order)}>
                    {t.reorder}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function DeskView() {
  const { t, lang, settings, setSettings, orders, agentPreview, setAgentPreview, agentUnlocked, declarePaid, fulfill, closeOrder, openOrder, toast, setView } = useShop();
  const [form, setForm] = useState(settings);
  const [noteId, setNoteId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  useEffect(() => setForm(settings), [settings]);

  const set = (key: keyof typeof form, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const publish = async (kind: "link" | "xianyu" | "x") => {
    setSettings(form);
    const link = sellerLink(form);
    window.history.replaceState({}, "", link);
    const text = kind === "xianyu" ? xianyuPost(form, link) : kind === "x" ? xPost(form, link) : link;
    const ok = await copyText(text);
    toast(ok ? (kind === "link" ? t.saved : t.copied) : t.copyFail);
  };

  return (
    <div className="px-4 pb-28 pt-4 xl:pb-10">
      <button type="button" onClick={() => setView("shop")} className="mb-3 text-[13px] text-[#8a7d6d]">
        ← {t.home}
      </button>
      <p className="text-[11px] tracking-[0.18em] text-[#a08c72]">DESK</p>
      <h1 className="mt-1 font-serif text-[34px] leading-none">{t.desk}</h1>
      <p className="mt-3 text-[13.5px] leading-relaxed text-[#4e463c]">{t.deskLead}</p>
      <section className="mt-4 rounded-[22px] bg-white p-4">
        <h2 className="text-[15px] font-medium">{t.settings}</h2>
        <p className="mt-1 text-[12.5px] leading-relaxed text-[#8a7d6d]">{t.settingsHint}</p>
        <div className="mt-3 grid gap-2">
          <Field label={t.shopName} value={form.shopNameZh} onChange={(value) => set("shopNameZh", value)} maxLength={24} />
          <Field label={t.shopNameEn} value={form.shopNameEn} onChange={(value) => set("shopNameEn", value)} maxLength={32} />
          <Field label={t.wechat} value={form.wechat} onChange={(value) => set("wechat", value)} maxLength={40} />
          <Field label={t.alipay} value={form.alipay} onChange={(value) => set("alipay", value)} maxLength={48} />
          <Field label={t.telegram} value={form.telegram} onChange={(value) => set("telegram", value)} maxLength={40} />
          <Field label={t.xHandle} value={form.xHandle} onChange={(value) => set("xHandle", value)} maxLength={40} />
          <Field label={t.payNote} value={form.payNoteZh} onChange={(value) => set("payNoteZh", value)} maxLength={180} area />
          <Field label={t.payNoteEn} value={form.payNoteEn} onChange={(value) => set("payNoteEn", value)} maxLength={180} area />
        </div>
        <p className="mt-2 text-[12px] text-[#8a7d6d]">{t.renameHint}</p>
        <button type="button" className={cn(btnBlack, "mt-3")} onClick={() => publish("link")}>
          {t.saveLink}
        </button>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button type="button" className={btnGhost} onClick={() => publish("xianyu")}>
            {t.copyXianyu}
          </button>
          <button type="button" className={btnGhost} onClick={() => publish("x")}>
            {t.copyX}
          </button>
        </div>
        <p className="mt-2 text-[12px] leading-relaxed text-[#8a7d6d]">{t.postHint}</p>
        <p className="mt-1 text-[12px] leading-relaxed text-[#8a7d6d]">{t.buildHint}</p>
      </section>
      <section className="mt-4">
        <h2 className="font-serif text-[26px]">{t.faqTitle}</h2>
        <div className="mt-2 divide-y divide-[#eadfce] rounded-[22px] border border-[#eadfce] bg-white px-3">
          {[
            [t.q1, t.a1],
            [t.q2, t.a2],
            [t.q3, t.a3],
            [t.q4, t.a4],
          ].map(([q, a]) => (
            <details key={q} className="py-3">
              <summary className="cursor-pointer list-none text-[14px] font-medium text-[#1a1714] [&::-webkit-details-marker]:hidden">{q}</summary>
              <p className="pt-1.5 text-[13px] leading-relaxed text-[#5c534a]">{a}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="mt-3 rounded-[22px] bg-[#f7f0e2] p-4">
        <label className="flex items-center justify-between gap-3 text-[14px]">
          <span>{t.previewAgent}</span>
          <input type="checkbox" className="h-4 w-4 accent-[#c44832]" checked={agentPreview} onChange={(event) => setAgentPreview(event.target.checked)} />
        </label>
        <p className="mt-1 text-[12px] leading-relaxed text-[#8a6232]">{t.previewHint}</p>
        {agentUnlocked && <p className="mt-2 text-[12px] text-[#246848]">{t.agentUnlockedHint}</p>}
      </section>
      <section className="mt-5">
        <h2 className="font-serif text-[26px]">{t.orderQueue}</h2>
        <p className="mt-1 text-[12.5px] text-[#8a7d6d]">{t.importHint}</p>
        {orders.length === 0 ? (
          <p className="mt-3 text-[13px] text-[#6f655b]">{t.noOrdersYet}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {orders.map((order) => (
              <li key={order.id} className="rounded-2xl border border-[#eadfce] bg-white p-3">
                <div className="flex items-start justify-between gap-2">
                  <button type="button" className="text-left" onClick={() => openOrder(order.id)}>
                    <span className="block font-serif text-[20px]">{order.id}</span>
                    <span className="text-[12px] text-[#8a7d6d]">{order.contact}</span>
                  </button>
                  <span className="text-right">
                    <span className="block font-serif text-[20px] tabular-nums">{yuan(order.total)}</span>
                    <span className="text-[12px] text-[#8a7d6d]">{statusLabel(order.status, t)}</span>
                  </span>
                </div>
                <p className="mt-1 text-[12px] text-[#6f655b]">{order.items.map((item) => (lang === "zh" ? item.titleZh : item.titleEn)).join("、")}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {order.status === "pending" && (
                    <button type="button" className="rounded-full bg-[#f1ece4] px-3 py-1.5 text-[12px]" onClick={() => declarePaid(order.id)}>
                      {t.markPaid}
                    </button>
                  )}
                  {order.status !== "done" && order.status !== "closed" && (
                    <button
                      type="button"
                      className="rounded-full bg-[#141210] px-3 py-1.5 text-[12px] text-white"
                      onClick={() => {
                        setNoteId(order.id);
                        setNote(deliveryTemplate(order, lang));
                      }}
                    >
                      {t.fulfill}
                    </button>
                  )}
                  {order.status !== "closed" && (
                    <button type="button" className="rounded-full border border-[#eadfce] px-3 py-1.5 text-[12px]" onClick={() => closeOrder(order.id)}>
                      {t.closeOrder}
                    </button>
                  )}
                </div>
                {noteId === order.id && (
                  <div className="mt-2">
                    <textarea className={cn(fieldCls, "min-h-24")} value={note} onChange={(event) => setNote(event.target.value)} placeholder={t.deliveryPh} />
                    <button
                      type="button"
                      className={cn(btnRed, "mt-2")}
                      onClick={() => {
                        fulfill(order.id, note);
                        setNoteId(null);
                      }}
                    >
                      {t.fulfill}
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  maxLength,
  area,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  area?: boolean;
}) {
  return (
    <label className="block text-[12px] text-[#8a7d6d]">
      {label}
      {area ? (
        <textarea className={cn(fieldCls, "mt-1 min-h-20")} value={value} maxLength={maxLength} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input className={cn(fieldCls, "mt-1")} value={value} maxLength={maxLength} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

export function ChatDrawer() {
  const { t, chatOpen, setChatOpen, messages, sendChat, clearChat, activeOrder, openOrder } = useShop();
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, chatOpen]);
  if (!chatOpen) return null;
  const submit = () => {
    sendChat(text);
    setText("");
  };
  const chips = [t.quick1, t.quick2, t.quick3, t.quick4, t.quick5];
  return (
    <div className="fixed inset-0 z-[55]">
      <button type="button" className="fade-in absolute inset-0 bg-[#1a1714]/40" aria-label={t.closeAria} onClick={() => setChatOpen(false)} />
      <div className="sheet-in absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-[28px] bg-[#f7f3ea] shadow-2xl xl:inset-y-4 xl:left-auto xl:right-4 xl:w-[400px] xl:max-h-none xl:rounded-[28px]">
        <div className="flex items-center justify-between border-b border-[#eadfce] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="relative grid h-9 w-9 place-items-center rounded-full bg-[#141210] text-white">
              <IconHeadset className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#3dce86] ring-2 ring-[#f7f3ea]" />
            </span>
            <div>
              <p className="text-[15px] font-medium">{t.cs}</p>
              <p className="text-[11px] text-[#8a7d6d]">{t.hours}</p>
            </div>
          </div>
          <button type="button" onClick={() => setChatOpen(false)} aria-label={t.closeAria} className="grid h-9 w-9 place-items-center rounded-full bg-white">
            <IconClose />
          </button>
        </div>
        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 py-3">
          <Bubble from="desk">{t.chatHi}</Bubble>
          {activeOrder && (
            <button type="button" onClick={() => openOrder(activeOrder.id)} className="rounded-full bg-white px-3 py-1.5 text-[12px] text-[#6e4c22]">
              {t.currentOrder} {activeOrder.id}
            </button>
          )}
          {messages.map((message) => (
            <Bubble key={message.id} from={message.from}>
              {message.text}
            </Bubble>
          ))}
          <div ref={endRef} />
        </div>
        <div className="border-t border-[#eadfce] px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="mb-2 flex gap-1.5 overflow-x-auto noscroll">
            {chips.map((chip) => (
              <button key={chip} type="button" onClick={() => sendChat(chip)} className="shrink-0 rounded-full bg-white px-3 py-1.5 text-[12px] text-[#4e463c]">
                {chip}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className={fieldCls}
              value={text}
              placeholder={t.chatPh}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  submit();
                }
              }}
            />
            <button type="button" onClick={submit} className="h-12 shrink-0 rounded-2xl bg-[#141210] px-4 text-[14px] text-white">
              {t.send}
            </button>
          </div>
          <button type="button" onClick={clearChat} className="mt-2 text-[11px] text-[#b3a898]">
            {t.clearChat}
          </button>
        </div>
      </div>
    </div>
  );
}

function Bubble({ from, children }: { from: "desk" | "me"; children: ReactNode }) {
  return (
    <div className={cn("max-w-[85%] rounded-2xl px-3 py-2 text-[13.5px] leading-relaxed", from === "me" ? "ml-auto rounded-br-md bg-[#141210] text-white" : "rounded-bl-md bg-white text-[#1a1714]")}>
      {children}
    </div>
  );
}

export function PanelBody() {
  const { sheet, selectedId } = useShop();
  if (sheet === "detail" && selectedId) return <ProductDetail />;
  if (sheet === "checkout") return <CheckoutForm />;
  if (sheet === "pay") return <PaySlip />;
  return <CartPanel />;
}

export function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

export { filters };
