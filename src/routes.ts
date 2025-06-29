const publicRoutes = [
    '/',
    '/listening/dictation',
    '/blog',
]

const publicRoutesReg = [
    '/^\/blog/',
]

export function isPublicRoute(pathname: string): boolean {
    if (publicRoutes.includes(pathname)) {
        return true
    }
    for (let reg in publicRoutesReg) {
        if (RegExp(reg).test(pathname)) {
            return true
        }
    }
    return false
}

export const authRoutes = [
    '/login',
    '/register'
]

