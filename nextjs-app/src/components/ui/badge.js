import { cn } from '@/lib/utils'

const variants = {
    default: 'bg-gray-900 text-white',
    secondary: 'bg-gray-100 text-gray-900',
}

export function Badge({ className, variant = 'secondary', ...props }) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize',
                variants[variant],
                className,
            )}
            {...props}
        />
    )
}
