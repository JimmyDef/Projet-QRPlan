'use client'
import SignOutButton from '@/src/components/buttons/SignOutButton'
import { useUserStore } from '@/src/lib/store'
import { User } from '@/src/lib/types'
import { capitalizeFirstLetter } from '@/src/services/helpers'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import verifySession from '@/src/services/verifySession'
type HeaderProps = {
  user: User | null
}

export const ConnexionButtons = ({ user }: HeaderProps) => {
  const { setUser, clearUser } = useUserStore()
  const currentUser = useUserStore((state) => state.user)
  const fistName = currentUser?.name?.split(' ')[0]
  const formattedFirstName = capitalizeFirstLetter(fistName ?? '')
  const t = useTranslations('header')
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setUser(user)
  }, [user, setUser])

  useEffect(() => {
    const handleFocus = async () => {
      const fetchedSessionUser = await verifySession()

      if (fetchedSessionUser && currentUser === null) {
        setUser(fetchedSessionUser)
        return
      }
      if (currentUser && fetchedSessionUser === null) {
        clearUser()

        if (pathname === '/dashboard') {
          router.push('/auth/sign-in')
          return
        }
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [user, currentUser, pathname, router, setUser, clearUser])

  return (
    <>
      {currentUser ? (
        <>
          <Link
            href="/dashboard"
            className="header__link  header__link--user-name"
          >
            {formattedFirstName}
          </Link>
          <Link
            href="/dashboard"
            className="header__link header__link--user-img"
          >
            <Image
              width={50}
              height={50}
              className="user-image"
              src={currentUser.image || '/icons/defaultUser.svg'}
              alt="user icon"
            />
          </Link>

          <SignOutButton className="header__link header__link--sign-out" />
        </>
      ) : (
        <ul className="header__list">
          <li className="header__item">
            <Link
              href="/auth/sign-in"
              className="header__link header__link--sign-in"
            >
              {t('logIn')}
            </Link>
          </li>
          <li className="header__item  header__item--highlight">
            <Link
              href="/auth/registration"
              className="header__link header__link--sign-up"
            >
              {t('signUp')}
            </Link>
          </li>
        </ul>
      )}
    </>
  )
}
