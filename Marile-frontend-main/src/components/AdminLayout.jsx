import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingBag, History, Settings, 
  LogOut, Search, Download, Bell, User, Menu, X, ClipboardList 
} from 'lucide-react';
import api from '../api/axios';

import '../styles/AdminLayout.css';
import '../styles/AdminDashboard.css';
import '../styles/AdminProduct.css';
import '../styles/AdminHistory.css';


const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      navigate('/login');
    }
  };

  const handleExport = async (type) => {
  try {
    const endpoint = type === 'pdf'
      ? '/export/sales/pdf?period=month'
      : '/export/sales/excel?period=month';

    const res = await api.get(endpoint, { responseType: 'blob' });

    const blob = new Blob([res.data], {
      type: type === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', type === 'pdf'
      ? 'laporan-penjualan.pdf'
      : 'laporan-penjualan.xlsx'
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    // Hanya tampilkan alert jika bukan karena IDM intercept
    if (err.code !== 'ERR_NETWORK') {
      alert('Gagal mengexport laporan!');
    }
    console.error('Export error:', err);
  } finally {
    setShowExportMenu(false);
  }
};

  return (
    <div className={`admin-wrapper ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      {/* SIDEBAR */}
      <aside className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
        <div className="logo">
          <img src="/assets/img/logo_marile.png" alt="Logo" className="logo-img" />
          <span className="logo-text">Marile</span>
          <button className="close-sidebar" onClick={toggleSidebar}>
            <X size={24} />
          </button>
        </div>

        <div className="nav-container">
          <div className="nav-label">Menu Utama</div>
          <Link 
            to="/admin" 
            className={`nav-item ${location.pathname === '/admin' ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          
          <Link 
            to="/admin/products" 
            className={`nav-item ${location.pathname === '/admin/products' ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <ShoppingBag size={20} />
            <span>Products</span>
          </Link>
          
          <Link 
            to="/admin/history" 
            className={`nav-item ${location.pathname === '/admin/history' ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <History size={20} />
            <span>History</span>
          </Link>

          <Link 
            to="/admin/inventory" 
            className={`nav-item ${location.pathname === '/admin/inventory' ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <ClipboardList size={20} />
            <span>Inventory</span>
          </Link>
        </div>

        <div className="nav-bottom">
          <div className="nav-label">Sistem</div>
          <Link 
            to="/admin/settings" 
            className={`nav-item ${location.pathname.startsWith('/admin/settings') ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <Settings size={20} />
            <span>Settings</span>
          </Link>
          
          <div className="nav-item logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Keluar</span>
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="main">
        <header className="topbar">
          <button className="hamburger-btn" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>

          <div className="search-wrap">
            <Search size={18} color="var(--muted)" />
            <input type="text" placeholder="Cari data..." />
          </div>

          <div className="topbar-actions">
            {location.pathname === '/admin' && (
              <div style={{ position: 'relative' }}>
                <button className="btn-export" onClick={() => setShowExportMenu(!showExportMenu)}>
                  <Download size={16} />
                  <span className="export-text">Export</span>
                </button>
                {showExportMenu && (
                  <div style={{
                    position: 'absolute', top: '110%', right: 0,
                    background: 'white', borderRadius: '10px', zIndex: 999,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.15)', overflow: 'hidden',
                    minWidth: '150px'
                  }}>
                    <button onClick={() => handleExport('excel')}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '10px 16px', width: '100%', border: 'none',
                        background: 'white', cursor: 'pointer', fontSize: '13px',
                        fontWeight: 600
                      }}>
                      📊 Export Excel
                    </button>
                    <button onClick={() => handleExport('pdf')}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '10px 16px', width: '100%', border: 'none',
                        background: 'white', cursor: 'pointer', fontSize: '13px',
                        fontWeight: 600
                      }}>
                      📄 Export PDF
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="icon-btn">
              <Bell size={20} />
              <span className="notif-dot"></span>
            </div>

            <div className="admin-profile-btn">
              <div className="admin-avatar">
                <User size={18} />
              </div>
              <span className="admin-name">Administrator</span>
            </div>
          </div>
        </header>

        <div className="content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;