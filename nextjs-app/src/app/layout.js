import { Nunito } from 'next/font/google'
import '@/app/global.css'
import AppProviders from '@/providers/AppProviders'

const nunitoFont = Nunito({
    subsets: ['latin'],
    display: 'swap',
})

const RootLayout = ({ children }) => {
    return (
        <html lang="en" className={nunitoFont.className}>
            <body className="antialiased">
                <AppProviders>{children}</AppProviders>
            </body>
        </html>
    )
}

export const metadata = {
    title: 'Laravel',
}

export default RootLayout
