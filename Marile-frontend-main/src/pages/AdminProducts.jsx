import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import EditProductModal from './EditProductModal';
import AddProductModal from './AddProductModal';
import { Plus } from 'lucide-react';
import '../styles/AdminProduct.css';
import api from '../api/axios';

const AdminProducts = () => {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ['Semua', 'protein', 'sayur', 'buah', 'lainnya'];

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data.data.products || []);
    } catch (err) {
      console.error('Gagal mengambil produk:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = activeFilter === 'Semua'
    ? products
    : products.filter(p => p.category === activeFilter);

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="products-container">
        <div className="page-header-row">
          <h2 className="page-title">Daftar <span>Produk</span></h2>
          <button className="btn-add-product" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={18} />
            Tambah Produk
          </button>
        </div>

        <div className="filter-group">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-pill ${activeFilter === cat ? 'active' : ''}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="product-card-table">
          <div className="table-row-header">
            <div className="col-info">Nama Produk</div>
            <div className="col-item">Kategori</div>
            <div className="col-item">Harga</div>
            <div className="col-item">Stock</div>
            <div className="col-action">Ubah</div>
          </div>

          <div className="table-body">
            {loading ? (
              <p style={{ padding: '20px' }}>Memuat produk...</p>
            ) : filteredProducts.length === 0 ? (
              <p style={{ padding: '20px', color: 'var(--muted)' }}>Belum ada produk.</p>
            ) : (
              filteredProducts.map((p) => (
                <div className="table-row-card" key={p.id}>
                  <div className="col-info">
                    <div className="product-img-wrapper">
                      <img
                        src={p.image_url ? `http://localhost:8000${p.image_url}` : '/assets/img/fish.svg'}
                        alt={p.name}
                      />
                    </div>
                    <span className="product-name-label">{p.name}</span>
                  </div>
                  <div className="col-item">{p.category}</div>
                  <div className="col-item">Rp {Number(p.price).toLocaleString('id-ID')}</div>
                  <div className={`col-item ${p.stock < 10 ? 'low-stock' : ''}`}>
                    {p.stock} {p.unit}
                  </div>
                  <div className="col-action">
                    <button className="edit-btn-outline" onClick={() => handleEditClick(p)}>Edit</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchProducts}
      />
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={selectedProduct}
        onSuccess={fetchProducts}
      />
    </AdminLayout>
  );
};

export default AdminProducts;