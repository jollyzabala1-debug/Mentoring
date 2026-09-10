import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...\n");

  // Clear existing data (in order to avoid FK constraint issues)
  console.log("🗑️  Clearing existing data...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItemIngredient.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.inventoryCategory.deleteMany();
  await prisma.user.deleteMany();
  await prisma.dailyReport.deleteMany();

  // ─── Users ───────────────────────────────────────────────

  console.log("👤 Creating users...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  const owner = await prisma.user.create({
    data: {
      name: "Owner User",
      email: "owner@test.com",
      password: hashedPassword,
      role: "OWNER",
      status: "ACTIVE",
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@test.com",
      password: hashedPassword,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  const supervisor = await prisma.user.create({
    data: {
      name: "Supervisor User",
      email: "supervisor@test.com",
      password: hashedPassword,
      role: "SUPERVISOR",
      status: "ACTIVE",
    },
  });

  console.log(`  ✅ Created 3 users (Owner, Admin, Supervisor)`);

  // ─── Inventory Categories ────────────────────────────────

  console.log("📦 Creating inventory categories...");
  const invCategoryBaking = await prisma.inventoryCategory.create({
    data: { name: "Baking" },
  });

  const invCategoryDairy = await prisma.inventoryCategory.create({
    data: { name: "Dairy" },
  });

  const invCategorySweeteners = await prisma.inventoryCategory.create({
    data: { name: "Sweeteners" },
  });

  const invCategoryPowders = await prisma.inventoryCategory.create({
    data: { name: "Powders" },
  });

  const invCategorySyrups = await prisma.inventoryCategory.create({
    data: { name: "Syrups" },
  });

  console.log(`  ✅ Created 5 inventory categories`);

  // ─── Inventory Items ──────────────────────────────────────

  console.log("🏪 Creating inventory items...");
  const inventoryItems = [
    { name: "All-Purpose Flour", categoryId: invCategoryBaking.id, unit: "kg", supplier: "Local Mill", stock: 50 },
    { name: "Sugar", categoryId: invCategorySweeteners.id, unit: "kg", supplier: "Sweet Co", stock: 30 },
    { name: "Butter", categoryId: invCategoryDairy.id, unit: "kg", supplier: "Dairy Farm", stock: 20 },
    { name: "Milk", categoryId: invCategoryDairy.id, unit: "L", supplier: "Dairy Farm", stock: 100 },
    { name: "Eggs", categoryId: invCategoryDairy.id, unit: "pcs", supplier: "Local Farm", stock: 500 },
    { name: "Cocoa Powder", categoryId: invCategoryPowders.id, unit: "kg", supplier: "Cocoa Co", stock: 15 },
    { name: "Vanilla Extract", categoryId: invCategorySyrups.id, unit: "ml", supplier: "Spice House", stock: 5000 },
    { name: "Baking Powder", categoryId: invCategoryBaking.id, unit: "kg", supplier: "Bake Co", stock: 10 },
    { name: "Salt", categoryId: invCategoryPowders.id, unit: "kg", supplier: "Salt Works", stock: 25 },
    { name: "Coffee Beans", categoryId: invCategoryPowders.id, unit: "kg", supplier: "Coffee Roasters", stock: 40 },
  ];

  for (const item of inventoryItems) {
    await prisma.inventoryItem.create({
      data: {
        name: item.name,
        categoryId: item.categoryId,
        stock: item.stock,
        unit: item.unit,
        supplier: item.supplier,
        status: "GOOD",
        updatedById: owner.id,
      },
    });
  }

  console.log(`  ✅ Created ${inventoryItems.length} inventory items`);

  // ─── Menu Categories ──────────────────────────────────────

  console.log("🍽️  Creating menu categories...");
  const catCoffee = await prisma.menuCategory.create({
    data: { name: "Coffee" },
  });

  const catCakes = await prisma.menuCategory.create({
    data: { name: "Cakes" },
  });

  const catPasta = await prisma.menuCategory.create({
    data: { name: "Pasta" },
  });

  const catRiceMeals = await prisma.menuCategory.create({
    data: { name: "Rice Meals" },
  });

  const catSnacks = await prisma.menuCategory.create({
    data: { name: "Snacks" },
  });

  console.log(`  ✅ Created 5 menu categories`);

  // ─── Menu Items ───────────────────────────────────────────

  console.log("🍴 Creating menu items...");
  const menuItems = [
    // Coffee
    { name: "Americano", description: "Strong black coffee", price: 2.5, categoryId: catCoffee.id },
    { name: "Cappuccino", description: "Espresso with steamed milk", price: 3.5, categoryId: catCoffee.id },
    { name: "Latte", description: "Smooth and creamy", price: 3.75, categoryId: catCoffee.id },
    { name: "Espresso", description: "Double shot", price: 2.0, categoryId: catCoffee.id },
    { name: "Iced Coffee", description: "Cold brew coffee", price: 3.0, categoryId: catCoffee.id },

    // Cakes
    { name: "Chocolate Cake", description: "Rich dark chocolate", price: 4.5, categoryId: catCakes.id },
    { name: "Vanilla Cake", description: "Classic vanilla", price: 3.5, categoryId: catCakes.id },
    { name: "Cheesecake", description: "Creamy New York style", price: 5.0, categoryId: catCakes.id },
    { name: "Red Velvet Cake", description: "Velvety and elegant", price: 4.75, categoryId: catCakes.id },
    { name: "Carrot Cake", description: "Moist with cream cheese frosting", price: 4.0, categoryId: catCakes.id },

    // Pasta
    { name: "Chicken Alfredo", description: "Creamy pasta with chicken", price: 8.5, categoryId: catPasta.id },
    { name: "Spaghetti Carbonara", description: "Classic Roman pasta", price: 7.5, categoryId: catPasta.id },
    { name: "Penne Arrabbiata", description: "Spicy tomato sauce", price: 6.5, categoryId: catPasta.id },
    { name: "Lasagna", description: "Layered beef and cheese", price: 9.0, categoryId: catPasta.id },
    { name: "Ravioli Truffle", description: "Filled with ricotta", price: 10.0, categoryId: catPasta.id },

    // Rice Meals
    { name: "Fried Rice", description: "Chicken fried rice", price: 6.0, categoryId: catRiceMeals.id },
    { name: "Risotto", description: "Creamy mushroom risotto", price: 7.5, categoryId: catRiceMeals.id },
    { name: "Paella", description: "Spanish rice with seafood", price: 12.0, categoryId: catRiceMeals.id },
    { name: "Biryani", description: "Spiced basmati rice", price: 8.0, categoryId: catRiceMeals.id },
    { name: "Danggit Rice", description: "Local specialty with fish", price: 7.0, categoryId: catRiceMeals.id },

    // Snacks
    { name: "Croissant", description: "Buttery and flaky", price: 2.5, categoryId: catSnacks.id },
    { name: "Donut", description: "Glazed donut", price: 1.5, categoryId: catSnacks.id },
    { name: "Cookies", description: "Chocolate chip cookies", price: 2.0, categoryId: catSnacks.id },
    { name: "Muffin", description: "Blueberry muffin", price: 2.75, categoryId: catSnacks.id },
    { name: "Granola Bar", description: "Healthy snack", price: 1.75, categoryId: catSnacks.id },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.create({
      data: {
        name: item.name,
        description: item.description,
        price: item.price,
        categoryId: item.categoryId,
        status: "ACTIVE",
      },
    });
  }

  console.log(`  ✅ Created ${menuItems.length} menu items`);

  // ─── Daily Reports ────────────────────────────────────────

  console.log("📊 Creating sample daily reports...");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    await prisma.dailyReport.create({
      data: {
        date: date,
        totalRevenue: 500 + Math.random() * 500,
        totalExpenses: 200 + Math.random() * 300,
        netProfit: 100 + Math.random() * 200,
        totalOrders: 20 + Math.floor(Math.random() * 30),
      },
    });
  }

  console.log(`  ✅ Created 7 days of sample reports`);

  console.log("\n✨ Database seed completed successfully!\n");
  console.log("📋 Test Credentials:");
  console.log("   Owner:      owner@test.com / password123");
  console.log("   Admin:      admin@test.com / password123");
  console.log("   Supervisor: supervisor@test.com / password123\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
