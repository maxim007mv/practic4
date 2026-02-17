import React, { useEffect, useState } from "react";

export default function ProductModal({
  open,
  mode,
  initialProduct,
  onClose,
  onSubmit,
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [rating, setRating] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(initialProduct?.name ?? "");
    setCategory(initialProduct?.category ?? "");
    setDescription(initialProduct?.description ?? "");
    setPrice(initialProduct?.price != null ? String(initialProduct.price) : "");
    setStock(initialProduct?.stock != null ? String(initialProduct.stock) : "");
    setRating(
      initialProduct?.rating != null ? String(initialProduct.rating) : ""
    );
    setImage(initialProduct?.image ?? "");
  }, [open, initialProduct]);

  if (!open) return null;

  const title =
    mode === "edit" ? "Редактирование товара" : "Добавление товара";

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedCategory = category.trim();

    if (!trimmedName) {
      alert("Введите название товара");
      return;
    }
    if (!trimmedCategory) {
      alert("Введите категорию");
      return;
    }

    const parsedPrice = Number(price);
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      alert("Введите корректную цену (≥ 0)");
      return;
    }

    const parsedStock = Number(stock);
    if (!Number.isFinite(parsedStock) || parsedStock < 0) {
      alert("Введите корректное количество на складе (≥ 0)");
      return;
    }

    const parsedRating = Number(rating);
    if (!Number.isFinite(parsedRating) || parsedRating < 0 || parsedRating > 5) {
      alert("Введите корректный рейтинг (0–5)");
      return;
    }

    onSubmit({
      id: initialProduct?.id,
      name: trimmedName,
      category: trimmedCategory,
      description: description.trim(),
      price: parsedPrice,
      stock: parsedStock,
      rating: parsedRating,
      image: image.trim(),
    });
  };

  return (
    <div className="backdrop" onMouseDown={onClose}>
      <div
        className="modal"
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal__header">
          <div className="modal__title">{title}</div>
          <button className="iconBtn" onClick={onClose} aria-label="Закрыть">
            ✕
          </button>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <label className="label">
            Название *
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например, iPhone 15 Pro"
              autoFocus
            />
          </label>

          <label className="label">
            Категория *
            <input
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Например, Смартфоны"
            />
          </label>

          <label className="label">
            Описание
            <textarea
              className="input input--textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Краткое описание товара"
              rows={3}
            />
          </label>

          <div className="form__row">
            <label className="label">
              Цена (₽) *
              <input
                className="input"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                inputMode="numeric"
              />
            </label>

            <label className="label">
              На складе *
              <input
                className="input"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="0"
                inputMode="numeric"
              />
            </label>

            <label className="label">
              Рейтинг (0–5)
              <input
                className="input"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                placeholder="4.5"
                inputMode="decimal"
              />
            </label>
          </div>

          <label className="label">
            Ссылка на фото
            <input
              className="input"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/photo.jpg"
            />
          </label>

          <div className="modal__footer">
            <button type="button" className="btn" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn--primary">
              {mode === "edit" ? "Сохранить" : "Добавить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
