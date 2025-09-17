export const userFinder = () => {
    if (typeof window === 'undefined') return null
    const isUser = localStorage.getItem('user')
    return isUser
}