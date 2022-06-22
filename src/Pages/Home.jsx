import React, { useEffect, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { Spinner } from 'flowbite-react';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryPie, VictoryTooltip, VictoryLabel } from 'victory';

import { useGetGlobalData } from '../Utils/Hooks';
import { convertObjectToArray, isNotEmptyObject, round, selectItemsFromArray, selectTopTen } from '../Utils/functions';
import { Link } from 'react-router-dom';


export default function Home() {
  const { globalData, exchangeRates, trending, loading, error } = useGetGlobalData();

  const { activeCrypto, markets, totMarketCap, totVol, marketCapPercent, changeInADay } = globalData && globalData;

  const el = useRef(null);
  const pie = useRef(null);
  const q = gsap.utils.selector(el);

  const exchRateBTC = exchangeRates && selectTopTen(convertObjectToArray(exchangeRates, ["name", "data"]));
  const cryptoTotVol = totVol && selectItemsFromArray(convertObjectToArray(totVol, ['name', 'value']), ['xrp', 'eth', 'ltc', 'bnb', 'ars', 'dot', 'mxn', 'xlm', 'btc', 'cad']);

  useLayoutEffect(() => {
    if (activeCrypto === undefined) return;
    const anim1 = gsap.fromTo(q('.card'), { autoAlpha: 0, y: 50, duration: 5, delay: 2 }, { autoAlpha: 1, y: 0 })

    return () => anim1.kill();

  }, [activeCrypto]);

  useLayoutEffect(() => {
    if (marketCapPercent === undefined) return;
    const element = pie.current;
    const anim2 = gsap.to(element, { rotation: "+=360", repeat: -1, repeatDelay: 0, ease: 'none', duration: 10 });
    element.addEventListener('mouseenter', () => { anim2.restart(); anim2.pause() })
    element.addEventListener('mouseleave', () => anim2.play());

    return () => anim2.kill();

  }, [marketCapPercent]);

  // isNotEmptyObject(trending) && console.log(trending.coins[0].item);

  return (
    <section ref={el} className="text-gray-700">
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
        isNotEmptyObject(globalData) &&
        <>

          <div className="mb-4">
            <p>
              active coins: {activeCrypto}, change in market cap in the past 24 hours: {round(changeInADay, 2)}%, markets: {markets}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            <div className="border-orange-500 border-2 bg-white shadow-lg card space-y-4 px-4 py-2">
              <div className=" py-3 px-3">
                <h2 className="text-center font-nunitoSansBold text-lg">Trending</h2>
                <ul className="text-sm space-y-2">
                  {
                    trending.coins.map((coin, index) =>
                      <li key={index} className="flex justify-between">
                        {/* {item} */}
                        <Link to={`info/coins/coin/${coin.item.id}`} className="font-nunitoSansBold text-orange-500 hover:underline uppercase flex items-end space-x-4">
                          <img src={coin.item.small} alt={coin.item.name} className="h-8" />
                          <span>
                            {coin.item.name}
                          </span>
                        </Link>

                      </li>
                    )
                  }
                </ul>
              </div>
            </div>

            <div className="border-orange-500 border-2 bg-white shadow-lg card space-y-4 px-4 py-2">
              <h2 className="text-center font-nunitoSansBold text-lg">Bitcoin Exchange Rates</h2>
              <ul className="text-sm space-y-2">
                {
                  exchRateBTC.map((item, index) =>
                    <li key={index} className="flex justify-between">
                      <span className="font-nunitoSansBold text-orange-500">{item.data.name}:</span><span className={`flex items-end ${item.data.type === 'crypto' ? 'flex-row-reverse' : 'flex-row'}`}><strong>{item.data.unit}</strong>{round(item.data.value, 2)}</span>
                    </li>
                  )
                }
              </ul>
            </div>

            <div className="border-orange-500 border-2 bg-white shadow-lg card space-y-4 px-4 py-2">
              <h2 className="text-center font-nunitoSansBold text-lg">Total Volume</h2>
              <ul className="text-sm space-y-2">
                {
                  cryptoTotVol.map((item, index) =>
                    <li key={index} className="flex justify-between">
                      <span className="text-orange-500 font-nunitoSansBold uppercase">{item.name}:</span><span className="flex items-end text-sm"><span>{round(item.value, 2)}</span><strong>units</strong></span>
                    </li>
                  )
                }
              </ul>
            </div>

            <div className="border-orange-500 border-2 bg-white shadow-lg card space-y-4 px-4 py-2 overflow-hidden">
              <h2 className="text-center font-nunitoSansBold text-lg">Market Cap Percentage</h2>
              <div ref={pie}>
                <VictoryPie
                  colorScale={["tomato", "orange", "gold", "red", "maroon"]}
                  data={convertObjectToArray(marketCapPercent, ['x', 'y'])}
                  labels={({ datum }) => `${datum.x}, ${round(datum.y, 2)}%`}
                  labelComponent={<VictoryTooltip />}
                />
              </div>
            </div>
          </div>
        </>
      }
      {
        error &&
        <div>{error.message}</div>
      }
    </ section >
  )
}
