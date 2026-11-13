"use client";

import { useMemo, useState } from "react";
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, BookOpen, Box, CalendarDays,
  ChefHat, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, ClipboardList,
  Coffee, CreditCard, Download, Ellipsis, FileBarChart, Filter, LayoutDashboard,
  LifeBuoy, LogOut, Menu, MoreHorizontal, Package, Plus, Search, Settings,
  ShoppingBag, ShoppingCart, Sparkles, Star, Store, Tags, TrendingUp, Users,
  Utensils, Wallet, X
} from "lucide-react";

type Order = { id: string; customer: string; item: string; amount: string; status: "Completed" | "Preparing" | "Pending"; time: string };
const initialOrders: Order[] = [
  { id: "#CF-2048", customer: "Olivia Rhye", item: "2 items · Cappuccino, Croissant", amount: "₹420", status: "Completed", time: "10:42 AM" },
  { id: "#CF-2047", customer: "Phoenix Baker", item: "3 items · Latte, Avocado toast", amount: "₹685", status: "Preparing", time: "10:38 AM" },
  { id: "#CF-2046", customer: "Lana Steiner", item: "1 item · Iced Americano", amount: "₹220", status: "Pending", time: "10:31 AM" },
  { id: "#CF-2045", customer: "Demi Wilkinson", item: "2 items · Mocha, Muffin", amount: "₹390", status: "Completed", time: "10:24 AM" },
  { id: "#CF-2044", customer: "Candice Wu", item: "4 items · Breakfast combo", amount: "₹890", status: "Completed", time: "10:16 AM" },
];

const navGroups = [
  { title: "WORKSPACE", items: [
    { label: "Overview", icon: LayoutDashboard }, { label: "Orders", icon: ClipboardList, count: "8" },
    { label: "Point of sale", icon: ShoppingCart }, { label: "Kitchen display", icon: ChefHat, count: "3" },
    { label: "Reservations", icon: CalendarDays }, { label: "Menu", icon: BookOpen },
  ]},
  { title: "MANAGEMENT", items: [
    { label: "Inventory", icon: Package }, { label: "Customers", icon: Users },
    { label: "Analytics", icon: FileBarChart }, { label: "Marketing", icon: Tags },
    { label: "Store settings", icon: Store },
  ]},
];

const sectionDescriptions: Record<string, string> = {
  Overview: "Here's what's happening at your cafe today.",
  Orders: "Track, manage and fulfil every customer order.",
  "Point of sale": "Create a quick order and take payments at the counter.",
  "Kitchen display": "Keep the kitchen moving with live order status.",
  Reservations: "Manage upcoming tables and guest bookings.",
  Menu: "Manage products, categories and availability.",
  Inventory: "Keep ingredients and supplies in check.",
  Customers: "Get to know your regulars and grow loyalty.",
  Analytics: "Understand sales, performance and customer trends.",
  Marketing: "Create offers and bring customers back.",
  "Store settings": "Manage your cafe profile and preferences.",
};

export default function Home() {
  const [active, setActive] = useState("Overview");
  const [orders, setOrders] = useState(initialOrders);
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState("Last 7 days");
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState("");
  const filteredOrders = useMemo(() => orders.filter(o => [o.id, o.customer, o.item, o.status].join(" ").toLowerCase().includes(query.toLowerCase())), [orders, query]);

  function notify(message: string) { setToast(message); window.setTimeout(() => setToast(""), 2600); }
  function addOrder() {
    const id = "#CF-" + (2049 + orders.length - initialOrders.length);
    setOrders([{ id, customer: "Walk-in customer", item: "1 item · Flat white", amount: "₹180", status: "Pending", time: "Just now" }, ...orders]);
    setShowNewOrder(false); setActive("Orders"); notify("New order created");
  }

  return (
    <div className="min-h-screen bg-[#f7f8f5] text-[#17221d]">
      {mobileNav && <button aria-label="Close navigation" className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setMobileNav(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[258px] flex-col border-r border-[#e9ede8] bg-white transition-transform lg:translate-x-0 ${mobileNav ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-[76px] items-center gap-3 border-b border-[#eef0ec] px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#244b3b] text-white"><Coffee size={20}/></div>
          <div><div className="text-[17px] font-bold tracking-tight">cafeflow<span className="text-[#5b8a70]">.</span></div><div className="text-[10px] font-medium tracking-[.16em] text-[#89948d]">HOSPITALITY OS</div></div>
          <button className="ml-auto text-[#8b958e] lg:hidden" onClick={() => setMobileNav(false)}><X size={18}/></button>
        </div>
        <div className="px-4 pt-5">
          <button className="flex w-full items-center gap-3 rounded-xl border border-[#e9ede8] px-3 py-3 text-left hover:bg-[#f8faf7]" onClick={() => notify("Store switcher coming soon")}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f2eee5] text-[#8b704b]"><Store size={17}/></div>
            <div className="min-w-0 flex-1"><div className="truncate text-[12px] font-semibold">The Daily Grind</div><div className="mt-0.5 text-[11px] text-[#89948d]">Main branch · India</div></div><ChevronDown size={15} className="text-[#89948d]"/>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {navGroups.map(group => <div key={group.title} className="mb-7">
            <div className="mb-2 px-3 text-[10px] font-bold tracking-[.13em] text-[#a0aaa3]">{group.title}</div>
            <div className="space-y-1">{group.items.map(item => {
              const Icon = item.icon; const selected = active === item.label;
              return <button key={item.label} onClick={() => {setActive(item.label);setMobileNav(false);}} className={`flex w-full items-center gap-3 rounded-lg px-3 py-[10px] text-[12.5px] font-medium transition ${selected ? "bg-[#edf4ef] text-[#244b3b]" : "text-[#66736b] hover:bg-[#f7f9f6] hover:text-[#26382e]"}`}>
                <Icon size={17} strokeWidth={selected ? 2.2 : 1.8}/><span className="flex-1 text-left">{item.label}</span>{item.count && <span className={`rounded-md px-2 py-0.5 text-[10px] ${selected ? "bg-white text-[#426b54]" : "bg-[#f1f3f0] text-[#89948d]"}`}>{item.count}</span>}
              </button>;
            })}</div>
          </div>)}
        </nav>
        <div className="border-t border-[#eef0ec] p-3">
          <button onClick={() => notify("Help center opened soon")} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[12px] text-[#66736b] hover:bg-[#f7f9f6]"><LifeBuoy size={17}/> Help & support</button>
          <button onClick={() => setActive("Store settings")} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[12px] text-[#66736b] hover:bg-[#f7f9f6]"><Settings size={17}/> Settings</button>
          <div className="mt-3 flex items-center gap-3 border-t border-[#eef0ec] px-2 pt-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e9eee8] text-[11px] font-bold text-[#315b43]">JD</div>
            <div className="min-w-0 flex-1"><div className="truncate text-[11px] font-semibold">James Davis</div><div className="text-[10px] text-[#929c95]">Store owner</div></div>
            <button onClick={() => notify("You are already signed in")} className="text-[#929c95]"><LogOut size={16}/></button>
          </div>
        </div>
      </aside>

      <main className="min-h-screen lg:pl-[258px]">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-[#e9ede8] bg-white/95 px-5 backdrop-blur md:px-8">
          <div className="flex items-center gap-3"><button className="text-[#647168] lg:hidden" onClick={() => setMobileNav(true)}><Menu size={21}/></button><div><div className="text-[11px] text-[#98a29b]">Workspace <span className="px-1">/</span> <span className="text-[#536158]">{active}</span></div><div className="mt-1 text-[15px] font-semibold">{active}</div></div></div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden items-center gap-2 rounded-lg border border-[#e9ede8] px-3 py-2 text-[11px] text-[#87928a] md:flex"><Search size={14}/><span>Search anything...</span><kbd className="ml-8 rounded border border-[#e6eae5] px-1.5 py-0.5 text-[9px]">⌘ K</kbd></div>
            <button onClick={() => notify("You're all caught up!")} className="relative rounded-lg p-2 text-[#758078] hover:bg-[#f4f6f3]"><Bell size={18}/><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#d58a54]"/></button>
            <div className="hidden h-7 w-px bg-[#e9ede8] sm:block"/>
            <button onClick={() => notify("Account menu")} className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e9eee8] text-[10px] font-bold text-[#315b43]">JD</div><ChevronDown size={14} className="hidden text-[#87928a] sm:block"/></button>
          </div>
        </header>

        <div className="mx-auto max-w-[1440px] px-5 py-7 md:px-8 md:py-8">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div><div className="text-[22px] font-semibold tracking-[-.04em] md:text-[25px]">{active === "Overview" ? "Good morning, James 👋" : active}</div><p className="mt-1.5 text-[12px] text-[#89948d]">{sectionDescriptions[active]}</p></div>
            <div className="flex items-center gap-2"><button onClick={() => notify("Report export is being prepared")} className="hidden items-center gap-2 rounded-lg border border-[#e3e9e2] bg-white px-3 py-2.5 text-[11px] font-medium text-[#536158] hover:bg-[#fafbf9] sm:flex"><Download size={14}/> Export</button><button onClick={() => setShowNewOrder(true)} className="flex items-center gap-2 rounded-lg bg-[#244b3b] px-3.5 py-2.5 text-[11px] font-semibold text-white shadow-sm hover:bg-[#193b2c]"><Plus size={15}/> New order</button></div>
          </div>

          {active === "Overview" || active === "Analytics" ? <>
            <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {label:"Total revenue",value:"₹48,294",change:"+12.8%",up:true,icon:Wallet,note:"vs. previous 7 days"},
                {label:"Total orders",value:"1,284",change:"+8.2%",up:true,icon:ShoppingBag,note:"vs. previous 7 days"},
                {label:"Average order value",value:"₹376",change:"+4.6%",up:true,icon:CreditCard,note:"vs. previous 7 days"},
                {label:"Returning customers",value:"32.4%",change:"-2.1%",up:false,icon:Users,note:"vs. previous 7 days"},
              ].map((stat) => {const Icon=stat.icon;return <div key={stat.label} className="rounded-xl border border-[#e9ede8] bg-white p-4 shadow-[0_2px_8px_rgba(20,40,25,.02)] md:p-5"><div className="flex items-center justify-between"><span className="text-[11px] font-medium text-[#77837a]">{stat.label}</span><span className="rounded-lg bg-[#f3f6f2] p-2 text-[#64806c]"><Icon size={16}/></span></div><div className="mt-4 flex items-end justify-between gap-2"><div className="text-[25px] font-semibold tracking-[-.04em]">{stat.value}</div><span className={`mb-1 flex items-center gap-0.5 text-[10px] font-semibold ${stat.up?"text-[#3e8b5c]":"text-[#c47a54]"}`}>{stat.up?<ArrowUpRight size={13}/>:<ArrowDownRight size={13}/>} {stat.change}</span></div><div className="mt-1.5 text-[10px] text-[#a0aaa3]">{stat.note}</div></div>})}
            </div>

            <div className="mb-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.65fr_1fr]">
              <section className="rounded-xl border border-[#e9ede8] bg-white p-5 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3"><div><div className="text-[13px] font-semibold">Revenue overview</div><div className="mt-1 text-[10px] text-[#929c95]">Track your cafe's performance over time</div></div><select value={period} onChange={e=>setPeriod(e.target.value)} className="rounded-lg border border-[#e7ebe6] bg-white px-2.5 py-2 text-[10px] text-[#66736b] outline-none"><option>Last 7 days</option><option>Last 30 days</option><option>This year</option></select></div>
                <div className="mt-6 flex items-end gap-3"><span className="text-[27px] font-semibold tracking-[-.04em]">₹48,294</span><span className="mb-1 rounded-md bg-[#edf5ef] px-2 py-1 text-[10px] font-semibold text-[#46805a]">↑ 12.8%</span></div>
                <div className="relative mt-5 h-[190px] w-full">
                  <div className="absolute inset-0 flex flex-col justify-between text-[9px] text-[#a1aaa3]"><div className="flex items-center gap-3"><span className="w-7">₹15k</span><div className="h-px flex-1 border-t border-dashed border-[#edf0ec]"/></div><div className="flex items-center gap-3"><span className="w-7">₹10k</span><div className="h-px flex-1 border-t border-dashed border-[#edf0ec]"/></div><div className="flex items-center gap-3"><span className="w-7">₹5k</span><div className="h-px flex-1 border-t border-dashed border-[#edf0ec]"/></div><div className="flex items-center gap-3"><span className="w-7">₹0</span><div className="h-px flex-1 border-t border-dashed border-[#edf0ec]"/></div></div>
                  <svg viewBox="0 0 620 170" preserveAspectRatio="none" className="absolute bottom-0 left-10 h-[165px] w-[calc(100%-42px)] overflow-visible"><defs><linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#8eaf98" stopOpacity=".28"/><stop offset="100%" stopColor="#8eaf98" stopOpacity="0"/></linearGradient></defs><path d="M0 130 C35 120 40 93 88 102 S145 120 176 78 S225 90 265 68 S315 89 352 54 S405 75 442 47 S490 60 530 28 S580 42 620 8 L620 170 L0 170Z" fill="url(#revenueFill)"/><path d="M0 130 C35 120 40 93 88 102 S145 120 176 78 S225 90 265 68 S315 89 352 54 S405 75 442 47 S490 60 530 28 S580 42 620 8" fill="none" stroke="#4e8060" strokeWidth="2.5" strokeLinecap="round"/><circle cx="620" cy="8" r="4" fill="#4e8060" stroke="white" strokeWidth="2"/></svg>
                </div>
                <div className="ml-10 mt-2 flex justify-between text-[9px] text-[#9aa49d]"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
              </section>

              <section className="rounded-xl border border-[#e9ede8] bg-white p-5 md:p-6">
                <div className="flex items-center justify-between"><div><div className="text-[13px] font-semibold">Popular items</div><div className="mt-1 text-[10px] text-[#929c95]">Best sellers this week</div></div><button onClick={()=>setActive("Menu")} className="text-[10px] font-semibold text-[#477356]">View menu</button></div>
                <div className="mt-5 space-y-[18px]">
                  {[{name:"Caramel Macchiato",category:"Coffee · Hot",sold:248,percent:88,price:"₹240",emoji:"☕"},{name:"Butter Croissant",category:"Bakery · Pastry",sold:186,percent:68,price:"₹160",emoji:"🥐"},{name:"Iced Matcha Latte",category:"Tea · Cold",sold:142,percent:51,price:"₹280",emoji:"🍵"},{name:"Avocado Toast",category:"Food · Breakfast",sold:98,percent:36,price:"₹320",emoji:"🥑"}].map(item=><div key={item.name}><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f5f6f1] text-[19px]">{item.emoji}</div><div className="min-w-0 flex-1"><div className="truncate text-[11px] font-semibold">{item.name}</div><div className="mt-0.5 text-[9px] text-[#9aa49d]">{item.category}</div></div><div className="text-right"><div className="text-[11px] font-semibold">{item.sold}</div><div className="text-[9px] text-[#9aa49d]">sold</div></div></div><div className="ml-12 mt-2 h-1.5 overflow-hidden rounded-full bg-[#f0f2ee]"><div className="h-full rounded-full bg-[#789780]" style={{width:item.percent+"%"}}/></div></div>)}
                </div>
              </section>
            </div>
          </> : <section className="mb-5 rounded-xl border border-[#e9ede8] bg-white p-6"><div className="flex items-center gap-3"><div className="rounded-xl bg-[#edf4ef] p-3 text-[#315b43]"><Sparkles size={20}/></div><div><div className="text-[14px] font-semibold">{active} workspace</div><div className="mt-1 text-[11px] text-[#8d9890]">This module is scaffolded. Connect the data layer to enable live operations.</div></div></div><div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="rounded-lg bg-[#f7f9f6] p-4"><div className="text-[10px] text-[#929c95]">Module status</div><div className="mt-1 text-[13px] font-semibold text-[#477356]">UI scaffold ready</div></div><div className="rounded-lg bg-[#f7f9f6] p-4"><div className="text-[10px] text-[#929c95]">Data connection</div><div className="mt-1 text-[13px] font-semibold">Not configured</div></div><div className="rounded-lg bg-[#f7f9f6] p-4"><div className="text-[10px] text-[#929c95]">Next step</div><div className="mt-1 text-[13px] font-semibold">API + database</div></div></div></section>}

          <section className="overflow-hidden rounded-xl border border-[#e9ede8] bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eef0ec] px-5 py-4 md:px-6"><div><div className="text-[13px] font-semibold">Recent orders</div><div className="mt-1 text-[10px] text-[#929c95]">A quick look at your latest transactions</div></div><button onClick={()=>setActive("Orders")} className="text-[10px] font-semibold text-[#477356] hover:underline">View all orders →</button></div>
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 md:px-6"><div className="relative min-w-[190px] flex-1 sm:max-w-[280px]"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa49d]"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search orders..." className="w-full rounded-lg border border-[#e8ece7] py-2 pl-9 pr-3 text-[10px] outline-none placeholder:text-[#a4ada6] focus:border-[#8aa794]"/></div><button onClick={()=>notify("Filters: all order statuses")} className="flex items-center gap-2 rounded-lg border border-[#e8ece7] px-3 py-2 text-[10px] text-[#657269]"><Filter size={13}/> Filter</button></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left"><thead className="bg-[#fafbf9] text-[9px] font-semibold uppercase tracking-[.08em] text-[#9aa49d]"><tr><th className="px-6 py-3">Order ID</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Items</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Time</th><th className="px-5 py-3"/></tr></thead><tbody className="divide-y divide-[#f0f2ee]">{filteredOrders.map(order=><tr key={order.id} className="text-[10px] hover:bg-[#fcfdfb]"><td className="whitespace-nowrap px-6 py-4 font-semibold text-[#42634d]">{order.id}</td><td className="whitespace-nowrap px-4 py-4 font-medium">{order.customer}</td><td className="whitespace-nowrap px-4 py-4 text-[#849087]">{order.item}</td><td className="whitespace-nowrap px-4 py-4 font-semibold">{order.amount}</td><td className="whitespace-nowrap px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${order.status==="Completed"?"bg-[#edf5ef] text-[#4a805b]":order.status==="Preparing"?"bg-[#fff5e8] text-[#b17a37]":"bg-[#f1f2f0] text-[#737d75]"}`}>{order.status}</span></td><td className="whitespace-nowrap px-4 py-4 text-[#8c978f]">{order.time}</td><td className="px-5 py-4"><button onClick={()=>notify(`Order ${order.id} selected`)} className="text-[#9aa49d] hover:text-[#315b43]"><MoreHorizontal size={16}/></button></td></tr>)}</tbody></table>{filteredOrders.length===0&&<div className="p-8 text-center text-[11px] text-[#929c95]">No orders match your search.</div>}</div>
            <div className="flex items-center justify-between border-t border-[#eef0ec] px-5 py-3 text-[10px] text-[#929c95] md:px-6"><span>Showing {filteredOrders.length} of {orders.length} orders</span><div className="flex items-center gap-2"><button disabled className="rounded-md border border-[#e8ece7] p-1.5 text-[#c1c8c2]"><ChevronLeft size={13}/></button><span className="rounded-md bg-[#edf4ef] px-2.5 py-1.5 font-semibold text-[#42634d]">1</span><button onClick={()=>notify("You are viewing the latest orders")} className="rounded-md border border-[#e8ece7] p-1.5 text-[#7d8980]"><ChevronRight size={13}/></button></div></div>
          </section>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-[9px] text-[#a0aaa3]"><span>© 2026 CafeFlow Clone · Independent implementation</span><span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#73a17e]"/> All systems operational (demo)</span></div>
        </div>
      </main>

      {showNewOrder && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101b15]/35 p-4" onClick={()=>setShowNewOrder(false)}><div className="w-full max-w-[400px] rounded-2xl bg-white p-6 shadow-2xl" onClick={e=>e.stopPropagation()}><div className="flex items-center justify-between"><div className="text-[16px] font-semibold">Create new order</div><button onClick={()=>setShowNewOrder(false)} className="text-[#89948d]"><X size={18}/></button></div><p className="mt-1 text-[11px] text-[#929c95]">Start a quick counter order for a walk-in customer.</p><div className="mt-5 rounded-xl border border-[#e9ede8] p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f3f5f1] text-xl">☕</div><div className="flex-1"><div className="text-[12px] font-semibold">Flat white</div><div className="mt-0.5 text-[10px] text-[#929c95]">Coffee · Regular</div></div><div className="text-[12px] font-semibold">₹180</div></div></div><div className="mt-4 flex justify-between text-[11px]"><span className="text-[#7e8981]">Subtotal</span><span className="font-semibold">₹180</span></div><div className="mt-2 flex justify-between text-[11px]"><span className="text-[#7e8981]">Tax (included)</span><span>₹0</span></div><div className="mt-4 flex justify-between border-t border-[#eef0ec] pt-4 text-[13px] font-semibold"><span>Total</span><span>₹180</span></div><button onClick={addOrder} className="mt-5 w-full rounded-lg bg-[#244b3b] py-3 text-[11px] font-semibold text-white hover:bg-[#193b2c]">Create order · ₹180</button></div></div>}
      {toast && <div className="fixed bottom-5 right-5 z-[60] rounded-xl bg-[#203d2d] px-4 py-3 text-[11px] font-medium text-white shadow-xl">{toast}</div>}
    </div>
  );
}
