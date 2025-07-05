"use client"

import React, { FormEvent, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signup } from "@/lib/action/auth"
import { useSearchParams } from "next/navigation"

export default function SignupPage() {
  const searchParams = useSearchParams()
  const message = searchParams.get("message")
  const [isLoading, setIsLoading] = useState(false)


  return (
    <>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Create account</CardTitle>
        <p className="text-gray-600 mt-2">Sign up to get started</p>
      </CardHeader>

      <form action={signup}>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full name
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              required
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              required
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm password
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              required
              className="w-full"
            />
          </div>

          <div>
            <label
              htmlFor="Role"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Role
            </label>
            <Input
              type="text"
              name="role"
              id="role"
              placeholder="fleet manager, customer, call center, cost center"
              className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 mt-4">
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </CardFooter>

        {message && <div className="text-red-500 text-center">{message}</div>}
      </form>
    </>
  )
}
