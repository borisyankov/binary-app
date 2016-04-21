export const stringIncrement = s => {
    const toNumber = +s;
    if (toNumber === 0) {
        return (1).toString();
    }
    if (!!toNumber) {
        return (toNumber + 1).toString();
    }
    const captureTrailingNumber = /(\D+)(\d*)$/g;
    const match = captureTrailingNumber.exec(s);
    const incremented = match[2] ? `${match[1]}${+match[2] + 1}` : match[1] + '0';
    return incremented;
};

export const numberToSignedString = n => {
    if (n >= 0) {
        return '+' + n;
    }
    return n.toString();
};
