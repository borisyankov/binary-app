export default {
    CALL: 'Win if the exit spot is strictly higher than the entry spot.',
    PUT: 'Win if the exit spot is strictly lower than the entry spot.',
    CALL2: 'Win if the exit spot is strictly higher than the barrier.',
    PUT2: 'Win if the exit spot is strictly lower than the barrier.',
    HIGHER: 'Win if the exit spot is strictly higher than the barrier.',
    LOWER: 'Win if the exit spot is strictly lower than the barrier.',
    ONETOUCH: 'Win if the market touches the barrier at any time during the contract period.',
    NOTOUCH: 'Win if the market never touches the barrier at any time during the contract period.',
    EXPIRYRANGE: 'Win if the exit spot is strictly higher than the Low barrier and strictly lower than the High barrier.',
    EXPIRYMISS: 'Win if the exit spot is either strictly higher than the High barrier, or strictly lower than the Low barrier.',
    RANGE: 'Win if the market stays between (does not touch) either the High barrier or the Low barrier at any time during the contract period.',
    UPORDOWN: 'Win if the market touches either the High barrier or the Low barrier at any time during the contract period.',
    ASIANU: 'Win if the last tick is higher than the average of the ticks.',
    ASIAND: 'Win if the last tick is lower than the average of the ticks.',
    DIGITMATCH: 'Win if the last digit of the last tick is the same as your prediction.',
    DIGITDIFF: 'Win if the last digit of the last tick is not the same as your prediction.',
    DIGITEVEN: 'Win if the last digit of the last tick is an even number (i.e., 2, 4, 6, 8, or 0).',
    DIGITODD: 'Win if the last digit of the last tick is an odd number (i.e., 1, 3, 5, 7, or 9).',
    DIGITOVER: 'Win if the last digit of the last tick is greater than your prediction.',
    DIGITUNDER: 'Win if the last digit of the last tick is less than your prediction.',
    SPREADU: 'Spread contracts payout based on the movement of the index relative to the entry level of the contract.',
    SPREADD: 'Spread contracts payout based on the movement of the index relative to the entry level of the contract.',
};
