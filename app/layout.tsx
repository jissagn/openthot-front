// import './globals.css'
import { Providers } from './providers'

export const metadata = {
  title: 'STT FRONT',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
    <head />
    <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
