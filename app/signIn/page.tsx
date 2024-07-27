import SignInForm from '@/components/form/signInForm'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

const SignIn = async () => {
  const session = await auth()

  if (session) {
    redirect('/dashboard')
  }
  return <SignInForm />
}
export default SignIn
