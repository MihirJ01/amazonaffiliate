export const productCategories = [
  "Computer Parts",
  "Graphics Cards",
  "Processors",
  "Motherboards",
  "RAM & Storage",
  "PC Cases & Cooling",
  "Monitors & Displays",
  "Laptops & Tablets",
  "Networking",
  "Audio & Headphones",
  "Mobile & Wearables",
  "Gaming",
  "Smart Home",
  "Accessories",
  "Home",
  "Other",
] as const;

export type ProductCategory = (typeof productCategories)[number];
