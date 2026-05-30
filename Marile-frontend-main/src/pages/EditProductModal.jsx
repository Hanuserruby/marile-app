import React, { useState, useEffect, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import '../styles/AdminProduct.css';
import api from '../api/axios';

const EditProductModal = ({ isOpen, onClose, product, onSuccess }) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '', category: '', price: '', unit: 'kg',
  });
  const [restockQty, setRestockQty] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        unit: product.unit || 'kg',
      });
      setPreview(product.image_url || '/assets/img/fish.svg');
      setImageFile(null);
      setRestockQty('');
      setError('');
      setSuccessMsg('');
    }
  }, [product]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Simpan perubahan info produk (nama, harga, kategori)
  const handleSubmitInfo = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setSuccessMsg('');
  try {
    const data = new FormData();
    data.append('name', formData.name);
    data.append('category', formData.category);
    data.append('price', Number(formData.price));
    data.append('unit', formData.unit);
    if (imageFile) data.append('image', imageFile);

    await api.put(`/products/${product.id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setSuccessMsg('Informasi produk berhasil diperbarui!');
    onSuccess();
  } catch (err) {
    setError(err.response?.data?.message || 'Gagal mengupdate produk');
  } finally {
    setLoading(false);
  }
};

  // Tambah stok via restock
  const handleRestock = async () => {
    if (!restockQty || Number(restockQty) <= 0) {
      setError('Masukkan jumlah stok yang valid!');
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      await api.post('/inventory/restock', {
        product_id: product.id,
        quantity: Number(restockQty),
        note: `Restock via admin panel`,
      });
      setSuccessMsg(`Berhasil tambah stok ${restockQty} ${formData.unit}!`);
      setRestockQty('');
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal restock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Edit <span>Produk</span></h3>
          <button onClick={onClose} className="icon-btn"><X size={20} /></button>
        </div>

        {error && <p style={{ color: 'red', fontSize: '13px', padding: '0 10px' }}>{error}</p>}
        {successMsg && <p style={{ color: 'green', fontSize: '13px', padding: '0 10px' }}>{successMsg}</p>}

        <form onSubmit={handleSubmitInfo}>
          <div className="image-upload-section">
            <div className="image-preview-box">
              {preview ? <img src={preview} alt="Preview" /> : <Upload size={40} color="#ccc" />}
            </div>
            <input type="file" accept="image/*" ref={fileInputRef}
              onChange={handleImageChange} style={{ display: 'none' }} />
            <button type="button" className="btn-upload-trigger"
              onClick={() => fileInputRef.current.click()}>
              <Upload size={16} /> Ganti Foto
            </button>
          </div>

          <div className="form-grid">
            <div className="input-group">
              <label>Nama Produk</label>
              <input type="text" value={formData.name} required
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Kategori</label>
              <select value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                <option value="protein">Protein</option>
                <option value="sayur">Sayur</option>
                <option value="buah">Buah</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
            <div className="input-group">
              <label>Harga (Rp)</label>
              <input type="number" value={formData.price} required
                onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Satuan</label>
              <select value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}>
                <option value="kg">kg</option>
                <option value="pcs">pcs</option>
                <option value="ekor">ekor</option>
                <option value="ikat">ikat</option>
              </select>
            </div>
          </div>

          {/* BAGIAN RESTOCK */}
          <div style={{ padding: '0 10px', marginTop: '10px' }}>
            <label style={{ fontWeight: 700, fontSize: '13px' }}>
              Tambah Stok (Stok saat ini: {product?.stock} {formData.unit})
            </label>
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <input
                type="number"
                value={restockQty}
                onChange={(e) => setRestockQty(e.target.value)}
                placeholder="Jumlah tambahan"
                style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1.5px solid var(--border)' }}
              />
              <button type="button" onClick={handleRestock} disabled={loading}
                style={{ background: 'var(--teal)', color: 'white', border: 'none',
                  padding: '8px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                Tambah
              </button>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-cancel">Batal</button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;