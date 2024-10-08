// import '@/src/styles/globals.scss'
import Header from '@/src/components/header/Header'
import '@/src/styles/main.scss'
import { auth } from '@/src/lib/auth'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

export const metadata = {
  title: 'QR Plans',
  description: 'QR Plans app',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const messages = await getMessages()
  const session = await auth()
  const securedSession = session?.user ? { ...session.user, id: null } : null
  return (
    <html lang={locale}>
      <head>
        <title>QR Plans</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Header user={securedSession} />

          <main className="main">{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
