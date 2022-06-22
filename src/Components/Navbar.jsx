import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const getCurrentPath = pathname => {
    console.log(pathname);
    const pathArr = pathname.split('/');

    console.log(pathArr[pathArr.length - 1]);
    if (pathArr[pathArr.length - 1] !== '') return pathArr[pathArr.length - 1];


    return "CryptoWiki";
}

export default function Navbar({ pathname }) {
    const [open, setOpen] = useState(false);

    const title = getCurrentPath(pathname);

    return (
        <div className="text-gray-700">
            <div className="flex justify-between md:justify-center text-orange-500 border-b-2 md:border-b-4 border-orange-500 pb-2">
                <h1 className="text-xl md:text-5xl text-center font-nunitoSansBlack uppercase ml-12 md:ml-0" id='heading'>
                    {title}
                </h1>
                <button className="md:hidden" onClick={() => setOpen(prevState => !prevState)}>
                    <FontAwesomeIcon icon={faBars} className="mr-4 text-xl font-black text-orange-500 cursor-pointer" />
                </button>
            </div>
            <nav className={`md:w-3/4 mx-auto mt-2 ${open ? 'h-0 overflow-hidden' : ''}`}>
                <ul className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-sm md:text-base font-nunitoSansBold uppercase pb-2 md:pb-0 border-b-4 md:border-b-0 border-b-orange-500 md:divide-x-4 md:divide-orange-500 mt-1">
                    <li className="block pt-1 text-orange-500 md:text-black md:hover:text-orange-500 md:border-l-4 border-orange-500 transition-colors duration-75 pl-3">
                        <Link to="/info/coins">
                            Coins
                        </Link>
                    </li>
                    <li className="block pt-1 pl-3 text-orange-500 md:text-black md:hover:text-orange-500 transition-colors duration-75">
                        <Link to="/info/exchanges">
                            Exchanges
                        </Link>
                    </li>
                    <li className="block pt-1 pl-3 text-orange-500 md:text-black md:hover:text-orange-500 transition-colors duration-75">
                        <Link to="/about">
                            About
                        </Link>
                    </li>
                    <li className="block pt-1 pl-3 text-orange-500 md:text-black md:hover:text-orange-500 transition-colors duration-75">
                        <a href='https://github.com/ajax484/cryptoWiki.git'>
                            Github
                        </a>
                    </li>
                </ul>
            </nav>
        </div>

    )
}
