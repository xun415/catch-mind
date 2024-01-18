import {ButtonVariants, styledButton} from "./index.css.ts";
import {ButtonHTMLAttributes, ReactNode} from "react";

type Props =  ButtonVariants & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled' | 'className'> & {
    children?: ReactNode | string
}

const Button = ({ variant, size = 'medium', disabled = false, blocked = false, children, ...rest }: Props) => {
    const buttonClass = styledButton({
        disabled,
        variant,
        size,
        blocked
    })

    return (
        <button className={buttonClass} disabled={disabled} {...rest}>
            {children}
        </button>
    )
}

export default Button