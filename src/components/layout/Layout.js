import React from 'react'
import Header from './header/Header'
import Footer from './footer/Footer'
import ScrollToTop from './ScrollToTop'
import './Layout.css'

const Layout = ({ children }) => {
  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">דלג לתוכן</a>
      <ScrollToTop />
      <Header />
      <div id="main-content" className="app-main" tabIndex={-1}>
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default Layout;
