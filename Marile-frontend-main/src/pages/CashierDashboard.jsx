import React, { useState, useEffect } from 'react';
import CashierLayout from '../components/CashierLayout';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import '../styles/CashierDashboard.css';
import CashierPayment from '../components/CashierPayment';
import api from '../api/axios';

const CashierDashboard = () => {
  const API_URL = process.env.REACT_APP_API_BASEURL;
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [loading, setLoading] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

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

  const categories = ['Semua', 'protein', 'sayur', 'buah', 'lainnya'];

  const addToCart = (product) => {
    if (product.stock <= 0) return;
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) return prevCart;
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            if (delta > 0 && newQty > item.stock) return item;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const total = subtotal;

  return (
    <CashierLayout>
      <div className="pos-container">
        <div className="pos-catalog">
          <div className="category-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`tab-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="pos-grid">
            {loading ? (
              <p style={{ padding: '20px' }}>Memuat produk...</p>
            ) : (
              products
                .filter((p) => activeCategory === 'Semua' || p.category === activeCategory)
                .map((product) => (
                  <div
                    className="product-pos-card"
                    key={product.id}
                    onClick={() => addToCart(product)}
                    style={{ opacity: product.stock <= 0 ? 0.5 : 1 }}
                  >
                    <div className="img-wrapper">
                      <img
                        src={
                          product.image_url
                            ? `${API_URL}${product.image_url}`
                            : "/assets/img/fish.svg"
                        }
                        alt={product.name}
                      />
                    </div>
                    <div className="product-pos-info">
                      <h4>{product.name}</h4>
                      <p className="price-text">
                        Rp {Number(product.price).toLocaleString('id-ID')}
                      </p>
                      <div className={`stock-info ${product.stock <= 5 ? 'low-stock' : ''}`}>
                        Stok: {product.stock} {product.unit}
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        <div className="pos-cart">
          <div className="cart-header-title">
            <ShoppingCart size={20} />
            <h3>SHOPPING CART</h3>
          </div>

          <div className="cart-items">
            {cart.length === 0 ? (
              <p className="empty-msg">Keranjang masih kosong</p>
            ) : (
              cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img
                    src={
                          item.image_url
                            ? `${API_URL}${item.image_url}`
                            : "/assets/img/fish.svg"
                        }
                    alt={item.name}
                  />
                  <div className="item-detail">
                    <h5>{item.name}</h5>
                    <p>Rp {(item.price * item.qty).toLocaleString('id-ID')}</p>
                  </div>
                  <div className="qty-control">
                    <button onClick={() => updateQty(item.id, -1)}>
                      <Minus size={14} />
                    </button>
                    <span>{item.qty}</span>
                    <button className="plus" onClick={() => updateQty(item.id, 1)}>
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="cart-summary">
            <div className="summary-line">
              <span>Subtotal</span>
              <span>Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="summary-line total">
              <span>Total</span>
              <span>Rp {total.toLocaleString('id-ID')}</span>
            </div>
            <button
              className="checkout-btn"
              disabled={cart.length === 0}
              onClick={() => setIsPaymentModalOpen(true)}
            >
              LANJUTKAN KE PEMBAYARAN
            </button>
          </div>
        </div>
      </div>

      <CashierPayment
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={total}
        cartItems={cart}
        onComplete={(kembalian) => {
          setCart([]);
          setIsPaymentModalOpen(false);
          fetchProducts(); // refresh stok setelah transaksi
        }}
      />
    </CashierLayout>
  );
};

export default CashierDashboard;