// const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


// check if object is empty
export const isNotEmptyObject = (obj) => Object.keys(obj).length !== 0;

// round number
export const round = (num, places) => +(parseFloat(num).toFixed(places));

export const toDollar = (num) => num.toLocaleString('en-US', { style: 'currency', currency: 'USD', });

//convert date to dayNames
export const dateToDay = date => dayNames[date.getDay()];

//convert date to monthnames 
export const dateToMonth = date => monthNames[date.getMonth()];

//format full date
export const dateToString = date => `${dateToDay(date)}, ${date.getDate()} ${dateToMonth(date)} ${date.getFullYear()}`;

//convert datetime to time
export const dateToTime = date => new Date(date).toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");

//convert unix time to dayNames
export const unixToDay = unix => dateToDay(new Date(unix * 1000));

export const formatDate = (date) => new Date(date).toLocaleDateString();

//convert an array to a multidimensional array
export const paginateArray = function (arr) {
    let newArr = [], num, spliceEl;
    let oldArr = [...arr];

    while (oldArr.length > 0) {
        num = (oldArr.length >= 100) ? 100 : oldArr.length;
        spliceEl = oldArr.splice(0, num);
        newArr = [...newArr, spliceEl];
    }

    return newArr;
}

// debonce function
export const debounce = (func, timeout = 300) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

export const convertObjectToArray = function (object, keys) {
    return Object.entries(object).map((el) => {
        const ret = {};
        keys.forEach((key, index) => {
            ret[key] = el[index];
        });

        return ret;
    })
}

export const selectTopTen = (array, params) => array.filter((el) => (el.name === 'xrp') || (el.name === 'eth') || (el.name === 'ltc') || (el.name === 'bnb') || (el.name === 'usd') || (el.name === 'eur') || (el.name === 'gbp') || (el.name === 'chf') || (el.name === 'jpy') || (el.name === 'ngn'))


export const selectItemsFromArray = (array, params) => array.filter((el) => params.includes(el.name))

export const convertToObjectArray = (arr) => {
    let output = [];

    for (let i = 1; i < arr.length; i++) {
        let obj = {};
        obj['x'] = arr[i][0];
        obj['y'] = arr[i][1];

        output.push(obj);
    }

    return output;
}


