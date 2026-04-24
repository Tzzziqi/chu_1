import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store'

interface Props {
    children: React.ReactNode
    adminOnly?: boolean
}

export default function ProtectedRoute({ children, adminOnly = false }: Props) {
    const { isLoggedIn, user } = useSelector((state: RootState) => state.auth)
    if (!isLoggedIn) {
        return <Navigate to='/signin'/>
    }
    // in case user is null, so use user?.role to get undefined
    if (adminOnly && user?.role !== 'admin') {
        return <Navigate to="/"/>
    }
    return <> { children } </>

}