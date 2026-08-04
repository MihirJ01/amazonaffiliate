export type FilterNode = { label: string; children?: FilterNode[] };

export const catalogTree: FilterNode[] = [
  {
    label: "Computer Parts",
    children: [
      {
        label: "CPU",
        children: ["Intel", "AMD", "Entry Level", "Mid Range", "High End"].map((label) => ({
          label,
        })),
      },
      {
        label: "Graphics Cards",
        children: [
          "NVIDIA",
          "AMD Radeon",
          "Intel Arc",
          "Budget GPUs",
          "Mid Range GPUs",
          "High End GPUs",
        ].map((label) => ({ label })),
      },
      {
        label: "Motherboards",
        children: ["Intel", "AMD", "Mini ITX", "Micro ATX", "ATX", "E-ATX"].map((label) => ({
          label,
        })),
      },
      {
        label: "RAM",
        children: ["DDR4", "DDR5", "Laptop RAM", "Desktop RAM", "RGB RAM"].map((label) => ({
          label,
        })),
      },
      {
        label: "Storage",
        children: [
          {
            label: "SSD",
            children: ["SATA SSD", "NVMe Gen3", "NVMe Gen4", "NVMe Gen5"].map((label) => ({
              label,
            })),
          },
          { label: "HDD", children: ["Internal HDD", "External HDD"].map((label) => ({ label })) },
        ],
      },
      {
        label: "Power Supplies",
        children: ["450W-650W", "650W-850W", "850W+", "Modular", "Semi Modular", "Non Modular"].map(
          (label) => ({ label }),
        ),
      },
      {
        label: "PC Cases",
        children: ["Mini ITX", "Mid Tower", "Full Tower", "White", "Black"].map((label) => ({
          label,
        })),
      },
      {
        label: "Cooling",
        children: [
          {
            label: "Air Coolers",
            children: ["Single Tower", "Dual Tower"].map((label) => ({ label })),
          },
          {
            label: "Liquid Coolers",
            children: ["120mm", "240mm", "360mm"].map((label) => ({ label })),
          },
          { label: "Case Fans", children: ["RGB", "Non RGB"].map((label) => ({ label })) },
        ],
      },
      {
        label: "Monitors",
        children: ["1080p", "1440p", "4K", "Ultrawide", "Gaming", "Office"].map((label) => ({
          label,
        })),
      },
      {
        label: "Keyboards",
        children: ["Mechanical", "Membrane", "Wireless", "RGB", "60%", "TKL", "Full Size"].map(
          (label) => ({ label }),
        ),
      },
      {
        label: "Mouse",
        children: ["Gaming", "Productivity", "Wireless", "Lightweight"].map((label) => ({ label })),
      },
      {
        label: "Mouse Pads",
        children: ["Speed", "Control", "Extended"].map((label) => ({ label })),
      },
      { label: "Capture Cards", children: ["Internal", "External"].map((label) => ({ label })) },
      {
        label: "Networking",
        children: ["WiFi Cards", "Routers", "Mesh Systems", "Ethernet Switches"].map((label) => ({
          label,
        })),
      },
      {
        label: "Accessories",
        children: ["RGB Lights", "GPU Support Brackets", "Cable Extensions", "Thermal Paste"].map(
          (label) => ({ label }),
        ),
      },
    ],
  },
  {
    label: "Laptops",
    children: [
      "Gaming",
      "Ultrabooks",
      "Business",
      "Creator",
      "Student",
      "2-in-1",
      "Chromebooks",
    ].map((label) => ({ label })),
  },
  {
    label: "Smartphones",
    children: [
      {
        label: "Android",
        children: ["Samsung", "Google Pixel", "OnePlus", "Xiaomi", "Nothing", "Motorola"].map(
          (label) => ({ label }),
        ),
      },
      { label: "iPhone", children: ["Latest", "Previous Generation"].map((label) => ({ label })) },
      { label: "Cases", children: ["Silicone", "Rugged", "Wallet"].map((label) => ({ label })) },
      {
        label: "Screen Protectors",
        children: ["Tempered Glass", "Privacy", "Matte"].map((label) => ({ label })),
      },
      { label: "Camera Accessories", children: ["Lenses", "Gimbals"].map((label) => ({ label })) },
    ],
  },
  {
    label: "Gadgets",
    children: [
      {
        label: "Earbuds",
        children: ["AirPods", "ANC Earbuds", "Budget Earbuds", "Gaming Earbuds"].map((label) => ({
          label,
        })),
      },
      {
        label: "Headphones",
        children: ["Over Ear", "On Ear", "Wireless", "ANC", "Gaming"].map((label) => ({ label })),
      },
      {
        label: "Speakers",
        children: ["Bluetooth", "Smart Speakers", "Portable"].map((label) => ({ label })),
      },
      {
        label: "Smart Watches",
        children: ["Apple", "Samsung", "Garmin", "Budget"].map((label) => ({ label })),
      },
      { label: "Fitness Bands", children: ["Under ₹3000", "Premium"].map((label) => ({ label })) },
      { label: "Tablets", children: ["Android", "iPad", "Windows"].map((label) => ({ label })) },
      { label: "E-Readers", children: ["Kindle", "Kobo"].map((label) => ({ label })) },
      { label: "Smart Glasses", children: ["AR", "Audio Glasses"].map((label) => ({ label })) },
      { label: "VR", children: ["VR Headsets", "Accessories"].map((label) => ({ label })) },
      {
        label: "Power Banks",
        children: ["10000mAh", "20000mAh", "MagSafe"].map((label) => ({ label })),
      },
      {
        label: "Chargers",
        children: ["GaN", "USB-C", "Wireless", "MagSafe"].map((label) => ({ label })),
      },
      {
        label: "Cables",
        children: ["USB-C", "Lightning", "HDMI", "DisplayPort"].map((label) => ({ label })),
      },
      { label: "Phone Holders", children: ["Car", "Desk", "Bike"].map((label) => ({ label })) },
    ],
  },
  {
    label: "Gaming",
    children: ["Consoles", "Controllers", "Gaming Chairs", "Gaming Desks", "Streaming"].map(
      (label) => ({ label }),
    ),
  },
  {
    label: "Home",
    children: ["Smart Lighting", "Kitchen", "Cleaning", "Security", "Appliances"].map((label) => ({
      label,
    })),
  },
  {
    label: "Office",
    children: ["Printers", "Webcams", "Desk Setup", "Ergonomics", "Business Accessories"].map(
      (label) => ({ label }),
    ),
  },
];

export const productCategories = catalogTree.map((category) => category.label);

export function subcategoryOptions(category: string) {
  const node = catalogTree.find((item) => item.label === category);
  if (!node?.children) return [];
  const leaves: string[] = [];
  const visit = (items: FilterNode[], trail: string[]) =>
    items.forEach((item) => {
      const next = [...trail, item.label];
      if (item.children?.length) visit(item.children, next);
      else leaves.push(next.join(" · "));
    });
  visit(node.children, []);
  return leaves;
}
