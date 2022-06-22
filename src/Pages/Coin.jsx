import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { VictoryAxis, VictoryChart, VictoryLine, VictoryTheme, VictoryTooltip, VictoryVoronoiContainer } from 'victory';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown, faRightLeft } from '@fortawesome/free-solid-svg-icons';
import { useGetCoinData, useGetCoinMarketChart } from '../Utils/Hooks';
import { convertToObjectArray, dateToString, dateToTime, debounce, formatDate, isNotEmptyObject, round, toDollar } from '../Utils/functions';


export default function Coin() {
    let params = useParams();

    return (
        <section className="space-y-12">
            <CoinInfo coinId={params.coin} />
            <CoinMarketChart coinId={params.coin} />
        </section>
    )
}

function CoinInfo({ coinId }) {
    const { coinData, coinMarketData, loading, error } = useGetCoinData(coinId);
    const { id, name, symbol, block_time_in_minutes: blockTime, categories, coingecko_rank: coinGeckoRank, coingecko_score: coinGeckoScore, community_data: communityData, community_score: communityScore, country_origin: countryOrigin, description, genesis_date: genesisDate, hashing_algorithm: hashingAlgo, image, links, market_cap_rank: marketCapRank, platforms, market_data: marketData } = coinData;
    // isNotEmptyObject(coinData) && console.log(marketData.current_price);

    const isPercentChange24hPositive = isNotEmptyObject(coinData) && (marketData.price_change_24h > 0);

    const changeInADay = isNotEmptyObject(coinData) && (coinMarketData[0].current_price - coinMarketData[0].low_24h) / (coinMarketData[0].high_24h - coinMarketData[0].low_24h) * 100;
    // isNotEmptyObject(coinData) && console.log(communityData);
    // isNotEmptyObject(coinData) && console.log(platforms);
    // isNotEmptyObject(coinData) && console.log(links);
    // isNotEmptyObject(coinData) && console.log(coinData);
    // isNotEmptyObject(coinData) && console.log(...coinMarketData);

    let htmlDescription = isNotEmptyObject(coinData) && description.en;

    return (
        <>
            {
                loading && <div>Loading...</div>
            }
            {
                isNotEmptyObject(coinData) &&
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-4">
                        <div className="lg:col-span-8 flex flex-col space-y-2 text-sm">
                            <span className="bg-orange-100 text-orange-500 font-semibold mr-2 px-2.5 py-0.5 rounded-md w-fit font-nunitoSansBold">
                                Rank #{coinGeckoRank}
                            </span>

                            <div className=" flex space-x-4 items-center">
                                <img src={image.small} alt={name} className="h-10" />
                                <h1 className="font-nunitoSansBold text-lg md:text-xl">{name}(<span className="uppercase">{symbol}</span>)</h1>
                            </div>

                            <div className="flex space-x-2 items-center font-nunitoSansExtraBold">
                                <h2 className="text-2xl md:text-3xl">
                                    ${coinMarketData[0].current_price ? round(coinMarketData[0].current_price, 4) : 'N/A'}
                                </h2>
                                <span className={`text-lg md:text-xl flex items-center space-x-2 ${isPercentChange24hPositive ? 'text-green-500' : 'text-red-500'}`}>
                                    {isPercentChange24hPositive ? <FontAwesomeIcon icon={faCaretUp} /> : <FontAwesomeIcon icon={faCaretDown} />}{round(coinMarketData[0].market_cap_change_percentage_24h, 2)}%
                                </span>
                            </div>

                            <div className="w-full lg:w-1/2 space-y-2 font-nunitoSansBold mb-2 pr-4">
                                <div className="w-full bg-orange-100 rounded-full h-1.5 lg:h-2.5">
                                    <div className="bg-orange-500 h-1.5 lg:h-2.5 rounded-full" style={{ width: `${changeInADay}%` }}></div>
                                </div>
                                <div className="flex justify-between text-xs md:text-sm">
                                    <span>${coinMarketData[0].low_24h ? round(coinMarketData[0].low_24h, 4) : 'N/A'}</span>
                                    <span>24h Range</span>
                                    <span>${coinMarketData[0].high_24h ? round(coinMarketData[0].high_24h, 4) : 'N/A'}</span>
                                </div>
                            </div>

                            <div className="max-w-full grid grid-cols-1 lg:grid-cols-2 lg:gap-x-4 text-xs md:text-sm">
                                <div className="border-b py-2 flex justify-between">
                                    <span className="text-gray-700">Market Cap:</span><span className="font-nunitoSansBold">${coinMarketData[0].market_cap ? coinMarketData[0].market_cap.toLocaleString() : 'N/A'}</span>
                                </div>
                                <div className="border-b py-2 flex justify-between">
                                    <span className="text-gray-700">Total Supply</span><span className="font-nunitoSansBold">{coinMarketData[0].total_supply ? coinMarketData[0].total_supply.toLocaleString() : 'infinite'}</span>
                                </div>
                                <div className="border-b py-2 flex justify-between">
                                    <span className="text-gray-700">Total Volume:</span><span className="font-nunitoSansBold">{coinMarketData[0].total_volume.toLocaleString()}</span>
                                </div>
                                <div className="border-b py-2 flex justify-between">
                                    <span className="text-gray-700">All Time High:</span><span className="font-nunitoSansBold">${coinMarketData[0] ? coinMarketData[0].ath.toLocaleString() : 'N/A'} [{coinMarketData[0].ath_date ? formatDate(coinMarketData[0].ath_date) : ''}]</span>
                                </div>
                                <div className="border-b py-2 flex justify-between lg:col-start-2">
                                    <span className="text-gray-700">Max Supply:</span><span className="font-nunitoSansBold">{coinMarketData[0].max_supply ? coinMarketData[0].max_supply.toLocaleString() : 'infinite'}</span></div>
                            </div>

                            <p dangerouslySetInnerHTML={{ __html: htmlDescription }} className="description inline-block text-sm lg:text-base leading-5 lg:leading-7 first-letter:text-2xl first-letter:font-nunitoSansBold first-letter:ml-4 mt-8 text-justify" />

                        </div>

                        <div className="lg:col-span-4 space-y-4">
                            <h1 className="text-2xl font-nunitoSansBold">Info</h1>

                            <div className="text-sm lg:text-base flex flex-col space-y-8">
                                <div className="flex items-center border-b-2">
                                    <span className="text-xs lg:text-sm w-1/2">Website:</span>
                                    <div className="flex flex-wrap">
                                        <span className="text-orange-500 font-nunitoSansBold hover:underline">
                                            <a href={links.homepage[0]}>{name}.org</a>
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center border-b-2">
                                    <span className="text-xs lg:text-sm w-1/2">Country Of Origin:</span>
                                    <div className="flex flex-wrap">
                                        <span className="font-nunitoSansBold">
                                            {countryOrigin !== '' ? countryOrigin : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center border-b-2">
                                    <span className="text-xs lg:text-sm w-1/2">Category/ies:</span>
                                    <div className="flex flex-wrap">
                                        <span className="font-nunitoSansBold">
                                            {categories.map((el, index) => <span key={index}>{el}{index !== categories.length - 1 ? ', ' : ''}</span>)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center border-b-2">
                                    <span className="text-xs lg:text-sm w-1/2">Hashing Algorithm:</span>
                                    <div className="flex flex-wrap">
                                        <span className="font-nunitoSansBold">
                                            {hashingAlgo ? hashingAlgo : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center border-b-2">
                                    <span className="text-xs lg:text-sm w-1/2">Block Time:</span>
                                    <div className="flex flex-wrap">
                                        <span className="font-nunitoSansBold">
                                            {blockTime ? blockTime : 'N/A'} minutes
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center border-b-2">
                                    <span className="text-xs lg:text-sm w-1/2">Market Cap Rank:</span>
                                    <div className="flex flex-wrap">
                                        <span className="font-nunitoSansBold">
                                            {marketCapRank ? marketCapRank : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center border-b-2">
                                    <span className="text-xs lg:text-sm w-1/2">Community Score:</span>
                                    <div className="flex flex-wrap">
                                        <span className="font-nunitoSansBold">
                                            {communityScore ? communityScore : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <CoinConversion coinId={symbol} exchRates={marketData.current_price} />
                </>

            }
            {
                error && <div className="text-center">{error.message}</div>
            }
        </>

    )
}

function CoinConversion({ coinId, exchRates }) {
    const [amount, setAmount] = useState(0);
    const [exchCurrency, setExchCurrency] = useState('usd');
    const [switched, setSwitched] = useState(false);
    const leftInputEl = useRef(null);
    const rightInputEl = useRef(null);
    const selectEl = useRef(null);

    const currencyOp = (val) => !switched ? val * exchRates[exchCurrency] : val / exchRates[exchCurrency];

    const calcExchRate = debounce(() => setAmount(currencyOp(leftInputEl.current.value)));

    useEffect(() => {
        setAmount(currencyOp(leftInputEl.current.value));
    }, [exchCurrency, switched]);

    useEffect(() => {
        leftInputEl.current.value = 1;
    }, [switched]);

    const CoinNameDisplay = () => (
        <span className="bg-white inline-block px-2.5 py-1.5 md:px-5 md:py-3 rounded-l-lg border-r-[1px] font-nunitoSansBold uppercase">
            {coinId}
        </span>
    )

    const ExchRateSelect = () => (
        <select
            name="exchRateSelect"
            id="exchRateSelect"
            value={exchCurrency}
            onChange={() => setExchCurrency(selectEl.current.value)}
            className="bg-white text-slate-700 text-sm md:text-base border-0 inline-block md:pl-4 pr-6 py-2 md:pr-8 md:py-3 rounded-l-lg border-r-[1px] border-gray-300 focus:border-gray-300 font-nunitoSansBold focus:outline-none focus:ring-0 uppercase"
            ref={selectEl}
        >
            {Object.keys(exchRates).map(option => <option value={option} className="lowercase">{option}</option>)}
        </select>
    )

    return (
        <div className="w-full rounded-md bg-gray-100 px-2 md:px-4 py-4 flex flex-col md:flex-row items-center justify-center">
            <div className="mb-4 md:mr-4">
                {!switched ? <CoinNameDisplay /> : <ExchRateSelect />}
                <input type="number" className="text-slate-700 border-0 rounded-r-lg px-2 py-1.5 md:px-4 md:py-3" ref={leftInputEl} onChange={calcExchRate} />
            </div>
            <FontAwesomeIcon icon={faRightLeft} className="mb-4 md:mr-4 text-lg text-slate-600 cursor-pointer hover:text-black rotate-90 md:rotate-0" onClick={() => setSwitched((prevState) => !prevState)} />
            <div>
                {switched ? <CoinNameDisplay /> : <ExchRateSelect />}
                <input type="number" value={amount} className="text-slate-700 border-0 rounded-r-lg px-2 py-1.5 md:px-4 md:py-3" ref={rightInputEl} disabled />
            </div>
        </div>
    )
}

function CoinMarketChart({ coinId }) {
    const [currentChart, setCurrentChart] = useState('price');
    const [timePeriod, setTimePeriod] = useState('7');

    const { coinPrice, coinMarketCap, loading, error } = useGetCoinMarketChart(coinId, timePeriod);

    let currentChartDisplay = currentChart === 'price' ? coinPrice : currentChart === 'market_cap' ? coinMarketCap : 'Volume';

    let chartProps = {
        height: window.innerWidth > 465 ? 150 : 300,
        tickFontSize: window.innerWidth > 465 ? 5 : 8
    }

    return (
        <>
            {
                coinPrice.length > 0 ?
                    <div className="mb-4">

                        <h1 className="capitalize font-nunitoSansExtraBold text-xl lg:text-2xl mb-4">{coinId} Price Chart (BTC/USD)</h1>

                        <div className="text-xs lg:text-sm flex flex-col-reverse md:flex-row gap-y-3 items-center justify-between mb-4">
                            <ul className="font-medium text-center font-nunitoSansBold text-slate-700 rounded-lg divide-x divide-gray-200 shadow flex w-fit border-[1px] border-gray-300 p-0">
                                <li>
                                    <span className={`inline-block py-1 lg:py-2 px-2 lg:px-4 rounded-l-lg border-r-[1px] border-gray-300 ${currentChart === 'price' ? 'bg-gray-200' : 'bg-inherit hover:bg-gray-100'} cursor-pointer`} onClick={() => setCurrentChart('price')}>Price</span>
                                </li>
                                <li>
                                    <span className={`inline-block py-1 lg:py-2 px-2 lg:px-4 border-r-[1px] border-gray-300 ${currentChart === 'market_cap' ? 'bg-gray-200' : 'bg-inherit hover:bg-gray-100'} cursor-pointer`} onClick={() => setCurrentChart('market_cap')}>Market Cap</span>
                                </li>
                                <li>
                                    <span className={`inline-block py-1 lg:py-2 px-2 lg:px-4 rounded-r-lg ${currentChart === 'trading_view' ? 'bg-gray-200' : 'bg-inherit hover:bg-gray-100'} cursor-pointer`} >TradingView</span>
                                </li>
                            </ul>

                            <ul className="font-medium text-center font-nunitoSansBold text-slate-700 rounded-lg divide-x divide-gray-200 shadow flex w-fit border-[1px] border-gray-300 p-0">
                                <li>
                                    <span className={`inline-block py-1 lg:py-2 px-2 lg:px-4 rounded-l-lg border-r-[1px] border-gray-300 ${timePeriod === '1' ? 'bg-gray-200' : 'bg-inherit hover:bg-gray-100'} cursor-pointer`} onClick={() => setTimePeriod('1')}>24h</span>
                                </li>
                                <li>
                                    <span className={`inline-block py-1 lg:py-2 px-2 lg:px-4 border-r-[1px] border-gray-300 ${timePeriod === '7' ? 'bg-gray-200' : 'bg-inherit hover:bg-gray-100'} cursor-pointer`} onClick={() => setTimePeriod('7')}>7d</span>
                                </li>
                                <li>
                                    <span className={`inline-block py-1 lg:py-2 px-2 lg:px-4 border-r-[1px] border-gray-300 ${timePeriod === '14' ? 'bg-gray-200' : 'bg-inherit hover:bg-gray-100'} cursor-pointer`} onClick={() => setTimePeriod('14')}>14d</span>
                                </li>
                                <li>
                                    <span className={`inline-block py-1 lg:py-2 px-2 lg:px-4 border-r-[1px] border-gray-300 ${timePeriod === '30' ? 'bg-gray-200' : 'bg-inherit hover:bg-gray-100'} cursor-pointer`} onClick={() => setTimePeriod('30')}>30d</span>
                                </li>
                                <li>
                                    <span className={`inline-block py-1 lg:py-2 px-2 lg:px-4 border-r-[1px] border-gray-300 ${timePeriod === '90' ? 'bg-gray-200' : 'bg-inherit hover:bg-gray-100'} cursor-pointer`} onClick={() => setTimePeriod('90')}>90d</span>
                                </li>
                                <li>
                                    <span className={`inline-block py-1 lg:py-2 px-2 lg:px-4 border-r-[1px] border-gray-300 ${timePeriod === '180' ? 'bg-gray-200' : 'bg-inherit'} cursor-pointer hover:bg-gray-100`} onClick={() => setTimePeriod('180')}>180d</span>
                                </li>
                                <li>
                                    <span className={`inline-block py-1 px-2 lg:px-4 border-r-[1px] border-gray-300 ${timePeriod === '365' ? 'bg-gray-200' : 'bg-inherit hover:bg-gray-100'} cursor-pointer`} onClick={() => setTimePeriod('365')}>1y</span>
                                </li>
                                <li>
                                    <span className={`inline-block py-1 px-2 lg:px-4 rounded-r-lg ${timePeriod === 'max' ? 'bg-gray-200' : 'bg-inherit hover:bg-gray-100'} cursor-pointer`} onClick={() => setTimePeriod('max')}>Max</span>
                                </li>
                            </ul>
                        </div>

                        {
                            loading && <div>loading...</div>
                        }

                        <VictoryChart
                            theme={VictoryTheme.material}
                            domainPadding={{ y: [20, 20] }}
                            height={chartProps.height}
                            padding={{ left: 0, right: 0, top: 0, bottom: 0 }}
                            containerComponent={
                                <VictoryVoronoiContainer voronoiDimension="x"
                                    labels={({ datum }) => `.`}
                                    // labelComponent={<VictoryTooltip cornerRadius={0} flyoutStyle={{ fill: "white" }} />}
                                    padding={{ top: 0, bottom: 0, left: 10, right: 10 }}
                                    labelComponent={
                                        <VictoryTooltip
                                            flyoutComponent={<CustomFlyout currentChart={currentChart} />}
                                        />
                                    }
                                />
                            }
                            style={{
                                padding: 0
                            }}
                        >
                            <VictoryAxis
                                dependentAxis
                                // tickFormat specifies how ticks should be displayed
                                style={{
                                    ticks: { stroke: "transparent", size: 5 },
                                    tickLabels: { fontSize: chartProps.tickFontSize, padding: 5 },
                                    axis: { stroke: "transparent" },
                                }}
                                tickFormat={(x) => (`$${currentChart === 'price' ? round(x, 2) : `${(x / 1000000000).toLocaleString()}B`}`)}
                                offsetX={30}
                            />
                            <VictoryAxis
                                tickFormat={(x) => formatDate(x)}
                                style={{
                                    ticks: { stroke: "transparent", size: 5 },
                                    tickLabels: { fontSize: 0 },
                                    axis: { stroke: "transparent" },
                                    grid: { stroke: 'transparent' }
                                }}
                            />
                            <VictoryLine
                                style={{
                                    data: { stroke: "#ff5a1f", strokeWidth: 1 },
                                    parent: { border: "1px solid #ccc" },
                                    padding: 0
                                }}
                                animate={{
                                    duration: 2000,
                                    onLoad: { duration: 1000 }
                                }}
                                data={convertToObjectArray(currentChartDisplay)}
                            />
                        </VictoryChart>

                    </div>
                    :
                    <div>no result returned</div>
            }

            {
                error && <div>{error.message}</div>
            }
        </>
    )
}

const CustomFlyout = ({ x, y, dx, dy, datum, currentChart }) => (
    <g>
        <rect
            x={x - 40}
            y={y - 50}
            width="70"
            dx={dx}
            dy={dy}
            height="20"
            rx="4.5"
            fill="white"
            stroke="#ff5a1f"
        />
        <text
            x={x - 20}
            y={y - 40}
            fontSize="5"
            fontWeight="bold"
            fill="#ff5a1f"
        >
            {`$${currentChart === 'price' ? `${round(datum.y, 4)}` : `${(datum.y / 1000000000).toLocaleString()}B`}`}
        </text>
        <text
            x={x - 38}
            y={y - 35}
            fontSize="5"
            fontWeight="bold"
            fill="#ff5a1f"
        >
            {`${dateToString(new Date(datum.x))}, ${dateToTime(datum.x)}`}
        </text>
    </g>
);
