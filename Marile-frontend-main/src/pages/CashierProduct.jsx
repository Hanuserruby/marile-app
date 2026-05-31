import React, { useState, useEffect } from 'react';
import CashierLayout from '../components/CashierLayout';
import '../styles/CashierProduct.css';
import api from '../api/axios';

const CashierProducts = () => {
  const API_URL = process.env.REACT_APP_API_BASEURL;
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products')
      .then(res => setProducts(res.data.data.products || []))
      .catch(err => console.error('Gagal mengambil produk:', err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['Semua', 'protein', 'sayur', 'buah', 'lainnya'];

  const filteredProducts = activeFilter === 'Semua'
    ? products
    : products.filter(p => p.category === activeFilter);

  return (
    <CashierLayout>
      <div className="cashier-page-content">
        <div className="page-header">
          <h2>Daftar <span>Produk</span></h2>
        </div>

        <div className="filters-container">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="product-table-wrapper">
          <div className="teal-table-header">
            <div className="col-name">Nama Produk</div>
            <div className="col-cat">Kategori</div>
            <div className="col-price">Harga</div>
            <div className="col-stock">Stock</div>
            <div className="col-status">Status</div>
          </div>

          <div className="table-scroll-container">
            {loading ? (
              <p style={{ padding: '20px' }}>Memuat produk...</p>
            ) : filteredProducts.length === 0 ? (
              <p style={{ padding: '20px', color: 'var(--muted)' }}>Belum ada produk.</p>
            ) : (
              filteredProducts.map((p) => (
                <div className="product-list-row" key={p.id}>
                  <div className="col-name">
                    <div className="img-thumbnail">
                      <img src={
                          p.image_url
                            ? `${API_URL}${p.image_url}`
                            : "/assets/img/fish.svg"
                        } alt={p.name} />
                    </div>
                    <span className="p-text-bold">{p.name}</span>
                  </div>
                  <div className="col-cat p-text-medium">{p.category}</div>
                  <div className="col-price p-text-bold">
                    Rp {Number(p.price).toLocaleString('id-ID')}
                  </div>
                  <div className={`col-stock p-text-bold ${p.stock < 10 ? 'low-stock-text' : ''}`}>
                    {p.stock} {p.unit}
                  </div>
                  <div className="col-status p-text-bold">
                    {p.stock > 0 ? (
                      <span className="status-available">Tersedia</span>
                    ) : (
                      <span className="status-empty">Habis</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </CashierLayout>
  );
};

export default CashierProducts;