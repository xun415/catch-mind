export const getFirstElement = <T>(arr: T[] | null | undefined): T | undefined => {
    return arr?.[0];
}