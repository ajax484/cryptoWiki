import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';

export default function Pagination({ currPage, onPageChangeHandler, lastPage }) {
    function Paginate() {
        let pageButtons = [];

        if (lastPage < 4) {
            for (let x = 1; x <= lastPage; x++) {
                let num = x;
                pageButtons.push(
                    <li key={num}>
                        <button onClick={() => onPageChangeHandler(num)} className="ml-0 border border-orange-400 bg-orange-500 text-white py-2 px-3 leading-tight inline-flex disabled:bg-orange-600" disabled={num === currPage ? true : false}>
                            {num}
                        </button>
                    </li>
                )
            }
        } else {
            if (currPage < lastPage - 4) {
                for (let x = 0; x < 5; x++) {
                    let num = currPage - 2 + x;
                    if (num > 0) pageButtons.push(
                        <li key={num}>
                            <button onClick={() => onPageChangeHandler(num)} className="ml-0 border border-orange-400 bg-orange-500 text-white py-2 px-2 md:px-3 leading-tight inline-flex disabled:bg-orange-600" disabled={num === currPage ? true : false}>
                                {num}
                            </button>

                        </li>
                    )
                }

            } else {
                for (let x = 5; x >= 0; x--) {
                    let num = lastPage - x;
                    pageButtons.push(
                        <li key={num}>
                            <button onClick={() => onPageChangeHandler(num)} className="ml-0 border border-orange-400 bg-orange-500 text-white py-2 px-2 md:px-3 leading-tight inline-flex disabled:bg-orange-600" disabled={num === currPage ? true : false}>
                                {num}
                            </button>
                        </li>
                    )
                }
            }
        }

        return pageButtons;
    }

    return (
        <nav className="mx-auto w-fit max-w-full items-center mb-2 text-sm md:text-base">
            <ul className="inline-flex items-center -space-x-px mx-auto w-fit capitalize">
                <li>
                    <button onClick={() => onPageChangeHandler(1)} className="ml-0 rounded-l-lg border border-orange-400 bg-orange-500 text-white py-2 px-1 md:px-3 leading-tight inline-flex disabled:bg-orange-600" disabled={currPage < 4 ? true : false}>
                        Start
                    </button>
                </li>
                {currPage !== 1 &&
                    <li>
                        <button onClick={() => onPageChangeHandler(currPage => currPage !== 0 && currPage - 1)} className="ml-0 border border-orange-400 bg-orange-500 text-white py-2 px-2 md:px-3 leading-tight inline-flex">
                            <FontAwesomeIcon icon={faCaretLeft} size="lg" />
                        </button>
                    </li>
                }
                {<Paginate />}
                {currPage !== lastPage &&
                    <li>
                        <button onClick={() => onPageChangeHandler(currPage => currPage !== lastPage && currPage + 1)} className="ml-0 border border-orange-400 bg-orange-500 text-white py-2 px-2 md:px-3 leading-tight inline-flex">
                            <FontAwesomeIcon icon={faCaretRight} size="lg" />
                        </button>
                    </li>
                }
                <li>
                    <button onClick={() => onPageChangeHandler(lastPage)} className="ml-0 rounded-r-lg border border-orange-400 bg-orange-500 text-white py-2 px-2 md:px-3 leading-tight inline-flex disabled:bg-orange-600" disabled={currPage > lastPage - 3 ? true : false}>
                        End
                    </button>
                </li>
            </ul>
        </nav>
    )
}
