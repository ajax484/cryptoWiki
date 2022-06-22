//import statements
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Spinner } from 'flowbite-react';
import { useGetCoinsList } from '../Utils/Hooks';
import { Pagination } from '../Components';
import { debounce, paginateArray } from '../Utils/functions';

function isWordValid(validLetters, attemptedWord) {
    const attemptedWordSplitted = attemptedWord.split("");
    return attemptedWordSplitted.every(attemptedLetter => validLetters.includes(attemptedLetter));
}

export default function Coins() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchError, setSearchError] = useState(false);
    const [currPage, setCurrPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [paginatedCoinsList, updatePaginatedCoinsList] = useState([]);
    const { coinsList, loading, error } = useGetCoinsList();
    const searchEl = useRef('');

    useEffect(() => {
        coinsList && updatePaginatedCoinsList(paginateArray(coinsList));
    }, [coinsList]);

    console.log(searchError);

    useEffect(() => {
        setLastPage(paginatedCoinsList.length - 1);
    }, [paginatedCoinsList]);

    useEffect(() => {
        let filteredList = coinsList;
        setSearchError(false);

        if (searchTerm !== '') {
            filteredList = filteredList.filter((coin) => isWordValid(coin.name.toLowerCase(), searchTerm.toLowerCase()));
        }

        if (paginateArray(filteredList).length > 1) {
            updatePaginatedCoinsList(paginateArray(filteredList));
        } else {
            setSearchError(true)
        }
    }, [searchTerm]);

    const onPageChange = (page) => setCurrPage(page);

    const inputChangeHandler = debounce(() => setSearchTerm(searchEl.current.value));

    return (
        <section className="space-y-8">
            {
                coinsList &&
                <>
                    there are {coinsList.length} active cryptoCoins

                    <div className="flex justify-center items-end space-x-4">
                        <label htmlFor="search-input" className="form-label inline-block text-gray-700">Search:</label>
                        <input
                            type="text"
                            className="block text-gray-700 px-2 py-1 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-orange-500 focus:outline-none"
                            id="search-input"
                            placeholder="Enter Text..."
                            onChange={inputChangeHandler}
                            ref={searchEl}
                        />
                    </div>

                    {
                        loading &&
                        <div className="h-full flex justify-center items-center">
                            <Spinner
                                aria-label="loading"
                                size='xl'
                            />
                        </div>
                    }

                    {
                        searchError &&
                        <div>
                            search returned no results
                        </div>
                    }

                    {
                        paginatedCoinsList.length > 0 ?
                            <>
                                <Pagination currPage={currPage} lastPage={lastPage} onPageChangeHandler={onPageChange} />

                                <div className="w-full overflow-x-auto">
                                    <table className="w-full text-sm md:text-base border-4">
                                        <thead className='border-b-4 bg-orange-600 text-left text-white text-lg'>
                                            <tr>
                                                <th scope='col' className="px-4 pt-4 border-r-4">
                                                    Name
                                                </th>
                                                <th scope='col' className=" px-4 pt-4">
                                                    Symbol
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="text-white">
                                            {
                                                paginatedCoinsList[currPage].map((el, index) =>
                                                    <tr key={el.id} className={`border-b-4 ${index % 2 !== 0 ? 'bg-orange-500' : 'bg-orange-400'}`}>
                                                        <td className="px-4 pt-4 whitespace-nowrap overflow-hidden border-r-4">
                                                            <Link to={`coin/${el.id}`}>
                                                                {el.name}
                                                            </Link>

                                                        </td>
                                                        <td className="px-4 pt-4 whitespace-nowrap font-nunitoSansBlack">
                                                            <em>{el.symbol}</em>
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>

                                    </table>
                                </div>


                                <Pagination currPage={currPage} lastPage={lastPage} onPageChangeHandler={onPageChange} />
                            </>
                            :
                            <div>no results</div>
                    }
                </>
            }

            {
                error && <div>error: {error.message}</div>
            }
        </section >
    )
}

