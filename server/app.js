const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');

const app = express();
const port = 3000;

// ==================== Начальные данные (12 товаров) ====================
let products = [
  {
    id: nanoid(6), 
    name: 'iPhone 15 Pro',
    category: 'Смартфоны',
    description: 'Флагманский смартфон Apple с чипом A17 Pro, титановым корпусом и продвинутой камерой 48 Мп.',
    price: 89990,
    stock: 25,
    rating: 4.8,
    image: 'https://via.placeholder.com/300x200?text=iPhone+15+Pro',
  },
  {
    id: nanoid(6),
    name: 'Samsung Galaxy S24 Ultra',
    category: 'Смартфоны',
    description: 'Мощный смартфон Samsung с AI-функциями, S Pen и камерой 200 Мп.',
    price: 94990,
    stock: 18,
    rating: 4.7,
    image: 'https://via.placeholder.com/300x200?text=Galaxy+S24',
  },
  {
    id: nanoid(6),
    name: 'MacBook Air M3',
    category: 'Ноутбуки',
    description: 'Ультратонкий ноутбук Apple с чипом M3, 15-часовой батареей и Liquid Retina дисплеем.',
    price: 109990,
    stock: 12,
    rating: 4.9,
    image: 'https://via.placeholder.com/300x200?text=MacBook+Air+M3',
  },
  {
    id: nanoid(6),
    name: 'ASUS ROG Strix G16',
    category: 'Ноутбуки',
    description: 'Игровой ноутбук с RTX 4070, Intel Core i9 и дисплеем 240 Гц.',
    price: 149990,
    stock: 7,
    rating: 4.6,
    image: 'https://via.placeholder.com/300x200?text=ROG+Strix+G16',
  },
  {
    id: nanoid(6),
    name: 'Sony WH-1000XM5',
    category: 'Наушники',
    description: 'Беспроводные наушники с лучшим шумоподавлением, 30 часов автономности.',
    price: 29990,
    stock: 40,
    rating: 4.8,
    image: 'https://via.placeholder.com/300x200?text=Sony+WH-1000XM5',
  },
  {
    id: nanoid(6),
    name: 'AirPods Pro 2',
    category: 'Наушники',
    description: 'Компактные TWS-наушники Apple с активным шумоподавлением и адаптивным звуком.',
    price: 19990,
    stock: 55,
    rating: 4.7,
    image: 'https://via.placeholder.com/300x200?text=AirPods+Pro+2',
  },
  {
    id: nanoid(6),
    name: 'iPad Pro 12.9" M2',
    category: 'Планшеты',
    description: 'Профессиональный планшет с чипом M2, mini-LED дисплеем и поддержкой Apple Pencil 2.',
    price: 99990,
    stock: 10,
    rating: 4.9,
    image: 'https://via.placeholder.com/300x200?text=iPad+Pro+M2',
  },
  {
    id: nanoid(6),
    name: 'Samsung Galaxy Tab S9',
    category: 'Планшеты',
    description: 'Флагманский Android-планшет с AMOLED 120 Гц и Snapdragon 8 Gen 2.',
    price: 64990,
    stock: 15,
    rating: 4.5,
    image: 'https://via.placeholder.com/300x200?text=Galaxy+Tab+S9',
  },
  {
    id: nanoid(6),
    name: 'Apple Watch Ultra 2',
    category: 'Умные часы',
    description: 'Прочные смарт-часы для экстремальных условий с GPS, глубиномером и ярким дисплеем.',
    price: 59990,
    stock: 20,
    rating: 4.7,
    image: 'https://via.placeholder.com/300x200?text=Watch+Ultra+2',
  },
  {
    id: nanoid(6),
    name: 'Logitech MX Master 3S',
    category: 'Аксессуары',
    description: 'Эргономичная беспроводная мышь с тихими кликами и сенсором 8000 DPI.',
    price: 7990,
    stock: 80,
    rating: 4.8,
    image: 'https://via.placeholder.com/300x200?text=MX+Master+3S',
  },
  {
    id: nanoid(6),
    name: 'Keychron K2 Pro',
    category: 'Аксессуары',
    description: 'Механическая беспроводная клавиатура с горячей заменой переключателей и RGB-подсветкой.',
    price: 8490,
    stock: 35,
    rating: 4.6,
    image: 'https://via.placeholder.com/300x200?text=Keychron+K2+Pro',
  },
  {
    id: nanoid(6),
    name: 'JBL Charge 5',
    category: 'Аудио',
    description: 'Портативная Bluetooth-колонка с мощным басом, защитой IP67 и 20 часами работы.',
    price: 12990,
    stock: 45,
    rating: 4.5,
    image: 'https://via.placeholder.com/300x200?text=JBL+Charge+5',
  },
];

// ==================== Middleware ====================

// Парсинг JSON
app.use(express.json());

// CORS — разрешаем запросы с фронтенда (порт 3001)
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Логирование запросов
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      console.log('Body:', req.body);
    }
  });
  next();
});

// ==================== Вспомогательные функции ====================

function findProductOr404(id, res) {
  const product = products.find((p) => p.id === id);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return null;
  }
  return product;
}

// ==================== Маршруты API ====================

// POST /api/products — Создание нового товара
app.post('/api/products', (req, res) => {
  const { name, category, description, price, stock, rating, image } = req.body;

  if (!name || !category) {
    return res.status(400).json({ error: 'Name and category are required' });
  }

  const newProduct = {
    id: nanoid(6),
    name: name.trim(),
    category: category.trim(),
    description: (description || '').trim(),
    price: Number(price) || 0,
    stock: Number(stock) || 0,
    rating: Math.min(5, Math.max(0, Number(rating) || 0)),
    image: (image || '').trim() || 'https://via.placeholder.com/300x200?text=No+Image',
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// GET /api/products — Получение списка всех товаров
app.get('/api/products', (req, res) => {
  res.json(products);
});

// GET /api/products/:id — Получение товара по ID
app.get('/api/products/:id', (req, res) => {
  const product = findProductOr404(req.params.id, res);
  if (!product) return;
  res.json(product);
});

// PATCH /api/products/:id — Частичное обновление товара
app.patch('/api/products/:id', (req, res) => {
  const product = findProductOr404(req.params.id, res);
  if (!product) return;

  const { name, category, description, price, stock, rating, image } = req.body;

  // Проверка: хотя бы одно поле должно быть передано
  if (
    name === undefined &&
    category === undefined &&
    description === undefined &&
    price === undefined &&
    stock === undefined &&
    rating === undefined &&
    image === undefined
  ) {
    return res.status(400).json({ error: 'Nothing to update' });
  }

  if (name !== undefined) product.name = name.trim();
  if (category !== undefined) product.category = category.trim();
  if (description !== undefined) product.description = description.trim();
  if (price !== undefined) product.price = Number(price);
  if (stock !== undefined) product.stock = Number(stock);
  if (rating !== undefined) product.rating = Math.min(5, Math.max(0, Number(rating)));
  if (image !== undefined) product.image = image.trim();

  res.json(product);
});

// DELETE /api/products/:id — Удаление товара
app.delete('/api/products/:id', (req, res) => {
  const exists = products.some((p) => p.id === req.params.id);
  if (!exists) {
    return res.status(404).json({ error: 'Product not found' });
  }
  products = products.filter((p) => p.id !== req.params.id);
  res.status(204).send();
});

// ==================== Обработка ошибок ====================

// 404 для всех остальных маршрутов
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ==================== Запуск сервера ====================
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
