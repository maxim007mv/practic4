import React from "react";

export default function ProductItem({ product, onEdit, onDelete }) {
  // Отображение звёзд рейтинга
  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    const stars = [];
    for (let i = 0; i < full; i++) stars.push("★");
    if (half) stars.push("☆");
    return stars.join("");
  };

  return (
    <div className="card">
      <div className="card__image-wrap">
        <img
          className="card__image"
          src={product.image}
          alt={product.name}
          loading="lazy"
        />
        <span className="card__category">{product.category}</span>
      </div>

      <div className="card__body">
        <h3 className="card__title">{product.name}</h3>
        <p className="card__desc">{product.description}</p>

        <div className="card__meta">
          <span className="card__price">
            {product.price.toLocaleString("ru-RU")} ₽
          </span>
          <span className="card__rating" title={`Рейтинг: ${product.rating}`}>
            {renderStars(product.rating)} {product.rating}
          </span>
        </div>

        <div className="card__stock">
          Склад:{" "}
          <span className={product.stock > 0 ? "in-stock" : "out-of-stock"}>
            {product.stock > 0 ? `${product.stock} шт.` : "Нет в наличии"}
          </span>
        </div>
      </div>

      <div className="card__actions">
        <button className="btn" onClick={() => onEdit(product)}>
          ✎ Редактировать
        </button>
        <button
          className="btn btn--danger"
          onClick={() => onDelete(product.id)}
        >
          ✕ Удалить
        </button>
      </div>
    </div>
  );
}
