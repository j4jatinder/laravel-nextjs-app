'use client'

import { LoadingProvider } from '@/providers/LoadingProvider'
import { ToastProvider } from '@/providers/ToastProvider'

const AppProviders = ({ children }) => {
    return (
        <LoadingProvider>
            <ToastProvider>{children}</ToastProvider>
        </LoadingProvider>
    )
}

export default AppProviders
