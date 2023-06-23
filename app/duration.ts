
export default function pad_time(n: number, max_frac_digits: number = 0): string {

    return Intl.NumberFormat("en", {
        minimumIntegerDigits: 2,
        maximumFractionDigits: max_frac_digits,
    }).format(n).toString()
}
