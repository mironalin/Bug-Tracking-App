import { SignUpCard } from '@/features/auth/components/sign-up-card'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authPages/sign-up')({
  component: SignUp,
})

function SignUp() {
  return <SignUpCard></SignUpCard>
}
