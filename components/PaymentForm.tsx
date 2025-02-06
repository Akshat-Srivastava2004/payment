"use client"

import { useState } from "react"
import axios from "axios"

export default function PaymentForm() {
  const [formData, setFormData] = useState({
    merchantid: "",
    amount: "",
    paymentid: "",
    payeeUpiId: "",
    payeeUpiName: "",
    successUrl: "http://localhost:3000/success",
    failureUrl: "http://localhost:3000/failure",
    redirectUrl: "https://www.kedbog.com/payment",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const paymentData = {
      paymentId: formData.paymentid,
      merchantId: formData.merchantid,
      amount: Number.parseFloat(formData.amount),
      payeeName: formData.payeeUpiName,
      payeeUpiId: formData.payeeUpiId,
      successUri: formData.successUrl,
      failureUri: formData.failureUrl,
      redirectUri: formData.redirectUrl,
    }

    try {
      const response = await axios.post("https://www.kedbog.com/payment/initiate", paymentData)
      console.log("Response:", response.data)

      const { status, redirectUrl } = response.data

      if (status === "success" && redirectUrl) {
        const paymentWindow = window.open(redirectUrl, "_blank")

        if (paymentWindow === null) {
          alert("Please allow popups for this website to complete the payment")
        }

        window.location.href = "/"
      } else {
        alert("Payment initialization failed. Please try again.")
      }
    } catch (error: unknown) {
      console.error("Payment initiation error:", error)

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message
        console.log("Error details:", error.response?.data)
        alert("Payment initiation failed: " + errorMessage)
      } else {
        alert("An unexpected error occurred. Please try again.")
      }
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Initiate Payment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key}>
            <label htmlFor={key} className="block text-sm font-medium text-gray-700">
              {key.charAt(0).toUpperCase() + key.slice(1)}:
            </label>
            <input
              type={key === "amount" ? "number" : "text"}
              id={key}
              name={key}
              value={value}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Initiate Payment
        </button>
      </form>
    </div>
  )
}

