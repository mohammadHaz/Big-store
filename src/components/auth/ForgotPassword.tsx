"use client"

import { FC, useState } from "react"
import { validate } from "email-validator"
import { useUIStore } from "@store/ui/ui.store"
import { Logo, Button, Input } from "@/components/ui"

const ForgotPassword: FC = () => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const { setModalView } = useUIStore()

  const disabled = submitted && !validate(email)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)

    if (!validate(email)) return

    try {
      setLoading(true)

      // await api.post("/auth/forgot-password", { email })

      setMessage("Password reset link sent")
    } catch {
      setMessage("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleResetPassword} className="w-80 flex flex-col justify-between p-3">
      <div className="flex justify-center pb-12">
        <Logo width="64px" height="64px" />
      </div>

      <div className="flex flex-col space-y-4">
        {message && (
          <div className="text-red border border-red p-3">
            {message}
          </div>
        )}

        <Input placeholder="Email" onChange={setEmail} type="email" />

        <Button variant="slim" type="submit" loading={loading} disabled={disabled}>
          Recover Password
        </Button>

        <span className="pt-3 text-center text-sm">
          <span className="text-accent-7">
            Do you have an account?
          </span>{" "}
          <button
            type="button"
            className="text-accent-9 font-bold hover:underline"
            onClick={() => setModalView("LOGIN_VIEW")}
          >
            Log In
          </button>
        </span>
      </div>
    </form>
  )
}

export default ForgotPassword