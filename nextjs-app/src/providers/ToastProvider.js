'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

const baseStyle =
    'pointer-events-auto w-full max-w-sm rounded-lg border p-4 shadow-lg transition-all duration-300 bg-white text-gray-900'

const variants = {
    success: 'border-green-200',
    error: 'border-red-200',
    info: 'border-blue-200',
}

const ToastViewport = ({ toasts, onDismiss }) => {
    return (
        <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-3">
            {toasts.map(toast => (
                <div key={toast.id} className={`${baseStyle} ${variants[toast.variant] || variants.info}`}>
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            {toast.title && <p className="text-sm font-semibold">{toast.title}</p>}
                            {toast.description && (
                                <p className="mt-1 text-sm text-gray-600">{toast.description}</p>
                            )}
                        </div>
                        <button
                            type="button"
                            className="text-xs text-gray-500 hover:text-gray-700"
                            onClick={() => onDismiss(toast.id)}>
                            Close
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([])

    const dismiss = useCallback(id => {
        setToasts(current => current.filter(toast => toast.id !== id))
    }, [])

    const toast = useCallback(({ title, description, variant = 'info', duration = 4000 }) => {
        const id = `${Date.now()}-${Math.random()}`

        setToasts(current => [...current, { id, title, description, variant }])

        if (duration > 0) {
            setTimeout(() => {
                setToasts(current => current.filter(entry => entry.id !== id))
            }, duration)
        }

        return id
    }, [])

    const value = useMemo(
        () => ({
            toast,
            dismiss,
        }),
        [toast, dismiss],
    )

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastViewport toasts={toasts} onDismiss={dismiss} />
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const context = useContext(ToastContext)

    if (!context) {
        throw new Error('useToast must be used within ToastProvider')
    }

    return context
}
