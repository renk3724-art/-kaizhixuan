import { useEffect, useMemo, useState } from "react";
import { BRAND_MARK, BRAND_SPOKEN, isLiveContact, products, sellerLink, yuan } from "./data";
import { createSourceArchiveUrl, sourceArchiveName } from "./downloadSource";
import { ShopProvider, useShop } from "./store";

type ShelfItem = {
  id: string;
  title: string;
  price: number;
  category: string;
  note: string;
  listed: boolean;
  custom: boolean;
};

type DeskTab = "home" | "goods" | "orders" | "settings";
const SHELF_KEY = "kaizhixuan-shelf-v1";

const categoryLabel: Record<string, string> = {
  seat: "席位",
  assist: "代充",
  agent: "代理",
  pack: "文件",
  service: "服务",
  custom: "自建",
};

function seedShelf(): ShelfItem[] {
  return products.map((item, index) => ({
    id: item.id,
    title: item.title.zh,
    price: item.price,
    category: item.category,
    note: item.summary.zh,
    listed: index < 4 && item.stock !== "out",
    custom: false,
  }));
}

function loadShelf(): ShelfItem[] {
  try {
    const raw = localStorage.getItem(SHELF_KEY);
    if (!raw) return seedShelf();
    const parsed = JSON.parse(raw) as ShelfItem[];
    if (!Array.isArray(parsed) || parsed.length === 0) return seedShelf();
    return parsed;
  } catch {
    return seedShelf();
  }
}

function AppShell() {
  const shop = useShop();
  const [mode, setMode] = useState<"desk" | "shop">("desk");
  const [tab, setTab] = useState<DeskTab>("home");
  const [shelf, setShelf] = useState<ShelfItem[]>(loadShelf);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<"mix" | "price">("mix");
  const [buying, setBuying] = useState<ShelfItem | null>(null);
  const [buyerWx, setBuyerWx] = useState("");
  const [draft, setDraft] = useState({ title: "", price: "", category: "custom", note: "" });
  const [wx, setWx] = useState(isLiveContact(shop.settings.wechat) ? shop.settings.wechat : "");
  const [ali, setAli] = useState(isLiveContact(shop.settings.alipay) ? shop.settings.alipay : "");
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [preparingSource, setPreparingSource] = useState(false);

  useEffect(() => () => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
  }, [sourceUrl]);

  async function downloadSource() {
    if (preparingSource) return;
    setPreparingSource(true);
    try {
      const url = sourceUrl ?? await createSourceArchiveUrl();
      setSourceUrl(url);
      const link = document.createElement('a');
      link.href = url;
      link.download = sourceArchiveName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      shop.toast('压缩包已生成；未弹出下载时点下方备用链接');
    } catch (error) {
      shop.toast(error instanceof Error ? error.message : '生成压缩包失败，请稍后重试');
    } finally {
      setPreparingSource(false);
    }
  }

  useEffect(() => {
    localStorage.setItem(SHELF_KEY, JSON.stringify(shelf));
  }, [shelf]);

  const listed = shelf.filter((item) => item.listed);
  const pending = shop.orders.filter((order) => order.status === "pending" || order.status === "paid").length;
  const shopItems = useMemo(() => {
    const found = listed.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      return !query.trim() || `${item.title} ${item.note}`.toLowerCase().includes(query.trim().toLowerCase());
    });
    if (sort === "price") found.sort((a, b) => a.price - b.price);
    return found;
  }, [listed, category, query, sort]);

  function toggle(id: string) {
    setShelf((prev) => prev.map((item) => (item.id === id ? { ...item, listed: !item.listed } : item)));
  }

  function addProduct(event: React.FormEvent) {
    event.preventDefault();
    const title = draft.title.trim();
    const price = Number(draft.price);
    if (title.length < 2 || !Number.isFinite(price) || price <= 0) {
      shop.toast("请填写商品名和大于 0 的价格");
      return;
    }
    setShelf((prev) => [
      {
        id: `custom-${Date.now().toString(36)}`,
        title,
        price: Math.round(price * 100) / 100,
        category: draft.category,
        note: draft.note.trim() || "个人上架，核对后发货。不要在备注里留密码。",
        listed: true,
        custom: true,
      },
      ...prev,
    ]);
    setDraft({ title: "", price: "", category: "custom", note: "" });
    shop.toast("已上架");
  }

  function placeOrder(event: React.FormEvent) {
    event.preventDefault();
    if (!buying) return;
    if (!isLiveContact(shop.settings.wechat)) {
      shop.toast("请先在设置里填写收款微信");
      setMode("desk");
      setTab("settings");
      setBuying(null);
      return;
    }
    if (buyerWx.trim().length < 3) {
      shop.toast("留下买家微信，方便发货");
      return;
    }
    const order = shop.createOrder({
      contact: buyerWx.trim(),
      contactType: "wechat",
      payMethod: "wechat",
      note: "",
      lines: [{ id: buying.id, qty: 1, price: buying.price, titleZh: buying.title, titleEn: buying.title }],
    });
    if (order) {
      setBuying(null);
      setBuyerWx("");
      setMode("desk");
      setTab("orders");
    }
  }

  function saveSettings(event: React.FormEvent) {
    event.preventDefault();
    if (wx.trim().length < 3) {
      shop.toast("微信号至少 3 位");
      return;
    }
    const next = { ...shop.settings, wechat: wx.trim(), alipay: ali.trim() || wx.trim(), shopNameZh: BRAND_SPOKEN, shopNameEn: BRAND_MARK };
    shop.setSettings(next);
    const link = sellerLink(next);
    window.history.replaceState({}, "", link);
    navigator.clipboard?.writeText(link).catch(() => undefined);
    shop.toast("店铺链接已复制");
  }

  if (mode === "shop") {
    return (
      <ShopFront
        items={shopItems}
        query={query}
        setQuery={setQuery}
        category={category}
        setCategory={setCategory}
        sort={sort}
        setSort={setSort}
        wechat={shop.settings.wechat}
        onBack={() => setMode("desk")}
        onBuy={setBuying}
        buying={buying}
        buyerWx={buyerWx}
        setBuyerWx={setBuyerWx}
        onSubmit={placeOrder}
        onClose={() => setBuying(null)}
      />
    );
  }

  const nav: { id: DeskTab; label: string }[] = [
    { id: "home", label: "工作台" },
    { id: "goods", label: "商品" },
    { id: "orders", label: "订单" },
    { id: "settings", label: "设置" },
  ];

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-[#1f2329]">
      <div className="flex min-h-screen">
        <aside className="hidden w-52 shrink-0 border-r border-[#eceff3] bg-white p-4 md:block">
          <div className="text-[22px] font-semibold text-[#ff5a1f]">凯知选</div>
          <div className="mt-1 text-[12px] text-[#98a0a8]">商家工作台</div>
          <nav className="mt-6 grid gap-1">
            {nav.map((item) => (
              <button key={item.id} type="button" onClick={() => setTab(item.id)} className={`rounded-lg px-3 py-2 text-left text-[14px] ${tab === item.id ? "bg-[#fff1ea] font-medium text-[#ff5a1f]" : "text-[#4e5660]"}`}>
                {item.label}
              </button>
            ))}
          </nav>
          <button type="button" onClick={() => setMode("shop")} className="mt-6 h-10 w-full rounded-lg bg-[#ff5a1f] text-[14px] text-white">
            查看店铺
          </button>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-[#eceff3] bg-white px-4 py-3 md:px-6">
            <div>
              <div className="text-[16px] font-semibold">{nav.find((item) => item.id === tab)?.label}</div>
              <div className="text-[12px] text-[#98a0a8]">RˉkAI · 只保留上架、订单和收款</div>
            </div>
            <button type="button" onClick={() => setMode("shop")} className="h-9 rounded-full bg-[#ff5a1f] px-4 text-[13px] text-white md:hidden">
              看店铺
            </button>
          </header>
          <div className="flex gap-2 overflow-x-auto border-b border-[#eceff3] bg-white px-3 py-2 md:hidden">
            {nav.map((item) => (
              <button key={item.id} type="button" onClick={() => setTab(item.id)} className={`shrink-0 rounded-full px-3 py-1 text-[13px] ${tab === item.id ? "bg-[#fff1ea] text-[#ff5a1f]" : "bg-[#f4f5f7] text-[#66707c]"}`}>
                {item.label}
              </button>
            ))}
          </div>

          <div className="p-4 md:p-6">
            {tab === "home" && (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <Stat label="在售商品" value={String(listed.length)} />
                  <Stat label="待处理订单" value={String(pending)} />
                  <Stat label="收款微信" value={isLiveContact(shop.settings.wechat) ? "已填写" : "未填写"} />
                </div>
                <div className="rounded-xl bg-white p-4">
                  <div className="text-[15px] font-medium">今天可以做的事</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={() => setTab("goods")} className="h-9 rounded-lg bg-[#fff1ea] px-3 text-[13px] text-[#ff5a1f]">选择上架商品</button>
                    <button type="button" onClick={() => setTab("settings")} className="h-9 rounded-lg bg-[#f5f6f8] px-3 text-[13px]">填写微信</button>
                    <button type="button" onClick={() => setMode("shop")} className="h-9 rounded-lg bg-[#f5f6f8] px-3 text-[13px]">预览买家看到的页面</button>
                    <button type="button" onClick={() => void downloadSource()} disabled={preparingSource} className="inline-flex h-9 items-center rounded-lg bg-[#1f2329] px-3 text-[13px] text-white disabled:opacity-50">
                      {preparingSource ? '正在生成压缩包...' : '下载源码压缩包'}
                    </button>
                    <a href={window.location.href} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center rounded-lg border border-[#e6e8ec] px-3 text-[13px] text-[#4e5660]">
                      在新标签页打开预览
                    </a>
                  </div>
                  {sourceUrl && (
                    <a href={sourceUrl} download={sourceArchiveName} className="mt-3 inline-block text-[13px] text-[#ff5a1f] underline">
                      备用：点这里手动保存 {sourceArchiveName}
                    </a>
                  )}
                  <p className="mt-3 text-[13px] leading-6 text-[#66707c]">点击后会在浏览器中生成源码 ZIP，不再依赖临时文件。若预览内下载被拦截，请先将预览在新标签页打开，再点下载。</p>
                  <p className="mt-3 text-[13px] leading-6 text-[#66707c]">功能比完整后台少：这里只做选品上架、看订单、填收款方式。没有自动发卡，也没有官方扣款。</p>
                </div>
              </div>
            )}

            {tab === "goods" && (
              <div className="space-y-4">
                <form onSubmit={addProduct} className="grid gap-2 rounded-xl bg-white p-4 md:grid-cols-[1.4fr_120px_120px_auto]">
                  <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="商品名称" className="h-10 rounded-md border border-[#e6e8ec] px-3 text-[14px] outline-none" />
                  <input value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} placeholder="价格" inputMode="decimal" className="h-10 rounded-md border border-[#e6e8ec] px-3 text-[14px] outline-none" />
                  <select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} className="h-10 rounded-md border border-[#e6e8ec] px-2 text-[14px]">
                    <option value="custom">自建</option>
                    <option value="seat">席位</option>
                    <option value="assist">代充</option>
                    <option value="pack">文件</option>
                  </select>
                  <button type="submit" className="h-10 rounded-md bg-[#ff5a1f] px-4 text-[14px] text-white">上架</button>
                  <input value={draft.note} onChange={(event) => setDraft({ ...draft, note: event.target.value })} placeholder="一句说明，不要写卡密或密码" className="h-10 rounded-md border border-[#e6e8ec] px-3 text-[14px] outline-none md:col-span-4" />
                </form>
                <div className="overflow-hidden rounded-xl bg-white">
                  {shelf.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 border-b border-[#f2f3f5] px-4 py-3 last:border-0">
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[14px] font-medium">{item.title}</div>
                        <div className="mt-1 text-[12px] text-[#98a0a8]">{categoryLabel[item.category] ?? "其他"} · {yuan(item.price)}{item.custom ? " · 自建" : ""}</div>
                      </div>
                      <button type="button" onClick={() => toggle(item.id)} className={`h-8 rounded-full px-3 text-[12px] ${item.listed ? "bg-[#e8f8ef] text-[#168a45]" : "bg-[#f4f5f7] text-[#66707c]"}`}>
                        {item.listed ? "已上架" : "上架"}
                      </button>
                      {item.custom && (
                        <button type="button" onClick={() => setShelf((prev) => prev.filter((row) => row.id !== item.id))} className="text-[12px] text-[#98a0a8]">删除</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "orders" && (
              <div className="space-y-3">
                {shop.orders.length === 0 && <div className="rounded-xl bg-white p-8 text-center text-[14px] text-[#98a0a8]">还没有订单。买家在店铺里提交后，会出现在这里。</div>}
                {shop.orders.map((order) => (
                  <article key={order.id} className="rounded-xl bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium">{order.id}</div>
                        <div className="mt-1 text-[13px] text-[#66707c]">{order.items.map((item) => item.titleZh).join("、")}</div>
                        <div className="mt-1 text-[13px]">买家微信 {order.contact}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[18px] font-semibold text-[#ff5a1f]">{yuan(order.total)}</div>
                        <div className="text-[12px] text-[#98a0a8]">{order.status === "pending" ? "待付款" : order.status === "paid" ? "待核对" : order.status === "done" ? "已发货" : "已关闭"}</div>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      {order.status === "pending" && <button type="button" onClick={() => shop.declarePaid(order.id)} className="h-8 rounded-md bg-[#f5f6f8] px-3 text-[12px]">标为已付款</button>}
                      {order.status !== "done" && order.status !== "closed" && <button type="button" onClick={() => shop.fulfill(order.id, "已核对，请用你留下的微信收货。不要发送验证码。")} className="h-8 rounded-md bg-[#ff5a1f] px-3 text-[12px] text-white">标为已发货</button>}
                    </div>
                  </article>
                ))}
              </div>
            )}

            {tab === "settings" && (
              <form onSubmit={saveSettings} className="max-w-lg space-y-3 rounded-xl bg-white p-4">
                <label className="block text-[13px] text-[#66707c]">
                  收款微信
                  <input value={wx} onChange={(event) => setWx(event.target.value)} className="mt-1 h-11 w-full rounded-md border border-[#e6e8ec] px-3 text-[#1f2329] outline-none" />
                </label>
                <label className="block text-[13px] text-[#66707c]">
                  支付宝，可空
                  <input value={ali} onChange={(event) => setAli(event.target.value)} className="mt-1 h-11 w-full rounded-md border border-[#e6e8ec] px-3 text-[#1f2329] outline-none" />
                </label>
                <button type="submit" className="h-11 rounded-md bg-[#ff5a1f] px-5 text-white">保存并复制店铺链接</button>
                <p className="text-[12px] leading-6 text-[#98a0a8]">链接只在这台浏览器里记住商品和订单。发给别人前，先填好微信。</p>
              </form>
            )}
          </div>
        </div>
      </div>
      {shop.toastText && <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#1f2329] px-4 py-2 text-[13px] text-white">{shop.toastText}</div>}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white p-4">
      <div className="text-[12px] text-[#98a0a8]">{label}</div>
      <div className="mt-2 text-[26px] font-semibold">{value}</div>
    </div>
  );
}

function ShopFront({
  items,
  query,
  setQuery,
  category,
  setCategory,
  sort,
  setSort,
  wechat,
  onBack,
  onBuy,
  buying,
  buyerWx,
  setBuyerWx,
  onSubmit,
  onClose,
}: {
  items: ShelfItem[];
  query: string;
  setQuery: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  sort: "mix" | "price";
  setSort: (value: "mix" | "price") => void;
  wechat: string;
  onBack: () => void;
  onBuy: (item: ShelfItem) => void;
  buying: ShelfItem | null;
  buyerWx: string;
  setBuyerWx: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  onClose: () => void;
}) {
  const cats = [
    { id: "all", label: "全部宝贝" },
    { id: "seat", label: "席位" },
    { id: "assist", label: "代充" },
    { id: "pack", label: "文件" },
    { id: "custom", label: "自建" },
  ];
  return (
    <div className="min-h-screen bg-[#f4f5f7] text-[#1f2329]">
      <header className="bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4">
          <button type="button" onClick={onBack} className="text-[13px] text-[#8b919a]">工作台</button>
          <div>
            <div className="text-[30px] leading-none font-semibold text-[#ff5a1f]">凯知选</div>
            <div className="mt-1 text-[12px] text-[#98a0a8]">RˉkAI · 先知后选</div>
          </div>
          <form className="ml-auto flex w-full max-w-sm" onSubmit={(event) => event.preventDefault()}>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索宝贝" className="h-10 min-w-0 flex-1 rounded-l-md border border-[#ffd0bf] px-3 text-[14px] outline-none" />
            <button className="h-10 rounded-r-md bg-[#ff8a5b] px-4 text-[14px] text-white">搜索</button>
          </form>
        </div>
      </header>
      <main className="mx-auto grid max-w-6xl gap-4 px-4 py-4 md:grid-cols-[180px_1fr]">
        <aside className="h-fit rounded-xl bg-white p-3">
          {cats.map((item) => (
            <button key={item.id} type="button" onClick={() => setCategory(item.id)} className={`block w-full rounded-md px-3 py-2 text-left text-[14px] ${category === item.id ? "bg-[#fff1ea] text-[#ff5a1f]" : ""}`}>
              {item.label}
            </button>
          ))}
        </aside>
        <section className="rounded-xl bg-white p-4">
          <div className="mb-3 flex items-center justify-between text-[13px] text-[#66707c]">
            <div className="flex gap-2">
              <button type="button" onClick={() => setSort("mix")} className={sort === "mix" ? "text-[#ff5a1f]" : ""}>综合</button>
              <button type="button" onClick={() => setSort("price")} className={sort === "price" ? "text-[#ff5a1f]" : ""}>价格</button>
            </div>
            <span>微信 {isLiveContact(wechat) ? wechat : "待设置"}</span>
          </div>
          {items.length === 0 ? (
            <p className="py-16 text-center text-[14px] text-[#98a0a8]">还没有上架商品。回到工作台打开要卖的货。</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {items.map((item) => (
                <button key={item.id} type="button" onClick={() => onBuy(item)} className="text-left">
                  <div className="flex h-36 items-end rounded-lg bg-[#1f2329] p-3 text-[18px] font-semibold text-white">{item.title.slice(0, 10)}</div>
                  <div className="mt-2 line-clamp-2 h-10 text-[13px]">{item.title}</div>
                  <div className="mt-1 text-[18px] font-semibold text-[#ff5a1f]">{yuan(item.price)}</div>
                </button>
              ))}
            </div>
          )}
        </section>
      </main>
      {buying && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/35 sm:items-center" onMouseDown={onClose}>
          <form onSubmit={onSubmit} onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-md rounded-t-2xl bg-white p-5 sm:rounded-2xl">
            <div className="text-[18px] font-semibold">{buying.title}</div>
            <p className="mt-2 text-[13px] leading-6 text-[#66707c]">{buying.note}</p>
            <div className="mt-3 text-[24px] font-semibold text-[#ff5a1f]">{yuan(buying.price)}</div>
            <input value={buyerWx} onChange={(event) => setBuyerWx(event.target.value)} placeholder="你的微信号" className="mt-3 h-11 w-full rounded-md border border-[#e6e8ec] px-3 outline-none" />
            <button type="submit" className="mt-3 h-11 w-full rounded-md bg-[#ff5a1f] text-white">提交订单</button>
            <p className="mt-2 text-[12px] text-[#98a0a8]">转账给 {isLiveContact(wechat) ? wechat : "店主"}，备注订单号。不要填写密码。</p>
          </form>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <AppShell />
    </ShopProvider>
  );
}
