// components/Layout.js
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import CloudBackground from "./CloudBackground";
import styles from "../styles/Layout.module.css";

export default function Layout({ children }) {
  return (
    <div className={styles.layoutWrapper}>
      {/* Animated cloud layer — fixed, behind everything */}
      <CloudBackground />

      {/* Skip link - visible on focus for keyboard users (WCAG 2.4.1) */}
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>

      <Header />

      <main id="main-content" className={styles.mainContent} tabIndex={-1}>
        {children}
      </main>

      <Footer />
    </div>
  );
}
