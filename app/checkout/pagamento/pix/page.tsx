"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeftIcon, CopyIcon, CheckCircleIcon, ClockIcon, ArrowLeftIcon } from "lucide-react"

export default function CheckoutPix() {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 minutos em segundos
  const [isExpired, setIsExpired] = useState(false)

  // Código PIX fictício
  const pixCode =
    "00020126580014BR.GOV.BCB.PIX0136a629532e-7693-4846-b028-f142082d7b0752040000530398654041.005802BR5925PAYMILLES PAGAMENTOS6009SAO PAULO62070503***63041D14"

  // Formatar o tempo restante
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Contador regressivo
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  // Função para copiar o código PIX
  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  // Função para simular pagamento concluído
  const simulatePayment = () => {
    router.push("/checkout/confirmacao")
  }

  // Função para gerar novo código PIX
  const generateNewCode = () => {
    setIsExpired(false)
    setTimeLeft(30 * 60)
  }

  return (
    <div className="min-h-screen bg-[#fbfbfb]">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Image src="/images/logo.png" alt="paymilles" width={140} height={40} className="h-10 w-auto" />
          </div>
          <Link
            href="/checkout/pagamento"
            className="flex items-center bg-gray-100 px-4 py-2 rounded-full text-sm hover:bg-gray-200 transition-colors"
          >
            <ChevronLeftIcon size={16} className="mr-1" />
            Voltar
          </Link>
        </header>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Pagamento via PIX</h1>
              <div
                className={`flex items-center ${isExpired ? "text-red-500" : "text-blueroyal"} bg-gray-50 px-3 py-1 rounded-full`}
              >
                <ClockIcon size={16} className="mr-1" />
                <span className="font-medium text-sm">
                  {isExpired ? "Código expirado" : `Expira em ${formatTime(timeLeft)}`}
                </span>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center mb-6">
              <div className="bg-white p-4 border border-gray-200 rounded-md mb-4 shadow-sm">
                <Image
                  src="/placeholder.svg?height=200&width=200"
                  alt="QR Code PIX"
                  width={200}
                  height={200}
                  className="mx-auto"
                />
              </div>
              <p className="text-sm text-gray-500 text-center mb-2">
                Escaneie o QR Code acima com o aplicativo do seu banco
              </p>
              <div className="bg-green-100 text-green-600 px-3 py-1 rounded-md flex items-center">
                <CheckCircleIcon size={16} className="mr-1" />
                5% de desconto aplicado
              </div>
            </div>

            {/* PIX Code */}
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2 flex items-center">
                <svg
                  className="w-5 h-5 text-blueroyal mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  ></path>
                </svg>
                Ou copie o código PIX:
              </p>
              <div className="flex">
                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-l-md p-3 text-xs overflow-x-auto">
                  <code className="break-all">{pixCode}</code>
                </div>
                <button
                  onClick={copyPixCode}
                  className={`px-4 rounded-r-md flex items-center justify-center transition-colors ${
                    copied ? "bg-green-500 text-white" : "bg-blueroyal text-white hover:bg-blueroyal/90"
                  }`}
                >
                  {copied ? <CheckCircleIcon size={20} /> : <CopyIcon size={20} />}
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-200">
              <h3 className="font-medium mb-2 flex items-center">
                <svg
                  className="w-5 h-5 text-blueroyal mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                Como pagar com PIX:
              </h3>
              <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
                <li>Abra o aplicativo do seu banco</li>
                <li>Acesse a área PIX</li>
                <li>Escaneie o QR Code ou cole o código copiado</li>
                <li>Confirme as informações e finalize o pagamento</li>
              </ol>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push("/checkout/pagamento")}
                className="flex-1 border border-gray-300 bg-white text-gray-700 py-3 rounded-md flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ArrowLeftIcon size={16} className="mr-2" />
                Voltar para métodos de pagamento
              </button>

              {isExpired ? (
                <button
                  onClick={generateNewCode}
                  className="flex-1 bg-blueroyal text-white py-3 rounded-md flex items-center justify-center hover:bg-blueroyal/90 transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    ></path>
                  </svg>
                  Gerar novo código PIX
                </button>
              ) : (
                <button
                  onClick={simulatePayment}
                  className="flex-1 bg-green-500 text-white py-3 rounded-md flex items-center justify-center hover:bg-green-600 transition-colors"
                >
                  <CheckCircleIcon size={16} className="mr-2" />
                  Já realizei o pagamento
                </button>
              )}
            </div>

            <p className="text-sm text-gray-500 text-center mt-4">
              Após o pagamento, você receberá um e-mail de confirmação.
            </p>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h2 className="font-bold mb-4 flex items-center">
              <svg
                className="w-5 h-5 text-blueroyal mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                ></path>
              </svg>
              Resumo do pedido
            </h2>
            <div className="flex items-center mb-4">
              <div className="mr-3">
                <Image src="/placeholder.svg?height=60&width=40" alt="Yelly Plus Pro" width={40} height={60} />
              </div>
              <div>
                <h3 className="font-medium">Yelly Plus Pro</h3>
                <p className="text-sm text-gray-500">1 unidade</p>
              </div>
              <div className="ml-auto">
                <p className="font-medium">R$699,00</p>
                <p className="text-sm text-green-500">-R$34,95 (5% OFF)</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-4">
              <div className="flex justify-between mb-1">
                <span>Plano</span>
                <span>ECONOMIC (não antecipado)</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Subtotal</span>
                <span>R$699,00</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Desconto PIX (5%)</span>
                <span className="text-green-500">-R$34,95</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Frete</span>
                <span className="text-green-500">Grátis</span>
              </div>
              <div className="flex justify-between font-bold mt-2 text-lg">
                <span>Total</span>
                <span>R$664,05</span>
              </div>
            </div>

            <div className="bg-green-50 p-3 rounded-md flex items-start border border-green-100">
              <svg
                className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <p className="text-sm text-green-700">
                Seu pedido será processado assim que confirmarmos o pagamento do PIX.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

