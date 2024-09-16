'use client'
import Image from 'next/image'
import { AuthButton } from '@/src/components/buttons/AuthButton'
import signInWithCredentials from '@/src/services/signInWithCredentials'
import './form.scss'
import Loader from '@/src/components/loader/Loader'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
// import { set } from 'zod'
type Form = {
  email: string
  password: string
}

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isFormValid, setIsFormValid] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<Form>({
    email: '',
    password: '',
  })
  const [subtitle, setSubtitle] = useState('')
  const [subtitleClassName, setSubtitleClassName] = useState('')
  const pathname = usePathname()
  const searchParams = useSearchParams()
  useEffect(() => {
    if (
      pathname === '/auth/signin-by-authJs' &&
      searchParams.get('error') === 'OAuthAccountNotLinked'
    ) {
      setSubtitle(
        'To confirm your identity, sign in with the same account you used originally.'
      )
      setSubtitleClassName('subtitle subtitle--OAuthAccountNotLinked')
    } else if (pathname === '/auth/sign-in') {
      setSubtitle(
        'Get access to your dashboard by using credentials or providers.'
      )
      setSubtitleClassName('subtitle subtitle--sign-in')
    } else {
      setSubtitle('')
      setSubtitleClassName('')
    }
  }, [pathname, searchParams])
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    form: Form
  ) => {
    event.preventDefault()
    setIsFormValid(true)
    setIsLoading(true)
    if (Object.values(form).some((value) => value.trim() === '')) {
      setIsFormValid(false)
      setIsLoading(false)
      return
    }

    try {
      await signInWithCredentials(form)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
        console.log('setError', err.message)
      }
      console.error('handleSubmit', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="sign_form_container">
      <form
        className="sign_form"
        onSubmit={(event) => handleSubmit(event, form)}
      >
        <div className="logo_container"></div>
        <div className="title_container">
          <p className="title">Login to your Account</p>
          <div className="subtitle--OAuthAccountNotLinked-wrapper">
            <p className={subtitleClassName}>{subtitle}</p>
          </div>
        </div>
        <br />
        <div className="input_container">
          <label className="input_label" htmlFor="email">
            Email
          </label>

          <Image
            className="icon-credential"
            width={30}
            height={30}
            src="/icons/email.svg"
            alt="email icon"
          />
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="name@mail.com"
            name="email"
            type="email"
            className={`input_field ${
              !isFormValid && !form.email ? 'input-error' : ''
            } `}
            id="email_field"
            autoComplete="email"
            required
          />
        </div>
        <div className="input_container">
          <label className="input_label" htmlFor="password">
            Password
          </label>
          <Image
            className="icon-credential"
            width={30}
            height={30}
            src="/icons/password.svg"
            alt="email icon"
          />
          <input
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Password"
            name="password"
            type="password"
            className={`input_field  input_field--password-sign-in${
              !isFormValid && !form.password ? 'input-error' : ''
            } `}
            id="password_field"
            autoComplete="current-password"
          />
          <Link
            href="/auth/reset-password/send-email"
            className="form-password-error--sign-in"
          >
            Forgot password?
          </Link>
        </div>
        {!isFormValid && <p className="form-error">Please fill all fields.</p>}
        {error && (
          <p className="form-error">
            {error} {''}
            {error === 'Email is not verified.' ? (
              <Link
                className="unverified-email-link"
                href="/auth/registration/token-activation/resend-activation-link"
              >
                Request activation link?
              </Link>
            ) : null}
          </p>
        )}

        <button
          title="Sign In"
          type="submit"
          className="sign_btn"
          disabled={isLoading}
        >
          {isLoading ? <Loader /> : <span>Sign In</span>}
          {/* <span>Sign In</span> */}
        </button>
      </form>
      {/* FIN DU FORM ----------------------------------------------- 
      ---------------------------------------*/}

      <div className="separator">
        <hr className="line" />
        <span>Or</span>
        <hr className="line" />
      </div>
      <div className="auth-btn-container">
        <AuthButton
          className="sign__brand sign__brand--google"
          provider="google"
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          title="Sign In with Google"
        >
          <Image
            className="icon-auth"
            width={30}
            height={30}
            src="/icons/google.svg"
            alt="google icon"
          />
          <span className="auth-label">Google</span>
        </AuthButton>
        <AuthButton
          className="sign__brand sign__brand--github"
          provider="github"
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          title="Sign In with GitHub"
        >
          <Image
            className="icon-auth"
            width={30}
            height={30}
            src="/icons/github.svg"
            alt="github icon"
          />
          <span className="auth-label">GitHub</span>
        </AuthButton>
        <AuthButton
          className="sign__brand sign__brand--facebook"
          provider="Facebook"
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          title="Sign In with Facebook"
        >
          <Image
            className="icon-auth"
            width={30}
            height={30}
            src="/icons/facebook.svg"
            alt="facebook icon"
          />
          <span className="auth-label">Facebook</span>
        </AuthButton>
        <AuthButton
          className="sign__brand sign__brand--LinkedIn"
          provider="linkedin"
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          title="Sign In with LinkedIn"
        >
          <Image
            className="icon-auth icon-auth--linkedin"
            width={32}
            height={32}
            src="/icons/linkedin.svg"
            alt="linkedin icon"
          />
          <span className="auth-label">Linked In</span>
        </AuthButton>
      </div>
      <div className="footer">
        <p className="register">
          Connect your account with providers above or{' '}
          <Link className="register-link" href="/auth/registration">
            register.
          </Link>
        </p>
        <p className="note">Terms of use &amp; Conditions</p>
      </div>
    </div>
  )
}
export default SignIn