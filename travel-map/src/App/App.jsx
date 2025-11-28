import React, { useState } from "react"
import { Globe, Shield, Info, AlertTriangle, Menu, X } from "lucide-react";
import MapChart from "../MapChart/MapChart"
import About from "../About/About"
import "./App.css"

function NavLinks({ activeView, setActiveView }) {
  return (
    <>
      <button
        className={`nav-link ${activeView === 'map' ? 'active' : ''}`}
        onClick={() => setActiveView('map')}
      >
        Map
      </button>
      <button
        className={`nav-link ${activeView === 'about' ? 'active' : ''}`}
        onClick={() => setActiveView('about')}
      >
        About
      </button>
    </>
  )
}

export default function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('map');

  return (
    <>
      <div className="app-container">
        {/* HEADER */}
        <header className="app-header">
          <div className="brand" onClick={() => setActiveView('map')}>
            <div className="logo-box">
              <Globe size={24} />
            </div>
            <div className="title">
              <h1>Azharot<span className="highlight">Masah</span></h1>
            </div>
          </div>

          <nav className="nav-desktop">
            <NavLinks activeView={activeView} setActiveView={setActiveView} />
          </nav>

          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
        </header>

        {/* MAIN BODY */}
        <main className="main-content">

          {/* MAIN VIEW AREA */}
          <section className="main-view-area">
            {activeView === 'map' ? <MapChart /> : <About />}
          </section>

          {/* SIDEBAR */}
          <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>

            {/* Legend Section */}
            <nav className="sidebar-section nav-mobile">
              <NavLinks activeView={activeView} setActiveView={setActiveView} />
            </nav>

            {/* Legend Section */}
            <div className="sidebar-section">
              <h2 className="sidebar-title">
                <Shield size={18} className="highlight" />
                Advisory Levels
              </h2>
              <div className="legend-grid">
                <div className="legend-item">
                  <span className="dot" style={{ background: 'var(--level-1)' }}></span>
                  <span>Take Basic Precautionary Measures</span>
                </div>
                <div className="legend-item">
                  <span className="dot" style={{ background: 'var(--level-2)' }}></span>
                  <span>Take Increased Precautionary Measures</span>
                </div>
                <div className="legend-item">
                  <span className="dot" style={{ background: 'var(--level-3)' }}></span>
                  <span>Avoid Unnecessary Travel To This Destination</span>
                </div>
                <div className="legend-item">
                  <span className="dot" style={{ background: 'var(--level-4)' }}></span>
                  <span>Travel To This Destination Is Prohibited. Those Who Are Already There Must Leave Immediately.</span>
                </div>
              </div>
            </div>

            {/* Information Section */}
            <div className="sidebar-section">
              <div className="info-card">Last update: 2 hours ago (TODO)</div>
            </div>

            {/* Footer */}
            <div className="footer-note">
              Created by <a href="https://github.com/G-Yonathan" target="_blank">G-Yonathan</a><br />
            </div>

          </aside>
        </main>
      </div>
    </>
  );
}