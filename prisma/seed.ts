import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  let location = await prisma.location.findFirst({ where: { name: "The Daily Grind" } });
  if (!location) location = await prisma.location.create({ data: { name: "The Daily Grind", currency: "INR", timezone: "Asia/Kolkata" } });
  const catalog = [
    { name: "Coffee", items: [{ name: "Espresso", price: 120 }, { name: "Cappuccino", price: 180 }, { name: "Flat White", price: 190 }] },
    { name: "Tea & Cold", items: [{ name: "Iced Matcha Latte", price: 240 }, { name: "Masala Chai", price: 90 }] },
    { name: "Bakery", items: [{ name: "Butter Croissant", price: 140 }, { name: "Blueberry Muffin", price: 130 }] },
    { name: "Food", items: [{ name: "Avocado Toast", price: 280 }, { name: "Grilled Sandwich", price: 220 }] }
  ];
  for (const [index, categoryData] of catalog.entries()) {
    const category = await prisma.category.upsert({ where: { locationId_name: { locationId: location.id, name: categoryData.name } }, update: { sortOrder: index }, create: { name: categoryData.name, locationId: location.id, sortOrder: index } });
    for (const item of categoryData.items) await prisma.menuItem.upsert({ where: { id: `${category.id}-${item.name.toLowerCase().replace(/[^a-z0-9]+/g,"-")}` }, update: { price: item.price }, create: { id: `${category.id}-${item.name.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`, name: item.name, price: item.price, categoryId: category.id } });
  }
  const stock = [{name:"Coffee beans",unit:"kg",quantity:12,reorderLevel:3},{name:"Whole milk",unit:"L",quantity:28,reorderLevel:8},{name:"Sugar",unit:"kg",quantity:7,reorderLevel:2}];
  for (const item of stock) await prisma.inventoryItem.upsert({ where: { locationId_name: { locationId: location.id, name: item.name } }, update: {}, create: { ...item, locationId: location.id } });
  console.log("Seeded cafe catalog and inventory for", location.name);
}
main().catch(e => { console.error(e); process.exit(1); }).finally(async () => prisma.$disconnect());
