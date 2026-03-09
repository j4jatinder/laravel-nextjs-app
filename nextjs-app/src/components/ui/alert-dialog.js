'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export function AlertDialog({
    open,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    confirmVariant = 'destructive',
    isConfirming = false,
    onConfirm,
    onCancel,
}) {
    useEffect(() => {
        if (!open) {
            return
        }

        const onKeyDown = event => {
            if (event.key === 'Escape') {
                onCancel()
            }
        }

        window.addEventListener('keydown', onKeyDown)

        return () => window.removeEventListener('keydown', onKeyDown)
    }, [open, onCancel])

    if (!open) {
        return null
    }

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <button
                type="button"
                aria-label="Close dialog"
                className="absolute inset-0 bg-black/40"
                onClick={onCancel}
            />
            <div className="relative z-[91] w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm text-gray-600">{description}</p>

                <div className="mt-6 flex justify-end gap-2">
                    <Button variant="outline" onClick={onCancel} disabled={isConfirming}>
                        {cancelLabel}
                    </Button>
                    <Button variant={confirmVariant} onClick={onConfirm} disabled={isConfirming}>
                        {isConfirming ? 'Please wait...' : confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    )
}
