export const getFirstElement = <T>(arr: T[] | null | undefined): T | null | undefined => {
    if (Array.isArray(arr)) {
        return arr[0]
    }
    return arr
}