import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
// import Perf from 'react-addons-perf';
import Root from './_store/root';

// import { whyDidYouUpdate } from 'why-did-you-update';
// whyDidYouUpdate(React, { exclude: [/^Connect/, /IntlProvider/, /BootProvider/] });

// window.performPerfTest = () => {
// 	Perf.start();
// 	setTimeout(() => {
// 		Perf.stop();
// 		const measurements = Perf.getLastMeasurements();
// 		Perf.printInclusive(measurements);
// 		Perf.printWasted(measurements);
// 	}, 10000);
// };

// console.log(localStorage.getItem('account'), (JSON.parse(localStorage.getItem('account')) || {}).loginid);
window._trackJs = { // eslint-disable-line no-underscore-dangle
    token: '346262e7ffef497d85874322fff3bbf8',
    application: 'binary-next-gen',
    enabled: window.location.hostname !== 'localhost',
	userId: (JSON.parse(localStorage.getItem('account')) || {}).loginid,
};
require('trackjs');

ReactDOM.render(<Root />, document.getElementById('root'));
