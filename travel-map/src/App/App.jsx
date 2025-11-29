import React, { useState, useRef, useEffect } from "react"
import { Globe, Shield, Info, AlertTriangle, Menu, X, ExternalLink, ChevronDown, ChevronUp, Languages } from "lucide-react";
import { useTranslation } from 'react-i18next';
import MapChart from "../MapChart/MapChart";
import About from "../About/About";
import "./App.css";
import "./i18n";


function NavLinks({ activeView, setActiveView, setSidebarOpen }) {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'he' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <>
      <button
        className={`nav-link ${activeView === 'map' ? 'active' : ''}`}
        onClick={() => {
          setActiveView('map');
          setSidebarOpen(false);
        }}
      >
        {t('nav.map')}
      </button>
      <button
        className={`nav-link ${activeView === 'about' ? 'active' : ''}`}
        onClick={() => {
          setActiveView('about');
          setSidebarOpen(false);
        }}
      >
        {t('nav.about')}
      </button>

      {/* Language Toggle */}
      <button
        className="nav-link lang-btn"
        onClick={() => {
          toggleLanguage();
          setSidebarOpen(false);
        }}
      >
        {i18n.language === 'en' ? 'עברית' : 'English'}
      </button>
    </>
  )
}

export default function App() {
  const { t, i18n } = useTranslation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("map");
  const [lastUpdate, setLastUpdate] = useState("");
  const [missingCountries, setMissingCountries] = useState([]);
  const [showMissing, setShowMissing] = useState(false);
  const [rawTimestamp, setRawTimestamp] = useState(null);
  const missingListRef = useRef(null);

  useEffect(() => {
    if (rawTimestamp) {
      const now = Date.now();
      const deltaMs = now - rawTimestamp * 1000;
      const deltaMins = deltaMs / 60000;

      let value, unitKey;

      if (deltaMins < 60) {
        value = Math.floor(deltaMins);
        unitKey = value === 1 ? 'time.min' : 'time.mins';
      } else if (deltaMins / 60 < 24) {
        const deltaHours = deltaMins / 60;
        value = Math.floor(deltaHours);
        unitKey = value === 1 ? 'time.hour' : 'time.hours';
      } else {
        const deltaDays = deltaMins / 60 / 24;
        value = Math.floor(deltaDays);
        unitKey = value === 1 ? 'time.day' : 'time.days';
      }

      const timeAgoPhrase = t('time.ago');
      const unitPhrase = t(unitKey);

      if (i18n.language === 'he') {
        if (value === 1) {
          setLastUpdate(`${timeAgoPhrase} ${unitPhrase}`);
        } else {
          setLastUpdate(`${timeAgoPhrase} ${value} ${unitPhrase}`);
        }
      } else {
        setLastUpdate(`${value} ${unitPhrase} ${timeAgoPhrase}`);
      }
    }
  }, [rawTimestamp, i18n.language, t, i18n]);

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
              <h1>
                {i18n.language === 'he' ? (
                  <>
                    <span className="highlight">{'אזהרות'}</span>
                    {'מסע'}
                  </>
                ) : (
                  <>
                    {'Azharot'}
                    <span className="highlight">{'Masah'}</span>
                  </>
                )}
              </h1>
            </div>
          </div>

          <nav className="nav-desktop">
            <NavLinks activeView={activeView} setActiveView={setActiveView} setSidebarOpen={setSidebarOpen} />
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
            {activeView === 'map' ? <MapChart onTimestamp={setRawTimestamp} onMissingCountries={setMissingCountries} /> : <About />}
          </section>

          {/* SIDEBAR */}
          <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
            <nav className="sidebar-section nav-mobile" dir={i18n.language === 'he' ? 'rtl' : 'ltr'}>
              <NavLinks activeView={activeView} setActiveView={setActiveView} setSidebarOpen={setSidebarOpen} />
            </nav>

            {/* Sidebar Content */}
            <div className="sidebar-content">
              <div dir={i18n.language === 'he' ? 'rtl' : 'ltr'}>
                {/* Legend Section */}
                <div className="sidebar-section">
                  <h2 className="sidebar-title">
                    <Shield size={18} className="highlight" />
                    {t('sidebar.advisory.title')}
                  </h2>
                  <div className="legend-grid">
                    <div className="legend-item">
                      <span className="dot" style={{ background: 'var(--level-1)' }}></span>
                      <span>{t('sidebar.advisory.level_1')}</span>
                    </div>
                    <div className="legend-item">
                      <span className="dot" style={{ background: 'var(--level-2)' }}></span>
                      <span>{t('sidebar.advisory.level_2')}</span>
                    </div>
                    <div className="legend-item">
                      <span className="dot" style={{ background: 'var(--level-3)' }}></span>
                      <span>{t('sidebar.advisory.level_3')}</span>
                    </div>
                    <div className="legend-item">
                      <span className="dot" style={{ background: 'var(--level-4)' }}></span>
                      <span>{t('sidebar.advisory.level_4')}</span>
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
                      <span className="tip-label">{t('sidebar.tip.label')}</span>
                      <span className="tip-message">{t('sidebar.tip.message')} <strong>gov.il</strong>.</span>
                    </div>
                  </div>
                </div>

                {/* Missing Countries Section */}
                <div className="sidebar-section">
                  <h2 className="sidebar-title">
                    <AlertTriangle size={18} className="highlight" />
                    {t('sidebar.missing.title')}
                  </h2>

                  <div className="missing-summary">
                    <p>{t('sidebar.missing.count_message', { count: missingCountries.length })}</p>
                    <button
                      className="toggle-missing-btn"
                      onClick={() => setShowMissing(!showMissing)}
                    >
                      {showMissing ? t('sidebar.missing.close_btn') : t('sidebar.missing.view_btn')}
                      {showMissing ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>

                  {showMissing && (
                    <div className="missing-list" ref={missingListRef}>
                      {missingCountries.map((country) => (
                        <div key={country.code} className="missing-country">
                          <a href={country.URL} target="_blank" rel="noopener noreferrer">
                            {i18n.language === 'he' ? country.HebrewName : country.EnglishName}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>


                {/* Last Update Section */}
                <div className="sidebar-section">
                  <div className="info-card">{t('sidebar.last_update')} {lastUpdate}</div>
                </div>
              </div>
            </div>

            {/* Sidebar Footer */}
            <div className="sidebar-footer" dir={i18n.language === 'he' ? 'rtl' : 'ltr'}>
              {t('sidebar.footer.created_by')} <a href="https://github.com/G-Yonathan" target="_blank" rel="noopener noreferrer">G-Yonathan</a><br />
            </div>
          </aside>
        </main>
      </div>
    </>
  );
}