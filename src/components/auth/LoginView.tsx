"use client"

import { useEffect, useState, useCallback } from "react"
import { Logo, Button, Input } from "@/components/ui"
import { useUIStore } from "@store/ui/ui.store"
// import useLogin from "@/framework/auth/use-login"
import { validate } from "email-validator"

const LoginView: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [dirty, setDirty] = useState(false)
  const [disabled, setDisabled] = useState(false)

  const { setModalView, closeModal } = useUIStore()
//   const login = useLogin()

  const handleValidation = useCallback(() => {
    const validPassword = /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)

    if (dirty) {
      setDisabled(
        !validate(email) ||
        password.length < 7 ||
        !validPassword
      )
    }
  }, [email, password, dirty])

  useEffect(() => {
    handleValidation()
  }, [handleValidation])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!dirty) {
      setDirty(true)
      handleValidation()
      return
    }

    try {
      setLoading(true)
      setMessage("")

    //   await login({
    //     email,
    //     password,
    //   })

      closeModal()

    } catch (error: any) {
      if (Array.isArray(error?.errors)) {
        setMessage(
          error.errors
            .map((e: any) => e.message)
            .join("\n")
        )
      } else {
        setMessage("Unexpected error")
      }

      setDisabled(false)

    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      className="w-80 flex flex-col justify-between p-3"
    >
      <div className="flex justify-center pb-12">
        <Logo width="64px" height="64px" />
      </div>

      <div className="flex flex-col space-y-3">

        {message && (
          <div className="text-red border border-red p-3">
            {message}
            {" "}
            Did you{" "}
            <button
              type="button"
              className="text-accent-9 font-bold hover:underline"
              onClick={() => setModalView("FORGOT_VIEW")}
            >
              forgot your password?
            </button>
          </div>
        )}

        <Input
          type="email"
          placeholder="Email"
          onChange={setEmail}
        />

        <Input
          type="password"
          placeholder="Password"
          onChange={setPassword}
        />

        <Button
          variant="slim"
          type="submit"
          loading={loading}
          disabled={disabled}
        >
          Log In
        </Button>

        <div className="pt-1 text-center text-sm">
          <span className="text-accent-7">
            Don't have an account?
          </span>{" "}
          <button
            type="button"
            className="text-accent-9 font-bold hover:underline"
            onClick={() => setModalView("SIGNUP_VIEW")}
          >
            Sign Up
          </button>
        </div>

      </div>
    </form>
  )
}

export default LoginView