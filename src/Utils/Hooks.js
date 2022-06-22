import { useReducer, useEffect, useState } from "react";
import axios from "axios";

//general actions for API calls
const ACTIONS = {
    MAKE_REQUEST: 'make-request',
    GET_DATA: 'get-data',
    ERROR: 'error'
}


// reducer function
function reducer(state, action) {
    switch (action.type) {

        //outputs loader to the page and await API request response
        case ACTIONS.MAKE_REQUEST:
            return { ...state, loading: true };

        //collect data from response and pass it page, remove loader and output data
        case ACTIONS.GET_DATA:
            return { ...state, loading: false, ...action.payload };

        //if error is found, output error message, return empty array back to page
        case ACTIONS.ERROR:
            return { ...state, loading: false, error: action.payload.error };

        default:
            break;

    }

}

// custom hook to make request to API, and sends output to homepage
function useGetGlobalData() {
    const [state, dispatch] = useReducer(reducer, { globalData: [], exchangeRates: [], trending: [], loading: true })
    console.log(state);

    // set page to loading, send request to API, collect API request and send output 
    useEffect(() => {
        dispatch({ type: ACTIONS.MAKE_REQUEST })

        // create cancel token to cancel request
        const cancelToken1 = axios.CancelToken.source();

        axios.all([
            // send request to get general data
            axios.get('https://coingecko.p.rapidapi.com/global', {
                cancelToken: cancelToken1.token,
                headers: {
                    'X-RapidAPI-Key': '8a3bb1907emsh5e2016c79d20029p1b14c8jsn1910ab871942',
                    'X-RapidAPI-Host': 'coingecko.p.rapidapi.com'
                }

            }),

            // send request to get BTC exchange rates
            axios.get('https://coingecko.p.rapidapi.com/exchange_rates', {
                cancelToken: cancelToken1.token,
                headers: {
                    'X-RapidAPI-Key': '8a3bb1907emsh5e2016c79d20029p1b14c8jsn1910ab871942',
                    'X-RapidAPI-Host': 'coingecko.p.rapidapi.com'
                }

            }),

            // send request to get BTC exchange rates
            axios.get('https://api.coingecko.com/api/v3/search/trending', {
                cancelToken: cancelToken1.token,
                headers: {
                    'X-RapidAPI-Key': '8a3bb1907emsh5e2016c79d20029p1b14c8jsn1910ab871942',
                    'X-RapidAPI-Host': 'coingecko.p.rapidapi.com'
                }

            }),

            // collect data from response and sets loading to false
        ]).then(axios.spread((response1, response2, response3) => {
            const { active_cryptocurrencies: activeCrypto, markets, total_market_cap: totMarketCap, total_volume: totVol, market_cap_percentage: marketCapPercent, market_cap_change_percentage_24h_usd: changeInADay
            } = response1.data.data

            const globalData = {
                activeCrypto, markets, totMarketCap, totVol, marketCapPercent, changeInADay
            }
            dispatch({ type: ACTIONS.GET_DATA, payload: { globalData, exchangeRates: response2.data.rates, trending: response3.data } })
        }

            // return error only if it isn't a cancel
        )).catch((error) =>
            !(axios.isCancel(error)) && dispatch({ type: ACTIONS.ERROR, payload: { error: error } })

        );

        // cancel request if another request has to be made
        return () => cancelToken1.cancel();

    }, []);

    return state;
}

// custom hook to make request to API, and sends output to homepage
function useGetCoinsList() {
    const [state, dispatch] = useReducer(reducer, { coinsList: [], loading: true });

    // // i initially wanted to use the search url from the coinecko API to implement a search feature but it wasn't functioning well
    // useEffect(() => {
    //     dispatch({ type: ACTIONS.MAKE_REQUEST })

    //     // create cancel token to cancel request
    //     const cancelToken3 = axios.CancelToken.source();
    //     console.log(searchTerm);

    //     axios.get(`https://api.coingecko.com/api/v3/search/`, {
    //         cancelToken: cancelToken3.token,
    //         params: {
    //             query: searchTerm
    //         }
    //     }).then((response) => {
    //         console.log(response.data.coins)
    //         dispatch({ type: ACTIONS.GET_DATA, payload: { coinsList: response.data } })
    //     }
    //     ).catch((error) =>
    //         !(axios.isCancel(error)) && dispatch({ type: ACTIONS.ERROR, payload: { error: error } })

    //     );

    //     return () => cancelToken3.cancel();

    // }, [searchTerm])


    useEffect(() => {
        dispatch({ type: ACTIONS.MAKE_REQUEST })

        // create cancel token to cancel request
        const cancelToken2 = axios.CancelToken.source();

        axios.get('https://coingecko.p.rapidapi.com/coins/list', {
            cancelToken: cancelToken2.token,
            headers: {
                'X-RapidAPI-Key': '8a3bb1907emsh5e2016c79d20029p1b14c8jsn1910ab871942',
                'X-RapidAPI-Host': 'coingecko.p.rapidapi.com'
            }

        }).then((response) =>
            dispatch({ type: ACTIONS.GET_DATA, payload: { coinsList: response.data } })

        ).catch((error) =>
            !(axios.isCancel(error)) && dispatch({ type: ACTIONS.ERROR, payload: { error: error } })

        );

        return () => cancelToken2.cancel();

    }, []);

    return state;
}

function useGetCoinData(coinId) {
    const [state, dispatch] = useReducer(reducer, { coinData: {}, coinMarketData: {}, loading: true });

    useEffect(() => {
        dispatch({ type: ACTIONS.MAKE_REQUEST })

        // create cancel token to cancel request
        const cancelToken = axios.CancelToken.source();

        axios.all([
            // send request to get general coin data
            axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`, {
                cancelToken: cancelToken.token,
            }),

            // send request to get coin market data
            axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`, {
                cancelToken: cancelToken.token,
            }),

            // collect data from response and sets loading to false
        ]).then(axios.spread((response1, response2) =>
            dispatch({ type: ACTIONS.GET_DATA, payload: { coinData: response1.data, coinMarketData: response2.data } })

            // return error only if it isn't a cancel
        )).catch((error) =>
            !(axios.isCancel(error)) && dispatch({ type: ACTIONS.ERROR, payload: { error: error } })

        );

        return () => cancelToken.cancel();

    }, [coinId]);

    return state;

}

function useGetCoinMarketChart(coinId, timePeriod) {
    const [state, dispatch] = useReducer(reducer, { coinPrice: [], coinMarketCap: [], loading: true });
    const [prevState, setPrevState] = useState({});

    useEffect(() => {
        dispatch({ type: ACTIONS.MAKE_REQUEST })

        //check if a request has already been made for this time period and return the data if it has, else make api call 
        if (prevState[`${coinId}-${timePeriod}`]) {
            console.log('already searched for this time period')
            return dispatch({ type: ACTIONS.GET_DATA, payload: { coinPrice: prevState[`${coinId}-${timePeriod}`].coinPrice, coinMarketCap: prevState[`${coinId}-${timePeriod}`].coinMarketCap } });
        }

        // create cancel token to cancel request
        const cancelToken = axios.CancelToken.source();

        // send request to get general coin data
        axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${timePeriod}`, {
            cancelToken: cancelToken.token,

            // collect data from response and sets loading to false
        }).then((response) => {
            console.log('call was made')

            // add data to prevState to be used later
            setPrevState({ ...prevState, [`${coinId}-${timePeriod}`]: { coinPrice: response.data.prices, coinMarketCap: response.data.market_caps } })

            dispatch({ type: ACTIONS.GET_DATA, payload: { coinPrice: response.data.prices, coinMarketCap: response.data.market_caps } })
        }
            // return error only if it isn't a cancel
        ).catch((error) =>
            !(axios.isCancel(error)) && dispatch({ type: ACTIONS.ERROR, payload: { error: error } })

        );

        return () => cancelToken.cancel();

    }, [coinId, timePeriod]);

    return state;

}




export { useGetGlobalData, useGetCoinsList, useGetCoinData, useGetCoinMarketChart };