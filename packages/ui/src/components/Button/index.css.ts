import {recipe, RecipeVariants} from "@vanilla-extract/recipes";
import vars from '../../assets/styles/vars.css.ts'

const { color, size, gap } = vars

export const styledButton = recipe({
    base: {
        display: "flex",
        justifyContent: 'center',
        alignItems: "center",
        padding: `${gap * 3}px ${gap * 4}px`,
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        fontSize: size.font.medium
    },
    variants: {
        variant: {
            primary: {
                backgroundColor: color.bg.primary,
                color: color.font.pure
            },
            secondary: {
                backgroundColor: color.bg.secondary,
                border: `1px solid ${color.border.normal}`,
                color: color.font.pure
            },
            transparent: {
                backgroundColor: color.bg.transparent,
                border: `1px solid ${color.border.normal}`,
                color: color.font.primary
            }
        },
        size: {
            small: {
                padding: `${gap * 2}px ${gap * 3}px`,
                fontSize: size.font.small
            },
            medium: {},
            large: {
                padding: `${gap * 4}px ${gap * 5}px`,
                fontSize: size.font.large
            }
        },
        disabled: {
            true: {
                color: color.font.hint,
                backgroundColor: color.bg.disabled,
                cursor: 'not-allowed'
            }
        },
        blocked: {
            true: {
                width: '100%',
                height: '100%'
            }
        }
    },
    defaultVariants: {
        disabled: false,
        variant: 'primary',
        size: 'small'
    }
})

export type ButtonVariants = RecipeVariants<typeof styledButton>;