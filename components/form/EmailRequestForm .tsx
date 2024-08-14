'use client'

import Image from 'next/image'
import { useState } from 'react'
import '@/styles/app/shared/form.scss'
import { useRouter } from 'next/navigation'

type EmailRequestForm = {
  title: string
  api: string
  callBackUrl: string
}

const EmailRequestForm = ({ title, api, callBackUrl }: EmailRequestForm) => {
  const [isLoading, setIsLoading] = useState(false)
  const [errorEmail, setErrorEmail] = useState<string | null>(null)
  const [isFormValid, setIsFormValid] = useState(true)

  const router = useRouter()
  const [form, setForm] = useState({
    email: '',
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (Object.values(form).some((value) => value.trim() === ''))
      return setIsFormValid(false)

    try {
      setIsLoading(true)
      const res = await fetch(api, {
        method: 'POST',
        body: JSON.stringify(form),
      })
      if (res.ok) {
        router.push(callBackUrl)
      } else {
        if (res.status === 409) {
          setErrorEmail('This email is already activated.')
        } else if (res.status === 400) {
          setErrorEmail('Please fill Email field.')
        } else if (res.status === 404) {
          setErrorEmail('This email does not exist in our database.')
        } else {
          setErrorEmail('An unexpected error occurred. Please try again.')
        }
      }
    } catch (error) {
      setErrorEmail('Failed to submit the form. Please try again later.')
      console.error('Error fetch:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="sign_form_container sign-up_form_container">
      <div className="header-sign-up">
        <div className="logo_container"></div>
        <div className="title_container">
          <p className="title">{title}</p>
          <span className="subtitle">
            Please enter your email address to receive a link.
          </span>
        </div>
      </div>

      <form
        className="sign_form"
        onSubmit={(e) => {
          handleSubmit(e)
        }}
      >
        <div className="input_container">
          <label className="input_label" htmlFor="email">
            Email
          </label>

          <Image
            className="icon-credential"
            width={30}
            height={30}
            src="/logos/email.svg"
            alt="email icon"
          />
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="name@mail.com"
            name="email"
            type="email"
            className={`input_field ${
              !isFormValid && form.email === '' ? 'input-error' : ''
            } `}
            id="email_field"
            autoComplete="email"
          />
        </div>

        {!isFormValid && <p className="form-error">Please fill Email field.</p>}
        {errorEmail && <p className="form-error">{errorEmail}</p>}

        <button type="submit" className="sign_btn" disabled={isLoading}>
          <span>Send me the link</span>
        </button>
      </form>
    </div>
  )
}
export default EmailRequestForm