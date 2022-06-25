import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './Components';
import { Home, NoPage, Info, Coins, Coin, Exchanges, About } from './Pages';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Header />
      <main className="px-2 md:px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/info" element={<Info />}>
            <Route path="coins" element={<Coins />} />
            <Route path="coins/coin/:coin" element={<Coin />} />
            {/* <Route path="exchanges" element={<Exchanges />} /> */}
          </Route>
          {/* <Route path="/about" element={<About />} /> */}
          <Route path="*" element={<NoPage />} />
        </Routes>
      </main>
      {/* <Footer /> */}
    </Router>
  </React.StrictMode>
);

