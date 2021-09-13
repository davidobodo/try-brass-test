export function toCurrency(number: number) {
    const formatter = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN"
    });

    return formatter.format(number);
}

export function removePaystackLaggingZeroes(value: string | number) {
    return +value.toString().slice(0, -2);
}
