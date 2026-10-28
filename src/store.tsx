import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  chatReply,
  copy,
  decodeOrder,
  defaultSettings,
  encodeOrder,
  getProduct,
  makeOrderId,
  onDutyNow,
  orderLink,
  readUrlSettings,
  type ContactType,
  type Copy,
  type FilterId,
  type Lang,
  type Line,
  type Order,
  type PayMethod,
  type Product,
  type Settings,
} from "./data";

const STORAGE_KEY = "kaizhixuan-rkai-v1";

export type SheetName = null | "detail" | "cart" | "checkout" | "pay";
export type ViewName = "shop" | "orders" | "desk";
export type Message = { id: string; from: "desk" | "me"; text: string; at: number };

type Persisted = {
  cart?: Line[];
  orders?: Order[];
  lang?: Lang;
  messages?: Message[];
  settings?: Partial<Settings>;
  agentUnlocked?: boolean;
  agentPreview?: boolean;
};

function loadPersisted(): Persisted {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const data = JSON.parse(raw) as Persisted;
    return data && typeof data === "object" ? data : {};
  } catch {
    return {};
  }
}

function cleanSettings(partial: Partial<Settings> | undefined): Partial<Settings> {
  if (!partial) return {};
  const out: Partial<Settings> = {};
  (Object.keys(defaultSettings) as (keyof Settings)[]).forEach((key) => {
    const value = partial[key];
    if (typeof value === "string" && value.trim()) out[key] = value.trim();
  });
  return out;
}

function cleanOrders(value: unknown): Order[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is Order => {
    if (!item || typeof item !== "object") return false;
    const order = item as Order;
    return typeof order.id === "string" && Array.isArray(order.items) && typeof order.total === "number";
  });
}

function cleanLines(value: unknown): Line[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is Line => {
    if (!item || typeof item !== "object") return false;
    const line = item as Line;
    return typeof line.id === "string" && typeof line.qty === "number" && line.qty > 0;
  });
}

type ShopApi = {
  lang: Lang;
  toggleLang: () => void;
  t: Copy;
  settings: Settings;
  setSettings: (next: Settings) => void;
  query: string;
  setQuery: (q: string) => void;
  filter: FilterId;
  setFilter: (f: FilterId) => void;
  cart: Line[];
  addToCart: (id: string, qty?: number) => void;
  setCartQty: (id: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  agentUnlocked: boolean;
  agentPreview: boolean;
  setAgentPreview: (v: boolean) => void;
  unitPrice: (p: Product) => number;
  orders: Order[];
  activeOrder: Order | null;
  openOrder: (id: string) => void;
  createOrder: (input: {
    contact: string;
    contactType: ContactType;
    payMethod: PayMethod;
    note: string;
    lines?: Array<Line & { price?: number; titleZh?: string; titleEn?: string }>;
  }) => Order | null;
  declarePaid: (id: string) => void;
  fulfill: (id: string, note: string) => void;
  closeOrder: (id: string) => void;
  reorder: (order: Order) => void;
  draft: Line[] | null;
  beginCheckout: (source: "cart" | "now", lines: Line[]) => void;
  sheet: SheetName;
  setSheet: (s: SheetName) => void;
  selectedId: string | null;
  openDetail: (id: string) => void;
  chatOpen: boolean;
  setChatOpen: (v: boolean) => void;
  messages: Message[];
  sendChat: (text: string) => void;
  clearChat: () => void;
  view: ViewName;
  setView: (v: ViewName) => void;
  toast: (msg: string) => void;
  toastText: string | null;
  bumpKey: number;
  onDuty: boolean;
  rememberOrderUrl: (order: Order) => void;
};

const ShopContext = createContext<ShopApi | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const saved = useRef(loadPersisted());
  const [lang, setLang] = useState<Lang>(saved.current.lang === "en" ? "en" : "zh");
  const [settings, setSettingsState] = useState<Settings>(() => ({
    ...defaultSettings,
    ...cleanSettings(saved.current.settings),
    ...readUrlSettings(),
  }));
  const [cart, setCart] = useState<Line[]>(() => cleanLines(saved.current.cart));
  const [orders, setOrders] = useState<Order[]>(() => cleanOrders(saved.current.orders));
  const [messages, setMessages] = useState<Message[]>(() =>
    Array.isArray(saved.current.messages) ? saved.current.messages.slice(-40) : [],
  );
  const [agentUnlocked, setAgentUnlocked] = useState(Boolean(saved.current.agentUnlocked));
  const [agentPreview, setAgentPreview] = useState(Boolean(saved.current.agentPreview));
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");
  const [sheet, setSheet] = useState<SheetName>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Line[] | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [view, setViewState] = useState<ViewName>("shop");
  const [toastText, setToastText] = useState<string | null>(null);
  const [bumpKey, setBumpKey] = useState(0);
  const [onDuty, setOnDuty] = useState(() => onDutyNow());
  const toastTimer = useRef<number | null>(null);
  const imported = useRef(false);

  const t = copy[lang];

  const toast = (msg: string) => {
    setToastText(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastText(null), 2400);
  };

  useEffect(() => {
    const payload = {
      cart,
      orders,
      lang,
      messages,
      settings,
      agentUnlocked,
      agentPreview,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [cart, orders, lang, messages, settings, agentUnlocked, agentPreview]);

  useEffect(() => {
    document.title = lang === "zh" ? `${settings.shopNameZh} · 直接下单` : `${settings.shopNameEn} · Order`;
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang, settings.shopNameZh, settings.shopNameEn]);

  useEffect(() => {
    const id = window.setInterval(() => setOnDuty(onDutyNow()), 30000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (imported.current) return;
    imported.current = true;
    const raw = new URLSearchParams(window.location.search).get("order");
    if (!raw) return;
    const order = decodeOrder(raw);
    if (!order) {
      toast(copy[lang].badLink);
      return;
    }
    setOrders((prev) => (prev.some((item) => item.id === order.id) ? prev : [order, ...prev]));
    setActiveOrderId(order.id);
    setSheet("pay");
    setViewState("shop");
    toast(copy[lang].imported);
  }, [lang]);

  const unitPrice = (p: Product) => (agentUnlocked && p.agentPrice ? p.agentPrice : p.price);
  const cartCount = cart.reduce((sum, line) => sum + line.qty, 0);
  const activeOrder = orders.find((order) => order.id === activeOrderId) ?? null;

  const setView = (next: ViewName) => {
    setViewState(next);
    setSheet(null);
  };

  const addToCart = (id: string, qty = 1) => {
    const product = getProduct(id);
    if (!product || product.stock === "out") {
      toast(t.soldOut);
      return;
    }
    const found = cart.find((line) => line.id === id);
    const nextQty = Math.min(product.maxQty, (found?.qty ?? 0) + qty);
    if (found && nextQty === found.qty) {
      toast(t.maxReached);
      return;
    }
    setCart((prev) => {
      const current = prev.find((line) => line.id === id);
      const qtyNext = Math.min(product.maxQty, (current?.qty ?? 0) + qty);
      if (current) return prev.map((line) => (line.id === id ? { ...line, qty: qtyNext } : line));
      return [...prev, { id, qty: qtyNext }];
    });
    setBumpKey((n) => n + 1);
    toast(t.added);
  };

  const setCartQty = (id: string, qty: number) => {
    const product = getProduct(id);
    if (!product) return;
    if (qty <= 0) {
      setCart((prev) => prev.filter((line) => line.id !== id));
      return;
    }
    setCart((prev) =>
      prev.map((line) => (line.id === id ? { ...line, qty: Math.min(product.maxQty, qty) } : line)),
    );
  };

  const beginCheckout = (_source: "cart" | "now", lines: Line[]) => {
    const usable = lines.filter((line) => getProduct(line.id)?.stock !== "out");
    if (!usable.length) {
      toast(t.emptyCart);
      return;
    }
    setDraft(usable);
    setSheet("checkout");
    setViewState("shop");
  };

  const createOrder = (input: {
    contact: string;
    contactType: ContactType;
    payMethod: PayMethod;
    note: string;
    lines?: Array<Line & { price?: number; titleZh?: string; titleEn?: string }>;
  }) => {
    const source: Array<Line & { price?: number; titleZh?: string; titleEn?: string }> = input.lines ?? draft ?? cart;
    const lines = source.filter((line) => {
      if (line.price != null && line.titleZh) return true;
      const product = getProduct(line.id);
      return Boolean(product && product.stock !== "out");
    });
    if (!lines.length) {
      toast(t.emptyCart);
      return null;
    }
    const items = lines.map((line) => {
      const product = getProduct(line.id);
      return {
        id: line.id,
        qty: line.qty,
        price: line.price ?? (product ? unitPrice(product) : 0),
        titleZh: line.titleZh ?? product?.title.zh ?? line.id,
        titleEn: line.titleEn ?? product?.title.en ?? line.id,
      };
    });
    const order: Order = {
      id: makeOrderId(orders.map((item) => item.id)),
      createdAt: Date.now(),
      items,
      total: items.reduce((sum, item) => sum + item.price * item.qty, 0),
      contact: input.contact.trim(),
      contactType: input.contactType,
      payMethod: input.payMethod,
      note: input.note.trim(),
      status: "pending",
    };
    setOrders((prev) => [order, ...prev]);
    setActiveOrderId(order.id);
    setDraft(null);
    setCart((prev) => {
      const ids = new Set(lines.map((line) => line.id));
      if (draft) return prev.filter((line) => !ids.has(line.id));
      return [];
    });
    setSheet("pay");
    const url = orderLink(encodeOrder(order));
    window.history.replaceState({}, "", url);
    toast(t.ordered);
    return order;
  };

  const rememberOrderUrl = (order: Order) => {
    window.history.replaceState({}, "", orderLink(encodeOrder(order)));
  };

  const declarePaid = (id: string) => {
    setOrders((prev) => prev.map((order) => (order.id === id && order.status === "pending" ? { ...order, status: "paid" } : order)));
    toast(t.declared);
  };

  const fulfill = (id: string, note: string) => {
    const target = orders.find((order) => order.id === id);
    if (target?.items.some((item) => item.id === "agent")) setAgentUnlocked(true);
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status: "done", deliveryNote: note.trim() } : order)),
    );
    toast(t.fulfilledToast);
  };

  const closeOrder = (id: string) => {
    setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status: "closed" } : order)));
    toast(t.closedToast);
  };

  const reorder = (order: Order) => {
    order.items.forEach((item) => addToCart(item.id, item.qty));
    setView("shop");
    setSheet("cart");
  };

  const openDetail = (id: string) => {
    setSelectedId(id);
    setSheet("detail");
    setViewState("shop");
  };

  const openOrder = (id: string) => {
    setActiveOrderId(id);
    setSheet("pay");
    setViewState("shop");
    const order = orders.find((item) => item.id === id);
    if (order) rememberOrderUrl(order);
  };

  const sendChat = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const now = Date.now();
    const mine: Message = { id: `m-${now}`, from: "me", text: trimmed, at: now };
    const reply: Message = {
      id: `d-${now}`,
      from: "desk",
      text: chatReply(trimmed, lang, settings.wechat),
      at: now + 1,
    };
    setMessages((prev) => [...prev, mine, reply].slice(-40));
  };

  const api = useMemo<ShopApi>(
    () => ({
      lang,
      toggleLang: () => setLang((prev) => (prev === "zh" ? "en" : "zh")),
      t,
      settings,
      setSettings: setSettingsState,
      query,
      setQuery,
      filter,
      setFilter,
      cart,
      addToCart,
      setCartQty,
      clearCart: () => setCart([]),
      cartCount,
      agentUnlocked,
      agentPreview,
      setAgentPreview,
      unitPrice,
      orders,
      activeOrder,
      openOrder,
      createOrder,
      declarePaid,
      fulfill,
      closeOrder,
      reorder,
      draft,
      beginCheckout,
      sheet,
      setSheet,
      selectedId,
      openDetail,
      chatOpen,
      setChatOpen,
      messages,
      sendChat,
      clearChat: () => setMessages([]),
      view,
      setView,
      toast,
      toastText,
      bumpKey,
      onDuty,
      rememberOrderUrl,
    }),
    [
      lang,
      t,
      settings,
      query,
      filter,
      cart,
      cartCount,
      agentUnlocked,
      agentPreview,
      orders,
      activeOrder,
      draft,
      sheet,
      selectedId,
      chatOpen,
      messages,
      view,
      toastText,
      bumpKey,
      onDuty,
    ],
  );

  return <ShopContext.Provider value={api}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop outside provider");
  return ctx;
}
