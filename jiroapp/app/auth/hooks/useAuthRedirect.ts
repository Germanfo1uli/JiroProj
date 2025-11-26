import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export const useAuthRedirect = () => {
    const router = useRouter()

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token')
            if (!token) {
                router.push('/welcome')
            }
        }

        const timer = setTimeout(checkAuth, 200)

        return () => clearTimeout(timer)
    }, [router])

    return null
}