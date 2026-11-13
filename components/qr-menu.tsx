"use client";
import { useMemo, useState } from "react";
type MenuCategory = { id: string; name: string; items: { id: string; name: string; description: string | null; price: string | number }[] };
export function QRMenu({ qrCode, storeName, categories }: { qrCode: string; storeName: string; categories: MenuCategory[] }) {
  const [cart,setCart]=useState<Record<string,number>>({});
  const [name,setName]=useState("");
  const [notes,setNotes]=useState("");
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");
  const items=useMemo(()=>categories.flatMap(c=>c.items.map(i=>({...i,category:c.name,quantity:cart[i.id]||0}))).filter(i=>i.quantity>0),[categories,cart]);
  const total=items.reduce((sum,i)=>sum+Number(i.price)*i.quantity,0);
  function change(id:string,delta:number){setCart(current=>({...current,[id]:Math.max(0,(current[id]||0)+delta)}));}
  async function submit(){
    if(!items.length)return;
    setBusy(true);setMessage("");
    try{
      const response=await fetch("/api/public/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({qrCode,customerName:name||undefined,notes:notes||undefined,items:items.map(i=>({menuItemId:i.id,quantity:i.quantity}))})});
      const data=await response.json();
      if(!response.ok)throw new Error(data.error||"Could not place order");
      setCart({});setNotes("");setMessage("Order #"+data.order.orderNumber+" sent to the kitchen. Thank you!");
    }catch(e){setMessage(e instanceof Error?e.message:"Order failed");}
    finally{setBusy(false);}
  }
  return <main className="min-h-screen bg-[#f7f8f4] pb-36 text-[#17221d]">
    <header className="bg-[#244b3b] px-5 py-8 text-white"><div className="mx-auto max-w-2xl"><div className="text-xs uppercase tracking-[.2em] text-white/65">Digital menu</div><h1 className="mt-2 text-3xl font-semibold">{storeName}</h1><p className="mt-2 text-sm text-white/70">Browse the menu and order right from your table.</p></div></header>
    <div className="mx-auto max-w-2xl px-4 py-6">{message&&<div className="mb-5 rounded-xl border border-[#cbdccf] bg-[#edf5ef] p-4 text-sm text-[#315b43]">{message}</div>}
      {categories.map(category=><section key={category.id} className="mb-7"><h2 className="mb-3 text-lg font-semibold">{category.name}</h2><div className="space-y-3">{category.items.map(item=><div key={item.id} className="flex items-center gap-3 rounded-xl border border-[#e8ede6] bg-white p-4"><div className="min-w-0 flex-1"><div className="font-medium">{item.name}</div>{item.description&&<p className="mt-1 text-xs text-[#87928a]">{item.description}</p>}<div className="mt-2 text-sm font-semibold">₹{Number(item.price).toFixed(0)}</div></div><div className="flex items-center gap-3"><button aria-label={"Remove "+item.name} onClick={()=>change(item.id,-1)} className="h-8 w-8 rounded-full border border-[#dfe7df] text-lg">−</button><span className="w-4 text-center text-sm">{cart[item.id]||0}</span><button aria-label={"Add "+item.name} onClick={()=>change(item.id,1)} className="h-8 w-8 rounded-full bg-[#244b3b] text-lg text-white">+</button></div></div>)}</div></section>)}
      {!categories.length&&<p className="rounded-xl bg-white p-6 text-center text-sm text-[#87928a]">The menu is not available right now.</p>}
    </div>
    {items.length>0&&<div className="fixed inset-x-0 bottom-0 border-t border-[#e5ebe4] bg-white p-4 shadow-[0_-8px_30px_rgba(20,40,25,.08)]"><div className="mx-auto max-w-2xl"><div className="mb-3 flex items-center justify-between"><div><div className="text-sm font-semibold">{items.reduce((s,i)=>s+i.quantity,0)} items in your order</div><div className="text-xs text-[#87928a]">Taxes may apply at checkout</div></div><div className="text-lg font-semibold">₹{total.toFixed(0)}</div></div><div className="mb-3 grid grid-cols-2 gap-2"><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name (optional)" className="min-w-0 rounded-lg border border-[#e3e9e2] px-3 py-2 text-xs outline-none"/><input value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Special instructions" className="min-w-0 rounded-lg border border-[#e3e9e2] px-3 py-2 text-xs outline-none"/></div><button disabled={busy} onClick={submit} className="w-full rounded-xl bg-[#244b3b] py-3 text-sm font-semibold text-white disabled:opacity-50">{busy?"Sending order...":"Place order · ₹"+total.toFixed(0)}</button></div></div>}
  </main>;
}
