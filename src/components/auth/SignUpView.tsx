"use client"

import { FC, useEffect, useState, useCallback } from "react"
import { validate } from "email-validator"
import { Info } from "@/components/icons"
import { Logo, Button, Input } from "@/components/ui"
import { useUIStore } from "@store/ui/ui.store"
// import useSignup from "@/framework/auth/use-signup"

const SignUpView: FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [dirty, setDirty] = useState(false)
  const [disabled, setDisabled] = useState(false)

//   const signup = useSignup()
  const { setModalView, closeModal } = useUIStore()

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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!dirty) {
      setDirty(true)
      handleValidation()
      return
    }

    try {
      setLoading(true)
      setMessage("")

    //   await signup({
    //     email,
    //     firstName,
    //     lastName,
    //     password,
    //   })

      closeModal()

    } catch (error: any) {
      console.error(error)

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
      onSubmit={handleSignup}
      className="w-80 flex flex-col justify-between p-3"
    >
      <div className="flex justify-center pb-12">
        <Logo width="64px" height="64px" />
      </div>

      <div className="flex flex-col space-y-4">

        {message && (
          <div className="text-red border border-red p-3">
            {message}
          </div>
        )}

        <Input
          placeholder="First Name"
          onChange={setFirstName}
        />

        <Input
          placeholder="Last Name"
          onChange={setLastName}
        />

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

        <span className="text-accent-8">
          <span className="inline-block align-middle">
            <Info width="15" height="15" />
          </span>{" "}
          <span className="leading-6 text-sm">
            <strong>Info</strong>: Passwords must be longer than 7 chars and include numbers.
          </span>
        </span>

        <Button
          variant="slim"
          type="submit"
          loading={loading}
          disabled={disabled}
        >
          Sign Up
        </Button>

        <span className="pt-1 text-center text-sm">
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

export default SignUpView