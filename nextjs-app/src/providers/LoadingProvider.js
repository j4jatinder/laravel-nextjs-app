'use client'

import { subscribeLoading } from '@/lib/loadingBus'
import { useEffect, useState } from 'react'

const Spinner = () => (
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-indigo-600" />
)

const LoadingOverlay = ({ visible }) => {
    if (!visible) {
        return null
    }

    return (
        <div className="pointer-events-none fixed inset-0 z-[95] flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
            <div className="flex flex-col items-center gap-3 rounded-lg border border-gray-200 bg-white/90 px-6 py-4 shadow-sm">
                <Spinner />
                <p className="text-sm font-medium text-gray-700">Loading...</p>
            </div>
        </div>
    )
}

export const LoadingProvider = ({ children }) => {
    const [activeRequests, setActiveRequests] = useState(0)

    useEffect(() => {
        return subscribeLoading(setActiveRequests)
    }, [])

    return (
        <>
            {children}
            <LoadingOverlay visible={activeRequests > 0} />
        </>
    )
}
