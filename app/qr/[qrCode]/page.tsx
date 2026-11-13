import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { QRMenu } from "@/components/qr-menu";
export default async function QRPage({ params }: { params: { qrCode: string } }) {
  const table = await prisma.diningTable.findUnique({ where: { qrCode: params.qrCode }, include: { location: true } });
  if (!table) notFound();
  const categories = await prisma.category.findMany({ where: { locationId: table.locationId }, include: { items: { where: { isAvailable: true }, select: { id: true, name: true, description: true, price: true } } }, orderBy: { sortOrder: "asc" } });
  const serialized = categories.map(c=>({id:c.id,name:c.name,items:c.items.map(i=>({...i,price:Number(i.price)}))}));
  return <QRMenu qrCode={params.qrCode} storeName={table.location.name+" · Table "+table.label} categories={serialized}/>;
}
