export type Lang = "zh" | "en";
export type Category = "seat" | "assist" | "agent" | "pack" | "service";
export type Stock = "many" | "low" | "preorder" | "out";
export type Delivery = "online" | "queue" | "auto";
export type MarkName =
  | "star"
  | "seal"
  | "wave"
  | "orbit"
  | "prism"
  | "fold"
  | "pro"
  | "spark"
  | "pages"
  | "bolt"
  | "film";
export type ContactType = "wechat" | "telegram" | "email";
export type PayMethod = "wechat" | "alipay" | "chat";
export type OrderStatus = "pending" | "paid" | "done" | "closed";
export type FilterId = "all" | "ready" | Category;

export type LStr = { zh: string; en: string };

export type Product = {
  id: string;
  mark: MarkName;
  category: Category;
  price: number;
  agentPrice?: number;
  was?: number;
  stock: Stock;
  delivery: Delivery;
  recommended?: boolean;
  maxQty: number;
  keywords: string[];
  eta: LStr;
  title: LStr;
  summary: LStr;
  tags: { zh: string[]; en: string[] };
  points: { zh: string[]; en: string[] };
};

export type PromptCard = {
  id: string;
  title: LStr;
  scene: LStr;
  body: LStr;
};

export type Settings = {
  shopNameZh: string;
  shopNameEn: string;
  wechat: string;
  alipay: string;
  telegram: string;
  xHandle: string;
  announcementZh: string;
  announcementEn: string;
  payNoteZh: string;
  payNoteEn: string;
};

export type OrderItem = {
  id: string;
  qty: number;
  price: number;
  titleZh: string;
  titleEn: string;
};

export type Order = {
  id: string;
  createdAt: number;
  items: OrderItem[];
  total: number;
  contact: string;
  contactType: ContactType;
  payMethod: PayMethod;
  note: string;
  status: OrderStatus;
  deliveryNote?: string;
};

export type Line = { id: string; qty: number };

export const BRAND_MARK = "RˉkAI";
export const BRAND_SPOKEN = "凯知选";
export const PLACEHOLDER_WECHAT = "rkai_desk";

const SAMPLE_CONTACTS = new Set(["nanfeng_desk", "rkai_desk", PLACEHOLDER_WECHAT]);

export function isLiveContact(wechat: string) {
  const value = wechat.trim();
  return value.length >= 3 && !SAMPLE_CONTACTS.has(value);
}

export const defaultSettings: Settings = {
  shopNameZh: "凯知选",
  shopNameEn: "RˉkAI",
  wechat: "rkai_desk",
  alipay: "rkai_desk",
  telegram: "rkai_desk",
  xHandle: "rkai",
  announcementZh: "选好后留下微信，转账备注订单号。个人柜台，不是官方商店，核对到账后发货。",
  announcementEn: "Leave a WeChat id, then transfer with the order id in the note. Personal desk, not an official store.",
  payNoteZh: "金额与订单一致，备注写订单号。收款码会过期，以微信里发的为准。",
  payNoteEn: "Match the amount and write the order id in the note. Payment codes expire — use the one sent in chat.",
};

export const filters: { id: FilterId; zh: string; en: string }[] = [
  { id: "all", zh: "全部", en: "All" },
  { id: "seat", zh: "席位", en: "Seats" },
  { id: "assist", zh: "代充", en: "Top-up" },
  { id: "agent", zh: "代理", en: "Agent" },
  { id: "pack", zh: "文件", en: "Files" },
  { id: "ready", zh: "可发", en: "Ready" },
];

export const products: Product[] = [
  {
    id: "gemini-20x",
    mark: "star",
    category: "seat",
    price: 168,
    agentPrice: 128,
    stock: "many",
    delivery: "online",
    recommended: true,
    maxQty: 3,
    keywords: ["gemini", "ultra", "家庭组", "席位", "20x", "谷歌"],
    eta: { zh: "核对后 10–40 分钟", en: "10–40 min after the transfer is checked" },
    title: { zh: "Gemini Ultra 20x 家庭组席位", en: "Gemini Ultra 20x family seat" },
    summary: {
      zh: "卖家自有家庭组空位。可用组内已经开通的高级能力，以组里实际显示为准。不交付成品邮箱密码。",
      en: "A spare seat in the seller's own family group. You get whatever advanced access the group already has. No email password is handed over on this page.",
    },
    tags: {
      zh: ["代开通", "在线发货"],
      en: ["Assisted open", "Live handoff"],
    },
    points: {
      zh: [
        "不是 Google 官方商店，也不是官方收银台",
        "核对到账后，用你留的微信拉群或发邀请",
        "不在网页上出现邮箱、密码或验证码",
        "一个周期，到期不自动续费",
        "未发货可退；邀请失效可补一次",
      ],
      en: [
        "Not a Google store and not official checkout",
        "After payment is checked, you are invited via the WeChat you left",
        "No email, password, or code appears on this page",
        "One cycle. It does not auto-renew",
        "Refunded if unfulfilled. One replacement if the invite fails",
      ],
    },
  },
  {
    id: "agent",
    mark: "seal",
    category: "agent",
    price: 308,
    stock: "many",
    delivery: "online",
    maxQty: 1,
    keywords: ["代理", "代发", "分销", "进货价", "vip"],
    eta: { zh: "核对后开通资格", en: "Status opens after the transfer is checked" },
    title: { zh: "铺内代理席位", en: "Desk agent seat" },
    summary: {
      zh: "自用走本铺代理价，也可以备注代发。只是进货价资格，不承诺任何收入。",
      en: "Wholesale prices on this desk, plus a note if you are ordering for someone else. It is a price tier, not an income promise.",
    },
    tags: {
      zh: ["代理", "一件代发", "在线发货"],
      en: ["Agent", "Drop-ship note", "Live handoff"],
    },
    points: {
      zh: [
        "开通后，本铺有代理价的商品按代理价记",
        "代发时备注你的客人称呼即可，不隐藏来路成谜",
        "没有「每月几万」这种说法，成交多少看你自己有没有客人",
        "资格记在你留的联系方式上",
        "未发货可退",
      ],
      en: [
        "Agent prices apply to items that have them",
        "Add your guest's name in the note if you are passing an order on",
        "No monthly income is promised",
        "The status is tied to the contact you leave",
        "Refunded if unfulfilled",
      ],
    },
  },
  {
    id: "muse",
    mark: "wave",
    category: "seat",
    price: 8,
    agentPrice: 6,
    was: 18,
    stock: "many",
    delivery: "queue",
    maxQty: 5,
    keywords: ["muse", "成品", "成品账号", "低价", "明星"],
    eta: { zh: "核对后排队，通常一小时内", en: "Queued after check, usually within an hour" },
    title: { zh: "Muse 成品席位（已降价）", en: "Muse ready seat (marked down)" },
    summary: {
      zh: "低价成品席位协助，不是 Muse 官方零售。核对后发送开通说明。首次打不开可补一次。",
      en: "A low-priced ready seat, not official Muse retail. Setup notes are sent after the transfer is checked. One replacement if the first open fails.",
    },
    tags: {
      zh: ["成品席位", "明星规格", "排队发货"],
      en: ["Ready seat", "Marked", "Queued"],
    },
    points: {
      zh: [
        "不是官方商店",
        "开通说明在核对后私下发给你，不写在公开页面",
        "登录后请立刻改成只有你知道的登录方式",
        "不要把验证码发给任何人，包括本柜台",
        "售后只覆盖第一次打不开",
      ],
      en: [
        "Not an official store",
        "Setup notes are sent privately after check, never posted on this page",
        "Change the login so only you know it",
        "Never send a verification code to anyone, including this desk",
        "Aftercare covers a failed first open only",
      ],
    },
  },
  {
    id: "grok",
    mark: "orbit",
    category: "assist",
    price: 168,
    agentPrice: 138,
    stock: "preorder",
    delivery: "queue",
    maxQty: 2,
    keywords: ["grok", "super", "30", "美刀", "代充", "xai", "ios"],
    eta: { zh: "可预订，到账时间以回复为准", en: "Preorder. Arrival follows the reply" },
    title: { zh: "Grok Super 一个月订阅协助", en: "Grok Super one-month assist" },
    summary: {
      zh: "约 30 美元档、一个月。渠道代充，不是 xAI 官方收银台。到账时账号里显示什么，就是什么规格。",
      en: "About the $30 tier, one month. A channel top-up, not xAI official checkout. The tier is whatever the account shows when it lands.",
    },
    tags: {
      zh: ["可预订", "渠道代充", "排队发货"],
      en: ["Preorder", "Channel top-up", "Queued"],
    },
    points: {
      zh: [
        "不是 xAI 官方收银台，不要当成官方充值",
        "只需留你自己的邮箱，不要留密码",
        "验证码只填在官方 App 里",
        "预订单先排队，我回复时间后再转账也行",
        "渠道失败则退款",
      ],
      en: [
        "Not xAI official checkout",
        "Leave your own email only. No password",
        "Verification codes stay inside the official app",
        "You can wait for a time reply before paying a preorder",
        "If the channel fails, you are refunded",
      ],
    },
  },
  {
    id: "gemini-5x",
    mark: "prism",
    category: "seat",
    price: 248,
    agentPrice: 198,
    stock: "low",
    delivery: "queue",
    maxQty: 1,
    keywords: ["gemini", "5x", "成品", "ultra", "库存"],
    eta: { zh: "库存少，核对后排队", en: "Low stock. Queued after check" },
    title: { zh: "Gemini Ultra 5x 成品席位", en: "Gemini Ultra 5x ready seat" },
    summary: {
      zh: "5x 规格成品席位，库存不多。售后只覆盖首次登录核对。登录后请马上绑定你自己的恢复方式。",
      en: "A 5x ready seat. Stock is thin. Aftercare covers the first login check only. Bind your own recovery as soon as you are in.",
    },
    tags: {
      zh: ["成品席位", "库存紧张"],
      en: ["Ready seat", "Low stock"],
    },
    points: {
      zh: [
        "不是官方商店，不享受官方质保",
        "首次登录失败可补一次或退款",
        "登录成功后请立刻改密并绑定恢复方式",
        "不要把验证码发到闲鱼聊天或陌生链接",
        "使用之后不退",
      ],
      en: [
        "Not an official store. No official warranty",
        "A failed first login is replaced once or refunded",
        "Change the password and bind recovery immediately",
        "Do not send codes into marketplace chat or unknown links",
        "No refund after you have used it",
      ],
    },
  },
  {
    id: "chatgpt",
    mark: "fold",
    category: "assist",
    price: 188,
    agentPrice: 158,
    stock: "many",
    delivery: "queue",
    maxQty: 3,
    keywords: ["chatgpt", "gpt", "plus", "代充", "openai"],
    eta: { zh: "核对后排队，通常一小时内", en: "Queued after check, usually within an hour" },
    title: { zh: "ChatGPT Plus 一个月订阅协助", en: "ChatGPT Plus one-month assist" },
    summary: {
      zh: "Plus 档一个月代充协助。不是 OpenAI 官方收银台。用你自己的账号邮箱，密码不要发过来。",
      en: "One month of Plus, assisted. Not OpenAI official checkout. Use your own account email. Do not send the password.",
    },
    tags: {
      zh: ["渠道代充", "排队发货"],
      en: ["Channel top-up", "Queued"],
    },
    points: {
      zh: [
        "不是 OpenAI 官方充值",
        "备注里可以留邮箱，不要留密码或验证码",
        "若需要验证，只在官方 App 里完成",
        "失败则退或换同等档期",
        "未发货可退",
      ],
      en: [
        "Not an OpenAI official top-up",
        "An email in the note is fine. A password or code is not",
        "If a check is required, finish it only in the official app",
        "Failure means a refund or an equal replacement",
        "Refunded if unfulfilled",
      ],
    },
  },
  {
    id: "chatgpt-pro",
    mark: "pro",
    category: "assist",
    price: 630,
    agentPrice: 560,
    stock: "preorder",
    delivery: "queue",
    maxQty: 1,
    keywords: ["chatgpt", "pro", "630", "高档", "代充", "gpt"],
    eta: { zh: "可预订，先确认再转账", en: "Preorder. Confirm before you transfer" },
    title: { zh: "ChatGPT 高档一个月协助", en: "ChatGPT higher-tier one-month assist" },
    summary: {
      zh: "高档一个月协助，价格按这个柜台的 630 元档。不是官方收银台。建议先留言确认，再转账。",
      en: "Higher tier, one month, priced at this desk's ¥630 tier. Not official checkout. Message first, then transfer.",
    },
    tags: {
      zh: ["高档代充", "可预订"],
      en: ["Higher tier", "Preorder"],
    },
    points: {
      zh: [
        "不要看成官方充值入口",
        "预订单可以先问库存再付款",
        "只留邮箱，不留密码",
        "渠道失败全额退",
        "使用之后不退",
      ],
      en: [
        "Do not treat this as official checkout",
        "Ask about a preorder before paying",
        "Email only. No password",
        "A failed channel is refunded in full",
        "No refund after use",
      ],
    },
  },
  {
    id: "claude",
    mark: "spark",
    category: "assist",
    price: 138,
    agentPrice: 112,
    stock: "many",
    delivery: "queue",
    maxQty: 3,
    keywords: ["claude", "pro", "anthropic", "代充"],
    eta: { zh: "核对后排队", en: "Queued after check" },
    title: { zh: "Claude Pro 一个月订阅协助", en: "Claude Pro one-month assist" },
    summary: {
      zh: "Pro 档一个月协助。不是 Anthropic 官方收银台。留你自己的邮箱即可。",
      en: "One month of Pro, assisted. Not Anthropic official checkout. Your own email is enough.",
    },
    tags: {
      zh: ["渠道代充", "排队发货"],
      en: ["Channel top-up", "Queued"],
    },
    points: {
      zh: [
        "不是官方商店",
        "不要在本页填写密码",
        "验证码只留在官方 App",
        "失败则退",
        "未发货可退",
      ],
      en: [
        "Not an official store",
        "Do not type a password on this page",
        "Codes stay in the official app",
        "Failure is refunded",
        "Refunded if unfulfilled",
      ],
    },
  },
  {
    id: "pack",
    mark: "pages",
    category: "pack",
    price: 36,
    agentPrice: 26,
    stock: "many",
    delivery: "auto",
    maxQty: 1,
    keywords: ["提示词", "工作流", "自动发货", "文案", "闲鱼"],
    eta: { zh: "申报付款后，订单页自动展开", en: "Opens on the order page after you declare payment" },
    title: { zh: "RˉkAI 提示词与工作流", en: "RˉkAI prompts and workflows" },
    summary: {
      zh: "8 条能直接复制的中文工作流。这是本铺唯一在页面里自动展开的货，不涉及任何账号。",
      en: "Eight workflows you can copy. This is the only item that opens on the page itself. No account is involved.",
    },
    tags: {
      zh: ["自动发货", "数字文件"],
      en: ["Auto delivery", "Digital file"],
    },
    points: {
      zh: [
        "点「我已转账」后，在这张订单里展开",
        "可先预览 2 条",
        "展开前可退，展开后不退",
        "不含任何登录信息",
        "适合自己改一改就拿去发闲鱼或朋友圈",
      ],
      en: [
        "Opens on the order after you tap “I have transferred”",
        "Two prompts can be previewed first",
        "Refundable before it opens, not after",
        "Contains no logins",
        "Rewrite them for your own listings",
      ],
    },
  },
  {
    id: "rush",
    mark: "bolt",
    category: "service",
    price: 12,
    stock: "many",
    delivery: "online",
    maxQty: 1,
    keywords: ["加急", "客服", "30分钟"],
    eta: { zh: "值守时间内争取 30 分钟内回复", en: "A reply within 30 minutes during desk hours" },
    title: { zh: "加急值守", en: "Rush the desk" },
    summary: {
      zh: "把你的单插到当前队列前面。不加快官方或渠道本身的到账，只加快我回复你。",
      en: "Moves your order up this desk's queue. It does not speed up an official channel. It speeds up my reply.",
    },
    tags: {
      zh: ["加急", "在线发货"],
      en: ["Rush", "Live handoff"],
    },
    points: {
      zh: [
        "值守时间是每天 10:00–24:00",
        "休息时间下单，顺延到次日 10:00",
        "可以和席位一起拍",
        "未开始处理可退",
      ],
      en: [
        "Desk hours are 10:00–24:00",
        "Orders placed while away wait until 10:00",
        "Can be bought with a seat",
        "Refundable if not started",
      ],
    },
  },
  {
    id: "video",
    mark: "film",
    category: "seat",
    price: 96,
    stock: "out",
    delivery: "queue",
    maxQty: 1,
    keywords: ["视频", "缺货", "生成"],
    eta: { zh: "今天没有空位", en: "No seat today" },
    title: { zh: "视频生成席位", en: "Video generation seat" },
    summary: {
      zh: "今天没有空位。可以留言，有货时按你留的联系方式回你。",
      en: "No seat today. Leave a contact and you will be told when one exists.",
    },
    tags: {
      zh: ["暂时缺货"],
      en: ["Out"],
    },
    points: {
      zh: ["今天不能下单", "不要先转账", "留言后按顺序回"],
      en: ["Cannot be ordered today", "Do not transfer first", "Messages are answered in order"],
    },
  },
];

export const prompts: PromptCard[] = [
  {
    id: "title",
    title: { zh: "闲鱼标题", en: "Marketplace title" },
    scene: { zh: "一件货，写出 5 个不夸张的标题", en: "Five sober titles for one item" },
    body: {
      zh: "你是一个克制的闲鱼卖家。商品是：【商品】。真实规格：【规格】。价格：【价格】。请写 5 个标题，每个不超过 30 字。不要写「官方」「稳赚」「包过」，不要承诺收入。突出规格、交付方式和售后边界。",
      en: "Write 5 marketplace titles under 30 Chinese characters for 【item】, spec 【spec】, price 【price】. No “official”, no income promises. State the spec, delivery, and aftercare limit.",
    },
  },
  {
    id: "lead",
    title: { zh: "详情第一句", en: "First line of a listing" },
    scene: { zh: "让人看懂你卖什么、不卖什么", en: "Say what it is and what it is not" },
    body: {
      zh: "用 80 字写闲鱼详情的第一段。商品：【商品】。必须写明：这是个人卖家，不是官方；怎么发货；什么情况可退。语气像柜台前说话，不要营销腔。",
      en: "Write an 80-character opening for a listing of 【item】. It must say: personal seller, not official; how it is delivered; when it can be refunded. Speak like a counter, not an ad.",
    },
  },
  {
    id: "nudge",
    title: { zh: "催单不生硬", en: "A nudge that is not rude" },
    scene: { zh: "客人问了价，半天没回", en: "They asked the price and went quiet" },
    body: {
      zh: "客人问过【商品】，已经【小时】小时没回。写 2 条微信跟进，每条不超过 40 字。不要催促感叹号，不要虚构库存紧张。给一个具体的下一步：看链接、留订单号，或告诉我先不用。",
      en: "They asked about 【item】 and have been quiet for 【hours】 hours. Write 2 follow-ups under 40 characters. No fake scarcity. Offer a concrete next step.",
    },
  },
  {
    id: "refund",
    title: { zh: "退款回复", en: "Refund reply" },
    scene: { zh: "未发货，或第一次打不开", en: "Unfulfilled, or the first open failed" },
    body: {
      zh: "情况：【未发货 / 第一次打不开 / 已经使用】。按这个规则写回复：未发货全额退；第一次打不开补一次或退；已经使用不退。先复述对方的情况，再给结论和到账时间。不要指责。",
      en: "Case: 【unfulfilled / first open failed / already used】. Rule: unfulfilled is refunded; a failed first open is replaced once or refunded; used is final. Restate their case, then the decision.",
    },
  },
  {
    id: "en",
    title: { zh: "翻成干净英文", en: "Clean English" },
    scene: { zh: "发到 X 之前过一遍", en: "Before you post on X" },
    body: {
      zh: "把下面这段改成自然的英文，保留所有限制条件（不是官方、不收密码、核对后发货）。不要加销售口号。原文：【粘贴】",
      en: "Rewrite the following in natural English. Keep every limit: not official, no passwords, fulfilled after check. Do not add slogans. Source: 【paste】",
    },
  },
  {
    id: "week",
    title: { zh: "一周柜台小结", en: "Week note" },
    scene: { zh: "自己复盘，不发到外面", en: "A private weekly note" },
    body: {
      zh: "根据这些记录写一份给自己看的周报：成交【单数】，退款【单数】，最常被问的问题【问题】。分成：做对的、不该承诺的、下周只改一件事。不要写成鸡汤。",
      en: "Write a private weekly note from: 【orders】 closed, 【refunds】 refunded, most asked 【question】. Sections: what worked, what should not have been promised, one change for next week.",
    },
  },
  {
    id: "voice",
    title: { zh: "口播开头", en: "Spoken opening" },
    scene: { zh: "15 秒讲清楚怎么下单", en: "15 seconds on how to order" },
    body: {
      zh: "写一段 15 秒口播。内容只有三步：打开链接选货、留下微信、转账备注订单号。要说这不是官方店，也不要说能赚钱。口语，不要书面语。",
      en: "Write a 15-second spoken script. Only three steps: open the link, leave WeChat, transfer with the order id. Say it is not an official store. Do not mention making money.",
    },
  },
  {
    id: "image",
    title: { zh: "柜台风光提示词", en: "Counter still-life prompt" },
    scene: { zh: "给配图用，不要文字", en: "For a listing photo, no text" },
    body: {
      zh: "写一条图片提示词：夜里的小柜台，铜灯，空白订单纸，一盏茶，没有人，没有字母，没有商标。暖色，35mm，浅景深。再写一条不该出现的东西清单。",
      en: "Write an image prompt: a small counter at night, brass lamp, blank order paper, tea, no people, no letters, no logos. Warm, 35mm, shallow depth. Then list what must not appear.",
    },
  },
];

const zh = {
  searchPh: "搜索商品关键词",
  search: "搜索",
  onDuty: "值守中",
  offDuty: "休息中",
  offHint: "可以下单，次日 10:00 起核对",
  personal: "个人柜台 · 非官方",
  trust: "人工核对 · 不收密码 · 未发货可退 · 订单可回查",
  filterAll: "全部",
  filterSeat: "席位",
  filterAssist: "代充",
  filterAgent: "代理",
  filterPack: "文件",
  filterReady: "可发",
  stockMany: "库存非常多",
  stockLow: "即将售罄",
  stockPre: "可预订",
  stockOut: "暂时缺货",
  deliveryOnline: "在线发货",
  deliveryQueue: "排队发货",
  deliveryAuto: "自动发货",
  recommend: "推荐",
  retail: "零售价",
  agentPriceLabel: "代理价",
  results: "件",
  noResult: "柜台上没有这个关键词",
  clearSearch: "看全部货",
  addCart: "加入购物袋",
  buyNow: "立即下单",
  soldOut: "今天没有",
  cart: "购物袋",
  emptyCart: "购物袋是空的",
  emptyCartHint: "先选一件。家庭组席位今天可以排。",
  seeFeatured: "看推荐的席位",
  checkout: "去结算",
  total: "合计",
  qty: "数量",
  remove: "移除",
  contactQ: "怎么联系你",
  wechat: "微信",
  telegram: "Telegram",
  email: "邮箱",
  contactPhWechat: "微信号或手机号",
  contactPhTg: "@你的用户名",
  contactPhEmail: "you@mail.com",
  note: "备注",
  notePh: "规格、时间要求可以写在这里",
  notePhAssist: "代充可留你自己的邮箱。不要填密码或验证码",
  payMethod: "怎么付款",
  payWechat: "微信支付",
  payAlipay: "支付宝",
  payChat: "先私信确认",
  payWechatHint: "加我的微信，转账备注订单号",
  payAlipayHint: "转到支付宝，备注订单号",
  payChatHint: "把订单链接发到 Telegram 或 X，我回复收款方式",
  agree: "我知道这是个人柜台，不是官方商店。我不会在本页填写密码或验证码。",
  placeOrder: "生成订单",
  needContact: "留下联系方式，否则没法发货",
  needAgree: "请先勾选：这里不填密码",
  badEmail: "邮箱看起来不完整",
  orderNo: "订单号",
  yourContact: "你的联系方式",
  payTo: "转给值守",
  copyId: "复制订单号",
  copyWechat: "复制微信号",
  copySummary: "复制订单摘要",
  copyLink: "复制订单链接",
  copyFail: "复制失败，请长按文字手动复制",
  copied: "已复制",
  declaredBtn: "我已转账，请核对",
  declaredDone: "已申报，等待核对",
  askCs: "问客服这张单",
  iAmDesk: "我是值守，去核销",
  pending: "待付款",
  paid: "待核对",
  done: "已发货",
  closed: "已关闭",
  sealPending: "待付",
  sealPaid: "待核",
  sealDone: "已发",
  sealClosed: "关闭",
  stepOrder: "下单",
  stepDeclare: "申报",
  stepCheck: "核对",
  stepSend: "发货",
  noPassword: "不要把密码或验证码发给任何人，包括本柜台。验证码只填在官方 App。",
  amountMatch: "转账金额请与合计一致，备注里写订单号。",
  noCard: "本页不收集银行卡号。",
  orders: "订单",
  emptyOrders: "还没有订单。选一件货就能开单。",
  lookupPh: "回查订单号，例如 RK-7K2Q",
  notFound: "这台设备上没有这张单。打开卖家发你的订单链接，或把单号发给值守。",
  reorder: "再来一单",
  view: "查看",
  desk: "值守",
  settings: "对外联系方式",
  shopName: "柜台名",
  shopNameEn: "英文名",
  alipay: "支付宝账号",
  xHandle: "X 用户名",
  payNote: "收款说明",
  payNoteEn: "收款说明（英文）",
  saveLink: "保存并生成我的链接",
  settingsHint: "保存后，链接里会带上你的微信和店名。把那个链接发到闲鱼或 X，别人打开就能下单。",
  yourLink: "你的下单链接",
  copyXianyu: "复制闲鱼文案",
  copyX: "复制 X 文案",
  copyPlainLink: "只复制链接",
  previewAgent: "对照代理价",
  previewHint: "只是对照，不改变结算价。真正的代理价在核销代理单之后，记在这台浏览器上。",
  fulfill: "确认发货",
  markPaid: "标为已申报",
  closeOrder: "关闭",
  deliveryPh: "写给买家的发货说明。不要写密码。",
  useTemplate: "填入不含密码的说明",
  orderQueue: "本机订单",
  howTitle: "把链接发出去",
  howBody: "别人从闲鱼或 X 点进来，不用再私聊问价。",
  step1t: "选货",
  step1b: "价格和库存写在柜台上。",
  step2t: "留联系方式",
  step2b: "微信、Telegram 或邮箱。不要留密码。",
  step3t: "备注订单号转账",
  step3b: "核对到账后发货。没发货可以退。",
  faqTitle: "先看这四件",
  q1: "别人点链接能直接付款吗？",
  a1: "能下单。付款是微信或支付宝转账，不是在网页里填银行卡。买家留下联系方式，按订单号转账，你核对后在微信或 Telegram 发货。",
  q2: "为什么页面不自动弹出账号？",
  a2: "密码不经过这个网页。席位和代充是核对后私下交付。唯一在订单页展开的，是提示词文件。",
  q3: "换成我自己的微信要怎么做？",
  a3: "打开「值守」，改微信号、支付宝和店名，点「保存并生成我的链接」。把那个链接贴到闲鱼或 X。也可以改 src/data.ts 里的 defaultSettings，重新构建后，不带参数的链接也会显示你的联系方式。",
  q4: "是官方店吗？",
  a4: "不是。和 Google、OpenAI、xAI、Anthropic 都没有关系。写着渠道代充的，就不是官方收银台。",
  railKicker: "凯知选 · RˉkAI",
  railLede: "链接丢到闲鱼或 X，别人打开就能选货、留联系方式、按订单号付钱。",
  railQuote: "先知，后选，各得其所。",
  cs: "在线客服",
  chatPh: "问库存、发货或退款",
  chatHi: "值守在。可以直接下单，也可以先问。转账请备注订单号。密码和验证码不要发过来。",
  send: "发送",
  quick1: "怎么发货",
  quick2: "怎么付款",
  quick3: "能退吗",
  quick4: "是官方吗",
  quick5: "代理是什么",
  added: "已放入购物袋",
  ordered: "订单已生成",
  declared: "已记下付款申报",
  fulfilledToast: "已标记发货",
  closedToast: "订单已关闭",
  saved: "链接已生成并复制",
  imported: "已打开这张订单",
  badLink: "这张订单链接读不出来",
  fromLink: "继续这张单",
  hours: "每天 10:00–24:00",
  items: "件商品",
  backCart: "返回购物袋",
  back: "返回",
  close: "关闭",
  detailEta: "时效",
  includes: "包含",
  previewLock: "其余 6 条在申报付款后展开",
  unlocked: "文件已展开，可以复制",
  copyPrompt: "复制",
  copyAll: "复制全部",
  agentTable: "代理价对照",
  noIncome: "没有收入承诺。",
  continueOrder: "继续处理",
  passwordBanner: "这一单包含代充。备注里可以留邮箱，不要留密码或验证码。",
  fileUnlockHint: "提示词会在你点「我已转账」后出现在这张订单里。",
  seatWaitHint: "席位和代充不会在此页显示登录信息。核对后，我按你留的联系方式发货。",
  footerNote: "价格为人民币。商品名只说明规格，不表示官方授权。",
  langAria: "切换语言",
  cartAria: "打开购物袋",
  closeAria: "关闭",
  dutyLocal: "当地时间",
  postHint: "文案里的微信来自值守设置。发出去之前改成你自己的。",
  deskLead: "买家的单子记在他们自己的手机上。让他们把订单链接或摘要发给你，你在这里能看到导入的单，真正的发货仍在微信里完成。",
  per: "件",
  wasLabel: "原价",
  outDetail: "今天不能买。不要先转账。",
  maxReached: "已到这件货的数量上限",
  contactLabel: "联系方式",
  noteOptional: "选填",
  methodChosen: "买家选的方式",
  alsoTell: "发货仍走你留下的联系方式。",
  openTg: "打开 Telegram",
  openX: "打开 X",
  summaryLabel: "订单摘要，可长按复制",
  ticketFoot: "凯知选 RˉkAI · 核对后发货",
  agentUnlockedHint: "这台浏览器已记下代理价。",
  renameHint: "店名会显示在买家打开的页面上。",
  buildHint: "想让不带参数的网址也显示你的微信，改 src/data.ts 的 defaultSettings 后重新构建。",
  home: "首页",
  bag: "购物袋",
  featured: "推荐",
  lineItems: "明细",
  agreeShort: "确认不是官方，且不在此填密码",
  deskHours: "值守时间",
  importHint: "买家把订单链接发来后，用这台浏览器打开，单子会出现在下面。",
  wroteNote: "发货说明",
  noOrdersYet: "还没有导入或本机生成的订单。",
  clearChat: "清空对话",
  currentOrder: "当前订单",
  yuanNote: "人民币",
  searchEmptyToast: "输入关键词，或直接看下面的货",
  look: "查看订单",
  paidSeal: "已申报",
  queueNote: "本机队列",
  sellerWechat: "值守微信",
  sellerAli: "值守支付宝",
  sellerTg: "值守 Telegram",
  dmPay: "把下面的订单链接发给我，我会回复收款方式。不要在公开回复里发付款截图。",
  changeLang: "中文",
  enLang: "EN",
};

const en: typeof zh = {
  searchPh: "Search the desk",
  search: "Search",
  onDuty: "On duty",
  offDuty: "Away",
  offHint: "You can still order. Checks resume at 10:00.",
  personal: "Personal desk · not official",
  trust: "Checked by hand · no passwords · refund if unfulfilled · orders can be reopened",
  filterAll: "All",
  filterSeat: "Seats",
  filterAssist: "Top-up",
  filterAgent: "Agent",
  filterPack: "Files",
  filterReady: "Ready",
  stockMany: "Plenty",
  stockLow: "Almost gone",
  stockPre: "Preorder",
  stockOut: "Out",
  deliveryOnline: "Live handoff",
  deliveryQueue: "Queued",
  deliveryAuto: "Auto file",
  recommend: "Pick",
  retail: "Retail",
  agentPriceLabel: "Agent",
  results: "items",
  noResult: "Nothing on the desk matches",
  clearSearch: "Show everything",
  addCart: "Add to bag",
  buyNow: "Order this",
  soldOut: "Not today",
  cart: "Bag",
  emptyCart: "The bag is empty",
  emptyCartHint: "Start with a seat. The family seat can be queued today.",
  seeFeatured: "See the picked seat",
  checkout: "Checkout",
  total: "Total",
  qty: "Qty",
  remove: "Remove",
  contactQ: "How do I reach you",
  wechat: "WeChat",
  telegram: "Telegram",
  email: "Email",
  contactPhWechat: "WeChat id or phone",
  contactPhTg: "@yourname",
  contactPhEmail: "you@mail.com",
  note: "Note",
  notePh: "Spec or timing, if it matters",
  notePhAssist: "Your email is fine. No password or code",
  payMethod: "How you will pay",
  payWechat: "WeChat Pay",
  payAlipay: "Alipay",
  payChat: "DM first",
  payWechatHint: "Add my WeChat and put the order id in the note",
  payAlipayHint: "Transfer on Alipay with the order id in the note",
  payChatHint: "Send the order link on Telegram or X. I will reply with how to pay",
  agree: "I know this is a personal desk, not an official store. I will not type a password or code here.",
  placeOrder: "Create order",
  needContact: "Leave a contact, or the order cannot be fulfilled",
  needAgree: "Confirm you will not type a password here",
  badEmail: "That email looks incomplete",
  orderNo: "Order",
  yourContact: "Your contact",
  payTo: "Pay the desk",
  copyId: "Copy order id",
  copyWechat: "Copy WeChat",
  copySummary: "Copy summary",
  copyLink: "Copy order link",
  copyFail: "Copy failed. Long-press the text instead",
  copied: "Copied",
  declaredBtn: "I have transferred",
  declaredDone: "Declared. Waiting for a check",
  askCs: "Ask about this order",
  iAmDesk: "I run the desk",
  pending: "To pay",
  paid: "To check",
  done: "Sent",
  closed: "Closed",
  sealPending: "DUE",
  sealPaid: "CHK",
  sealDone: "OUT",
  sealClosed: "OFF",
  stepOrder: "Order",
  stepDeclare: "Declare",
  stepCheck: "Check",
  stepSend: "Send",
  noPassword: "Do not send a password or code to anyone, including this desk. Codes belong only in the official app.",
  amountMatch: "Match the total. Write the order id in the transfer note.",
  noCard: "This page never takes a card number.",
  orders: "Orders",
  emptyOrders: "No orders yet. Pick something to open one.",
  lookupPh: "Look up an id, e.g. RK-7K2Q",
  notFound: "That id is not on this device. Open the link the seller sent you.",
  reorder: "Order again",
  view: "Open",
  desk: "Desk",
  settings: "Public contact",
  shopName: "Desk name",
  shopNameEn: "English name",
  alipay: "Alipay id",
  xHandle: "X handle",
  payNote: "Payment note",
  payNoteEn: "Payment note in English",
  saveLink: "Save and make my link",
  settingsHint: "After saving, the link carries your WeChat and desk name. Post that link on Xianyu or X.",
  yourLink: "Your order link",
  copyXianyu: "Copy Xianyu post",
  copyX: "Copy X post",
  copyPlainLink: "Copy link only",
  previewAgent: "Show agent prices",
  previewHint: "Comparison only. Checkout does not change. Real agent prices stick on this browser after an agent order is fulfilled.",
  fulfill: "Mark sent",
  markPaid: "Mark declared",
  closeOrder: "Close",
  deliveryPh: "A note for the buyer. Do not write a password.",
  useTemplate: "Use a note without passwords",
  orderQueue: "Orders on this device",
  howTitle: "Post the link",
  howBody: "People arriving from Xianyu or X should not have to ask the price in chat.",
  step1t: "Pick",
  step1b: "Price and stock are on the desk.",
  step2t: "Leave a contact",
  step2b: "WeChat, Telegram, or email. Not a password.",
  step3t: "Pay with the order id",
  step3b: "I send it after I see the transfer. Unfulfilled orders are refunded.",
  faqTitle: "Four things first",
  q1: "Can someone pay from the link?",
  a1: "They can order. Payment is a WeChat or Alipay transfer, not a card typed into the page. They leave a contact, pay with the order id, and you deliver in chat after you see the money.",
  q2: "Why doesn't an account pop up?",
  a2: "Passwords never pass through this page. Seats and top-ups are delivered privately after a check. The only thing that opens on the order is the prompt file.",
  q3: "How do I use my own WeChat?",
  a3: "Open Desk, edit WeChat, Alipay, and the name, then tap Save and make my link. Post that link. You can also edit defaultSettings in src/data.ts and rebuild, so a bare URL shows your contact too.",
  q4: "Is this official?",
  a4: "No. This desk is not Google, OpenAI, xAI, or Anthropic. A channel top-up is not official checkout.",
  railKicker: "Kaizhixuan · RˉkAI",
  railLede: "Drop the link on Xianyu or X. People pick, leave a contact, and pay with the order id.",
  railQuote: "Know first, then choose. Each leaves with their share.",
  cs: "Live desk",
  chatPh: "Ask about stock, delivery, or refunds",
  chatHi: "Desk is here. Order directly, or ask first. Put the order id in the transfer note. Do not send passwords or codes.",
  send: "Send",
  quick1: "How do you deliver",
  quick2: "How do I pay",
  quick3: "Can I refund",
  quick4: "Is this official",
  quick5: "What is agent",
  added: "Added to the bag",
  ordered: "Order created",
  declared: "Payment declaration saved",
  fulfilledToast: "Marked as sent",
  closedToast: "Order closed",
  saved: "Link ready and copied",
  imported: "Order opened",
  badLink: "That order link could not be read",
  fromLink: "Continue this order",
  hours: "Daily 10:00–24:00",
  items: "items",
  backCart: "Back to bag",
  back: "Back",
  close: "Close",
  detailEta: "Timing",
  includes: "Includes",
  previewLock: "The other 6 open after you declare payment",
  unlocked: "File open. Copy what you need",
  copyPrompt: "Copy",
  copyAll: "Copy all",
  agentTable: "Agent prices",
  noIncome: "No income is promised.",
  continueOrder: "Continue",
  passwordBanner: "This order includes a top-up. An email in the note is fine. A password or code is not.",
  fileUnlockHint: "The prompts appear on this order after you tap “I have transferred”.",
  seatWaitHint: "Seats and top-ups never show a login here. After the check, I deliver to the contact you left.",
  footerNote: "Prices are in CNY. Names describe a spec. They are not an official license.",
  langAria: "Switch language",
  cartAria: "Open bag",
  closeAria: "Close",
  dutyLocal: "Local time",
  postHint: "The WeChat in the post comes from Desk settings. Change it to yours before you publish.",
  deskLead: "A buyer's order lives on their phone. Ask them to send the order link or the summary. Opening the link here imports it. Real delivery still happens in chat.",
  per: "ea",
  wasLabel: "Was",
  outDetail: "Not for sale today. Do not transfer yet.",
  maxReached: "That's the limit for this item",
  contactLabel: "Contact",
  noteOptional: "optional",
  methodChosen: "Method they chose",
  alsoTell: "Delivery still goes to the contact they left.",
  openTg: "Open Telegram",
  openX: "Open X",
  summaryLabel: "Summary. Long-press to copy",
  ticketFoot: "RˉkAI · after check",
  agentUnlockedHint: "Agent prices are stored on this browser.",
  renameHint: "The name is what buyers see.",
  buildHint: "To show your WeChat on a bare URL, edit defaultSettings in src/data.ts and rebuild.",
  home: "Home",
  bag: "Bag",
  featured: "Pick",
  lineItems: "Lines",
  agreeShort: "Not official, and no password on this page",
  deskHours: "Hours",
  importHint: "When a buyer sends their order link, open it in this browser. It will land below.",
  wroteNote: "Note to buyer",
  noOrdersYet: "No orders created or imported on this device yet.",
  clearChat: "Clear chat",
  currentOrder: "This order",
  yuanNote: "CNY",
  searchEmptyToast: "Type a keyword, or just browse",
  look: "Open order",
  paidSeal: "Declared",
  queueNote: "On this device",
  sellerWechat: "Desk WeChat",
  sellerAli: "Desk Alipay",
  sellerTg: "Desk Telegram",
  dmPay: "Send me the order link below. I will reply with how to pay. Don't post a payment screenshot in public.",
  changeLang: "中文",
  enLang: "EN",
};

export const copy = { zh, en };
export type Copy = typeof zh;

export function pick(lang: Lang, text: LStr) {
  return text[lang];
}

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}

export function matchProduct(p: Product, q: string) {
  const s = q.trim().toLowerCase();
  if (!s) return true;
  const blob = [
    p.title.zh,
    p.title.en,
    p.summary.zh,
    p.summary.en,
    ...p.tags.zh,
    ...p.tags.en,
    ...p.keywords,
    String(p.price),
    p.id,
  ]
    .join("\n")
    .toLowerCase();
  return blob.includes(s);
}

export function totalOf(lines: Line[], priceFor: (p: Product) => number) {
  return lines.reduce((sum, line) => {
    const p = getProduct(line.id);
    return p ? sum + priceFor(p) * line.qty : sum;
  }, 0);
}

export function makeOrderId(existing: string[]) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (let n = 0; n < 6; n += 1) {
    const bytes = new Uint32Array(4);
    crypto.getRandomValues(bytes);
    let id = "RK-";
    for (let i = 0; i < 4; i += 1) id += alphabet[bytes[i] % alphabet.length];
    if (!existing.includes(id)) return id;
  }
  return `RK-${Date.now().toString(36).toUpperCase().slice(-4)}`;
}

export function encodeOrder(order: Order) {
  const payload = { ...order };
  delete payload.deliveryNote;
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  let bin = "";
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function decodeOrder(raw: string): Order | null {
  try {
    const pad = raw.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(pad);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const data = JSON.parse(new TextDecoder().decode(bytes)) as Order;
    if (!data || typeof data.id !== "string" || !Array.isArray(data.items)) return null;
    if (typeof data.total !== "number" || typeof data.contact !== "string") return null;
    if (!["pending", "paid", "done", "closed"].includes(data.status)) return null;
    return data;
  } catch {
    return null;
  }
}

export function formatTime(ts: number, lang: Lang) {
  return new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-GB", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(ts);
}

export function yuan(n: number) {
  return `¥${n}`;
}

export function onDutyNow(date = new Date()) {
  return date.getHours() >= 10;
}

export function cleanHandle(value: string) {
  return value.replace(/^@/, "").trim();
}

export function sellerLink(settings: Settings) {
  const url = new URL(window.location.href);
  url.hash = "";
  url.search = "";
  const pairs: [string, string][] = [
    ["wx", settings.wechat],
    ["ali", settings.alipay],
    ["tg", settings.telegram],
    ["xh", settings.xHandle],
    ["name", settings.shopNameZh],
    ["nameEn", settings.shopNameEn],
    ["note", settings.payNoteZh],
    ["noteEn", settings.payNoteEn],
  ];
  pairs.forEach(([key, value]) => {
    const v = value.trim();
    if (v) url.searchParams.set(key, v);
  });
  return url.toString();
}

export function orderLink(encoded: string) {
  const url = new URL(window.location.href);
  url.hash = "";
  url.searchParams.set("order", encoded);
  return url.toString();
}

export function readUrlSettings(): Partial<Settings> {
  if (typeof window === "undefined") return {};
  const sp = new URLSearchParams(window.location.search);
  const pickParam = (key: string, max: number) => {
    const v = sp.get(key);
    if (!v) return undefined;
    const clean = v.replace(/[<>]/g, "").trim().slice(0, max);
    return clean || undefined;
  };
  const out: Partial<Settings> = {};
  const wx = pickParam("wx", 40);
  const ali = pickParam("ali", 48);
  const tg = pickParam("tg", 40);
  const xh = pickParam("xh", 40);
  const name = pickParam("name", 24);
  const nameEn = pickParam("nameEn", 32);
  const note = pickParam("note", 180);
  const noteEn = pickParam("noteEn", 180);
  if (wx) out.wechat = wx;
  if (ali) out.alipay = ali;
  if (tg) out.telegram = tg;
  if (xh) out.xHandle = xh;
  if (name) out.shopNameZh = name;
  if (nameEn) out.shopNameEn = nameEn;
  if (note) out.payNoteZh = note;
  if (noteEn) out.payNoteEn = noteEn;
  return out;
}

export function xianyuPost(settings: Settings, link: string) {
  const lines = products
    .filter((p) => p.stock !== "out" && p.category !== "service")
    .slice(0, 6)
    .map((p) => `· ${p.title.zh} ¥${p.price}${p.stock === "preorder" ? " 可预订" : ""}`)
    .join("\n");
  return `【${settings.shopNameZh} ${BRAND_MARK}】打开链接直接下单\n\n${lines}\n\n下单：\n${link}\n\n微信：${settings.wechat}\nTelegram：@${cleanHandle(settings.telegram)}\n\n转账备注订单号，核对后发货。\n个人柜台，不是官方商店，不收密码。`;
}

export function xPost(settings: Settings, link: string) {
  return `${BRAND_MARK}\nOrder from the link. Leave a contact. Pay with the order id. I send it after I see the transfer.\n\n${link}\n\nWeChat ${settings.wechat}\nTelegram @${cleanHandle(settings.telegram)}\n\nNot an official store. Don't send passwords.`;
}

export function orderSummary(order: Order, settings: Settings, lang: Lang) {
  const lines = order.items
    .map((item) => {
      const title = lang === "zh" ? item.titleZh : item.titleEn;
      return `${title} × ${item.qty}  ${yuan(item.price * item.qty)}`;
    })
    .join("\n");
  const contact =
    lang === "zh"
      ? `联系方式 ${order.contact}`
      : `Contact ${order.contact}`;
  const pay =
    order.payMethod === "wechat"
      ? lang === "zh"
        ? "微信支付"
        : "WeChat Pay"
      : order.payMethod === "alipay"
        ? lang === "zh"
          ? "支付宝"
          : "Alipay"
        : lang === "zh"
          ? "先私信确认"
          : "DM first";
  const note = order.note.trim()
    ? order.note.trim()
    : lang === "zh"
      ? "无"
      : "none";
  if (lang === "zh") {
    return `${settings.shopNameZh} ${BRAND_MARK} 订单 ${order.id}\n${lines}\n合计 ${yuan(order.total)}\n${contact}\n付款方式 ${pay}\n备注 ${note}\n请转账时备注订单号，金额保持一致。不要发送密码。`;
  }
  return `${settings.shopNameEn} ${order.id}\n${lines}\nTotal ${yuan(order.total)}\n${contact}\nPay via ${pay}\nNote ${note}\nWrite the order id in the transfer note. Do not send a password.`;
}

export function deliveryTemplate(order: Order, lang: Lang) {
  const ids = order.items.map((item) => item.id);
  const hasAssist = ids.some((id) => getProduct(id)?.category === "assist");
  const hasAgent = ids.includes("agent");
  const onlyPack = ids.length === 1 && ids[0] === "pack";
  if (onlyPack) {
    return lang === "zh"
      ? "数字文件已在订单页展开，直接复制即可。"
      : "The file is open on the order page. Copy it there.";
  }
  if (hasAgent) {
    return lang === "zh"
      ? "代理资格记在你留下的联系方式上。本铺没有收入承诺。之后下单把这个订单号一并发我，我按代理价改。"
      : "Agent status is tied to the contact you left. No income is promised. Send this order id with later orders and I will use agent prices.";
  }
  if (hasAssist) {
    return lang === "zh"
      ? "已排进代充队列。请确认邮箱是你自己的。验证码只填在官方 App，不要发给任何人，包括本柜台。"
      : "Queued for a top-up. Confirm the email is yours. Verification codes stay in the official app — never send them to anyone, including this desk.";
  }
  return lang === "zh"
    ? "已登记。请用你留下的联系方式等我，值守时间内回复。不要把密码发到闲鱼聊天以外的陌生链接。"
    : "Noted. I will reach the contact you left during desk hours. Do not send a password to any link outside the chat you already trust.";
}

export function chatReply(text: string, lang: Lang, wechat: string) {
  const q = text.toLowerCase();
  const zhLang = lang === "zh";
  if (/密码|验证码|password|otp|验证/.test(q)) {
    return zhLang
      ? "密码和验证码不要发给我，也不要填在这个网页里。验证码只填在官方 App。谁主动要验证码，都不要给。"
      : "Don't send passwords or codes, and don't type them here. Codes belong only in the official app.";
  }
  if (/退|refund/.test(q)) {
    return zhLang
      ? "还没发货的，全额退。已经发货但第一次打不开的，补一次或退。你已经用上的，不退。提示词展开之后不退。"
      : "Unfulfilled orders are refunded in full. A failed first open is replaced once or refunded. Used seats, and opened files, are final.";
  }
  if (/官方|official|google|openai|xai|anthropic/.test(q)) {
    return zhLang
      ? "不是官方。这是个人柜台，和 Google、OpenAI、xAI、Anthropic 没有关系。写着渠道代充的，就不是官方收银台。"
      : "Not official. This desk is independent of Google, OpenAI, xAI, and Anthropic. A channel top-up is not official checkout.";
  }
  if (/代理|收入|赚钱|副业|agent|钱/.test(q)) {
    return zhLang
      ? "代理只是本铺的进货价，308 元。没有每月收入承诺。有没有客人，是你自己的事。"
      : "Agent status is just this desk's wholesale price, ¥308. There is no income promise.";
  }
  if (/多久|发货|到账|deliver|how long|when/.test(q)) {
    return zhLang
      ? "核对转账后，席位类通常 10–60 分钟。标了可预订的，以我回复的时间为准。值守是每天 10:00–24:00。"
      : "After I see the transfer, seats usually go out in 10–60 minutes. Preorders follow the time I reply. Hours are 10:00–24:00.";
  }
  if (/库存|有货|stock|有没有/.test(q)) {
    return zhLang
      ? "家庭组席位、Muse、ChatGPT 协助、Claude 协助今天可以排。Gemini 5x 不多。Grok 和高档是预订。视频席位今天没有。"
      : "Family seats, Muse, ChatGPT assist, and Claude assist can be queued today. Gemini 5x is low. Grok and the higher tier are preorder. Video seats are out.";
  }
  if (/付|微信|支付宝|pay|wechat|alipay|怎么买|下单/.test(q)) {
    return zhLang
      ? `先在页面上下单，再加微信 ${wechat}。转账金额与订单一致，备注写订单号。本页不收银行卡，也不收密码。`
      : `Place the order on the page, then add WeChat ${wechat}. Match the amount and put the order id in the note. No card numbers, no passwords.`;
  }
  if (/闲鱼|链接|x\.com|twitter|怎么挂|post/.test(q)) {
    return zhLang
      ? "打开底部「值守」，改成你的微信，保存链接，再复制闲鱼文案或 X 文案。别人点开就能下单。"
      : "Open Desk, set your WeChat, save the link, then copy the Xianyu or X post. People can order from that link.";
  }
  return zhLang
    ? `可以说你要哪一件。急的话加微信 ${wechat}，备注订单号。`
    : `Tell me which item you want. If it's urgent, add WeChat ${wechat} and include the order id.`;
}

export function hasAssist(lines: { id: string }[]) {
  return lines.some((line) => getProduct(line.id)?.category === "assist");
}

export function hasPack(lines: { id: string }[]) {
  return lines.some((line) => line.id === "pack");
}
