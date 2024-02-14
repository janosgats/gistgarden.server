export function isValidNonNegativeNumber(toValidate: number | string): boolean {
    if (typeof toValidate === "string") {
        toValidate = Number.parseFloat(toValidate);
    }

    return toValidate !== null && !isNaN(toValidate) && toValidate >= 0;
}

export function isValidNonEmptyString(toValidate: string): boolean {
    return typeof toValidate === "string" && toValidate.length > 0;
}

export function getSanitizedBoolean(toValidate: string | boolean): boolean {
    if (toValidate === true || toValidate === "true") {
        return true
    }

    if (toValidate === false || toValidate === "false") {
        return false
    }

    throw Error(`Invalid value given for boolean: ${toValidate}`)
}