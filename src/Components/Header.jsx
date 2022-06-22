import React from 'react';
import { useLocation, Link } from 'react-router-dom';

import { CryptoWiki } from '../Assets/img';
import Navbar from './Navbar';

export default function Header() {
  const location = useLocation();

  return (
    <header className="mt-4 mb-6 md:mb-12">
      <div className="[clip-path:polygon(0px_0px,_0px_100%,_100%_0px);] h-16 w-16 md:h-32 md:w-32 bg-gradient-to-tr from-orange-400 via-orange-500 to-orange-600 px-2 py-2 absolute top-0 left-0">
        <Link to="/">
          <img src={CryptoWiki} alt="" className="h-8 w-8 md:h-16 md:w-16" />
        </Link>
      </div>
      <Navbar pathname={location.pathname} />
    </header>
  )
}
