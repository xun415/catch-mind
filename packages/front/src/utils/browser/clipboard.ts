const copyText = (text: string, onSuccess?: () => void, onError?: () => void) => {
    window.navigator.clipboard.writeText(text)
        .then(() => {
            onSuccess?.()
        })
        .catch(() => {
            onError?.()
        })
}

export {copyText}