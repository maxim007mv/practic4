import React, { useEffect, useState } from "react";
import "./ProductsPage.css";
import ProductsList from "../../components/ProductsList";
import ProductModal from "../../components/ProductModal";
import { api } from "../../api";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" | "edit"
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Все");

  // Загрузка товаров при монтировании
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
      alert("Ошибка загрузки товаров");
    } finally {
      setLoading(false);
    }
  };

  // Уникальные категории для фильтра
  const categories = ["Все", ...new Set(products.map((p) => p.category))];

  // Фильтрация товаров
  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      categoryFilter === "Все" || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const openCreate = () => {
    setModalMode("create");
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setModalMode("edit");
    setEditingProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Удалить товар?");
    if (!ok) return;
    try {
      await api.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Ошибка удаления товара");
    }
  };

  const handleSubmitModal = async (payload) => {
    try {
      if (modalMode === "create") {
        const newProduct = await api.createProduct(payload);
        setProducts((prev) => [...prev, newProduct]);
      } else {
        const updated = await api.updateProduct(payload.id, payload);
        setProducts((prev) =>
          prev.map((p) => (p.id === payload.id ? updated : p))
        );
      }
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Ошибка сохранения товара");
    }
  };

  return (
    <div className="page">
      {/* ===== Header ===== */}
      <header className="header">
        <div className="header__inner">
          <div className="brand">⚡ GadgetStore</div>
          <div className="header__right">React + Express</div>
        </div>
      </header>

      {/* ===== Main ===== */}
      <main className="main">
        <div className="container">
          {/* Панель инструментов */}
          <div className="toolbar">
            <h1 className="title">Каталог товаров</h1>
            <button className="btn btn--primary" onClick={openCreate}>
              + Добавить товар
            </button>
          </div>

          {/* Поиск и фильтр */}
          <div className="filters">
            <input
              className="input search-input"
              placeholder="🔍 Поиск по названию или описанию..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="input select-input"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Статистика */}
          <div className="stats">
            Показано: {filtered.length} из {products.length} товаров
          </div>

          {/* Список товаров */}
          {loading ? (
            <div className="empty">Загрузка...</div>
          ) : (
            <ProductsList
              products={filtered}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </main>

      {/* ===== Footer ===== */}
      <footer className="footer">
        <div className="footer__inner">
          © {new Date().getFullYear()} GadgetStore — Практическое занятие 4
        </div>
      </footer>

      {/* ===== Модалка ===== */}
      <ProductModal
        open={modalOpen}
        mode={modalMode}
        initialProduct={editingProduct}
        onClose={closeModal}
        onSubmit={handleSubmitModal}
      />
    </div>
  );
}
