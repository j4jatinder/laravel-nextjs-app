import axios from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'

export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: () => axios.get('/api/users').then(res => res.data)
    })
}