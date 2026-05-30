import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import api from '../api/axios';

const CATEGORY_COLORS = {
  protein: '#FF0000',
  sayur: '#00FF00',
  buah: '#0000FF',
  lainnya: '#FFA500',
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [summaryRes, chartRes, topRes, snapshotRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/dashboard/revenue-chart?range=12m'),
          api.get('/dashboard/top-products?period=month'),
          api.get('/dashboard/snapshot'),
        ]);

        const summaryData = summaryRes.data.data;
        setSummary(summaryData);

        // Format chart data
        const rawChart = chartRes.data.data.data || [];
        const formatted = rawChart.map(d => ({
          name: d.month || d.date,
          val: d.revenue,
        }));
        setChartData(formatted);

        
        // Top products — gabungkan dengan data produk untuk dapat image_url
        const top = topRes.data.data.top_by_quantity || [];
        const productsRes = await api.get('/products');
        const allProducts = productsRes.data.data.products || [];

        const topWithImage = top.slice(0, 2).map(p => {
          const found = allProducts.find(prod => prod.id === p.product_id);
          return { ...p, image_url: found?.image_url || null };
        });
        setTopProducts(topWithImage);

        // Pie chart dari top products by revenue
        const byRevenue = topRes.data.data.top_by_revenue || [];
        const total = byRevenue.reduce((sum, p) => sum + p.total_revenue, 0);
        const pie = byRevenue.slice(0, 4).map((p, i) => ({
          name: p.product_name,
          value: total > 0 ? Math.round((p.total_revenue / total) * 100) : 0,
          color: Object.values(CATEGORY_COLORS)[i % 4],
        }));
        setPieData(pie);

        // Recent orders
        const recent = snapshotRes.data.data.recentTrasnactions || [];
        setRecentOrders(recent);

      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const formatRupiah = (num) =>
    'Rp ' + Number(num).toLocaleString('id-ID');

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <div className="page-title" style={{ marginBottom: '20px', fontWeight: 'bold' }}>
        Selamat datang, <span style={{ color: 'var(--teal)' }}>Admin</span> 👋
      </div>

      {loading ? (
        <p>Memuat data...</p>
      ) : (
        <>
          {/* Baris Atas: Statistik */}
          <div className="top-row">
            <div className="card">
              <div className="stat-label">Total Pesanan</div>
              <div className="stat-value">{summary?.total_transactions ?? 0}</div>
              <div className="stat-sub">Hari ini</div>
            </div>

            <div className="card">
              <div className="stat-label">Pendapatan</div>
              <div className="stat-value" style={{ fontSize: '28px' }}>
                {formatRupiah(summary?.total_revenue ?? 0)}
              </div>
              <div className="stat-sub">Hari ini</div>
            </div>

            <div className="card">
              <div className="stat-label">Kategori Produk</div>
              {pieData.length === 0 ? (
                <p style={{ fontSize: '12px', color: 'var(--muted)' }}>Belum ada data</p>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <PieChart width={100} height={100}>
                    <Pie data={pieData} innerRadius={30} outerRadius={45} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                  <div style={{ flex: 1 }}>
                    {pieData.map((item) => (
                      <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                        <span style={{ color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }}></span>
                          {item.name}
                        </span>
                        <span style={{ fontWeight: 800 }}>{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Baris Bawah */}
          <div className="bottom-row">
            <div className="left-col">
              {/* Grafik Penjualan */}
              <div className="card" style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h4 style={{ margin: 0 }}>Grafik Penjualan</h4>
                </div>
                <div style={{ width: '100%', height: 200 }}>
                  {chartData.length === 0 ? (
                    <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Belum ada data penjualan.</p>
                  ) : (
                    <ResponsiveContainer>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                        <Tooltip formatter={(val) => formatRupiah(val)} />
                        <Line type="monotone" dataKey="val" stroke="#2BAE96" strokeWidth={3}
                          dot={{ r: 5, fill: '#2BAE96', stroke: '#fff', strokeWidth: 2 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Produk Terlaris */}
              <div className="card">
                <h4>Produk Terlaris</h4>
                {topProducts.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--muted)' }}>Belum ada data.</p>
                ) : (
                  topProducts.map((p) => (
                    <div className="produk-item" key={p.product_id}>
                      <div className="produk-thumb">
                        <img src={p.image_url ? `http://localhost:8000${p.image_url}` : '/assets/img/fish.svg'} alt={p.product_name} />
                      </div>
                      <div style={{ flex: 1, fontWeight: 700 }}>{p.product_name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                        Terjual {p.total_qty_sold} {p.unit}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Pesanan Terbaru */}
            <div className="right-col">
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h4 style={{ margin: 0 }}>Pesanan Terbaru</h4>
                  <span style={{ color: 'var(--teal)', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                    onClick={() => navigate('/admin/history')}>
                    Lihat Semua
                  </span>
                </div>
                {recentOrders.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--muted)' }}>Belum ada pesanan.</p>
                ) : (
                  recentOrders.map((order) => (
                    <div className="pesanan-item" key={order.id}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700 }}>{order.invoice_no}</div>
                        <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                          {formatDate(order.created_at)}
                        </div>
                      </div>
                      <div style={{ fontWeight: 'bold', marginRight: '10px' }}>
                        {formatRupiah(order.total)}
                      </div>
                      <div style={{ fontSize: '11px', color: order.status === 'completed' ? 'green' : 'red', fontWeight: 700 }}>
                        {order.status === 'completed' ? 'Selesai' : order.status}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;