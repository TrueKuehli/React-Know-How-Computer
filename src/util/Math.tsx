/**
 * Prevent receiving -Infinity or NaN when calculating the logarithm base 10.
 * @param x
 */
function safeLog10(x: number) {
    if (x <= 0) return 0;
    else return Math.log10(x);
}

/**
 * Returns the number of digits of x in base 10.
 * @param x
 */
function digits10(x: number) {
    if (x <= 1) return 1; // Special case for 0 and 1
    return Math.ceil(safeLog10(x));
}

export { safeLog10, digits10 };