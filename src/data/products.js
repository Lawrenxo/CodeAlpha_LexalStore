// Lexal Tech Store seed catalogue — real photos in public/img/products/*.jpg
// (Pinterest-style tech aesthetic, royalty-free Unsplash equivalents — see public/img/ATTRIBUTION.md).
// To use your own Pinterest downloads, drop files into public/img/products/ and update imageUrl here.

export const seedProducts = [
  {
    name: "Smart Watch Series 9",
    imageUrl: "/img/products/watch.jpg",
    description: "AMOLED display, heart-rate + SpO2 tracking, 14-day battery, 5ATM water resistance. Your health and notifications on your wrist.",
    price: 299.99, category: "Wearables", rating: 4.8, reviewsCount: 2100, stock: 40, badge: "Trending"
  },
  {
    name: "Wireless Earbuds Pro",
    imageUrl: "/img/products/earbuds.jpg",
    description: "Active noise cancellation, 36h charging case, low-latency gaming mode, crystal-clear calls with 6 mics.",
    price: 129.99, category: "Audio", rating: 4.7, reviewsCount: 1600, stock: 80, badge: "Top Deal"
  },
  {
    name: "Portable Bluetooth Speaker",
    imageUrl: "/img/products/speaker.jpg",
    description: "360° sound, deep bass, IPX7 waterproof, 24h playtime. Built for outdoors and house parties.",
    price: 59.99, category: "Audio", rating: 4.6, reviewsCount: 1200, stock: 120, badge: ""
  },
  {
    name: "3-in-1 Wireless Charger",
    imageUrl: "/img/products/charger.jpg",
    description: "Charge phone, watch and buds at once. 15W fast charge, MagSafe compatible, temperature control.",
    price: 49.99, category: "Accessories", rating: 4.5, reviewsCount: 980, stock: 150, badge: ""
  },
  {
    name: "4K Camera Drone",
    imageUrl: "/img/products/drone.jpg",
    description: "4K/60fps gimbal camera, 34-min flight, 10km transmission, obstacle avoidance, follow-me modes.",
    price: 499.99, category: "Gadgets", rating: 4.9, reviewsCount: 1800, stock: 25, badge: "New"
  },
  {
    name: "Smartphone Gimbal",
    imageUrl: "/img/products/gimbal.jpg",
    description: "3-axis stabilisation, AI face tracking, 18h battery, foldable for travel. Buttery-smooth video.",
    price: 89.99, category: "Accessories", rating: 4.4, reviewsCount: 760, stock: 90, badge: ""
  },
  {
    name: "Aura Smart Speaker",
    imageUrl: "/img/products/smartspeaker.jpg",
    description: "Room-filling sound with voice assistant, smart-home hub built in, multi-room pairing.",
    price: 99.99, category: "Smart Home", rating: 4.6, reviewsCount: 840, stock: 70, badge: ""
  },
  {
    name: "Nebula Mechanical Keyboard",
    imageUrl: "/img/products/keyboard.jpg",
    description: "Hot-swappable switches, PBT keycaps, RGB, tri-mode (BT/2.4G/USB-C). For work and play.",
    price: 119.00, category: "Gadgets", rating: 4.7, reviewsCount: 640, stock: 60, badge: "Sale"
  },
  {
    name: "Volt Power Bank 20K",
    imageUrl: "/img/products/powerbank.jpg",
    description: "20000mAh, 65W PD fast charge, charges laptop + phone together, airline-safe.",
    price: 45.99, category: "Accessories", rating: 4.5, reviewsCount: 2100, stock: 200, badge: ""
  },
  {
    name: "Halo Smart Bulb (4-pack)",
    imageUrl: "/img/products/bulb.jpg",
    description: "16M colours, schedules, music sync, works with Alexa/Google. No hub required.",
    price: 39.99, category: "Smart Home", rating: 4.3, reviewsCount: 520, stock: 180, badge: ""
  },
  {
    name: "Pulse Fitness Band",
    imageUrl: "/img/products/band.jpg",
    description: "Sleep + workout tracking, 21-day battery, 100+ sport modes, lightweight at 18g.",
    price: 49.00, category: "Wearables", rating: 4.4, reviewsCount: 930, stock: 110, badge: ""
  },
  {
    name: "EchoPods Max Headphones",
    imageUrl: "/img/products/headphones.jpg",
    description: "Flagship over-ears: adaptive ANC, 40h battery, LDAC Hi-Res audio, multipoint connection.",
    price: 199.99, category: "Audio", rating: 4.8, reviewsCount: 1340, stock: 55, badge: "Trending"
  }
];

export const categories = ["Gadgets", "Smart Home", "Audio", "Wearables", "Accessories", "Sale"];

export const ideas = [
  { title: "Tech Setup Ideas", count: 128, image: "setup" },
  { title: "Travel Tech Essentials", count: 96, image: "travel" },
  { title: "Smart Home Inspiration", count: 74, image: "home" },
  { title: "Gaming Gear", count: 155, image: "gaming" },
  { title: "Minimal Desk Setup", count: 87, image: "desk" }
];

