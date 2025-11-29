import React, { useState, useRef, useEffect } from "react"
import { Globe, Shield, Info, AlertTriangle, Menu, X, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
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
  const [lastUpdate, setLastUpdate] = useState("");
  const [missingCountries, setMissingCountries] = useState([]);
  const [showMissing, setShowMissing] = useState(false);
  const missingListRef = useRef(null);

  const calcAndSetLastUpdate = (epochSeconds) => {
    const now = Date.now();
    const deltaMs = now - epochSeconds * 1000;
    const deltaMins = deltaMs / 60000;

    if (deltaMins < 60) {
      setLastUpdate(`${Math.floor(deltaMins)} min${Math.floor(deltaMins) !== 1 ? 's' : ''} ago`);
    } else if (deltaMins / 60 < 24) {
      const deltaHours = deltaMins / 60;
      setLastUpdate(`${Math.floor(deltaHours)} hour${Math.floor(deltaHours) !== 1 ? 's' : ''} ago`);
    } else {
      const deltaDays = deltaMins / 60 / 24;
      setLastUpdate(`${Math.floor(deltaDays)} day${Math.floor(deltaDays) !== 1 ? 's' : ''} ago`);
    }
  };

  useEffect(() => {
    if (showMissing && missingListRef.current) {
        missingListRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [showMissing]);

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
            {activeView === 'map' ? <MapChart onTimestamp={calcAndSetLastUpdate} onMissingCountries={setMissingCountries} /> : <About />}
          </section>

          {/* SIDEBAR */}
          <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>

            {/* Sidebar Content */}
            <div className="sidebar-content">
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

              {/* External Link Tip */}
              <div className="sidebar-section">
                <div className="tip-card">
                  <div className="tip-icon-box">
                    <ExternalLink size={16} />
                  </div>
                  <div className="tip-content">
                    <span className="tip-label">tip</span>
                    <span className="tip-message">Click on a country to view its official travel advisory on <strong>gov.il</strong>.</span>
                  </div>
                </div>
              </div>

              {/* Missing Countries Section */}
              <div className="sidebar-section">
                <h2 className="sidebar-title">
                  <AlertTriangle size={18} className="highlight" />
                  Missing Countries/Territories
                </h2>

                <div className="missing-summary">
                  <p>There are {missingCountries.length} countries/territories not visible on the map.</p>
                  <button
                    className="toggle-missing-btn"
                    onClick={() => setShowMissing(!showMissing)}
                  >
                    {showMissing ? 'Close' : 'View'}
                    {showMissing ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>

                {showMissing && (
                  <div className="missing-list" ref={missingListRef}>
                    {missingCountries.map((country) => (
                      <div key={country.code} className="info-card">
                        <a href={country.URL} target="_blank" rel="noopener noreferrer">
                          {country.EnglishName}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>


              {/* Last Update Section */}
              <div className="sidebar-section">
                <div className="info-card">Last update: {lastUpdate}</div>
              </div>
            </div>

            {/* Sidebar Footer */}
            <div className="sidebar-footer">
              Created by <a href="https://github.com/G-Yonathan" target="_blank" rel="noopener noreferrer">G-Yonathan</a><br />
            </div>

          </aside>
        </main>
      </div>
    </>
  );
}