import { globalStyle } from "@vanilla-extract/css";

/**
 * reset 제외 elements
 */
const parentElements = ['canvas', 'iframe', 'img', 'svg', 'video']
const childElements = ['svg *', 'symbol *']

globalStyle(`*:not(${[...parentElements, ...childElements].join()})`, {
    boxSizing: `border-box`,
    fontFamily: 'Roboto',
    letterSpacing: '-2%',
    padding: 0,
    margin: 0,
    listStyle: 'none',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent'
})

globalStyle('*, *::before, *::after', {
    boxSizing: 'border-box'
})