export function isValidNonNegativeNumber(toValidate: number | string): boolean {
    if (typeof toValidate === "string") {
        toValidate = Number.parseFloat(toValidate);
    }

    return toValidate !== null && !isNaN(toValidate) && toValidate >= 0;
}

export function isValidNonEmptyString(toValidate: string): boolean {
    return typeof toValidate === "string" && toValidate.length > 0;
}