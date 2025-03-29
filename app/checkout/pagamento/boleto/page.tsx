"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeftIcon, CopyIcon, CheckCircleIcon, PrinterIcon, DownloadIcon, ArrowLeftIcon } from "lucide-react"

export default function CheckoutBoleto() {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [countdown, setCountdown] = useState(3 * 24 * 60 * 60) // 3 dias em segundos

  // Código de barras fictício
  const barcodeNumber = "34191.79001 01043.510047 91020.150008 9 87770026000"

  // Formatar a data de vencimento (3 dias a partir de hoje)
  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + 3)
  const formattedDueDate = dueDate.toLocaleDateString("pt-BR")

  // Contador regressivo para o vencimento
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Formatar o tempo restante
  const formatCountdown = () => {
    const days = Math.floor(countdown / (24 * 60 * 60))
    const hours = Math.floor((countdown % (24 * 60 * 60)) / (60 * 60))
    const minutes = Math.floor((countdown % (60 * 60)) / 60)
    const seconds = countdown % 60

    return `${days}d ${hours}h ${minutes}m ${seconds}s`
  }

  // Função para copiar o código de barras
  const copyBarcode = () => {
    navigator.clipboard.writeText(barcodeNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  // Função para simular pagamento concluído
  const simulatePayment = () => {
    router.push("/checkout/confirmacao")
  }

  // Função para simular impressão do boleto
  const printBoleto = () => {
    window.print()
  }

  // Função para simular download do boleto
  const downloadBoleto = () => {
    alert("Função de download simulada. Em um ambiente real, isso baixaria o PDF do boleto.")
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
              <h1 className="text-2xl font-bold">Pagamento via Boleto</h1>
              <div className="text-sm text-gray-500 flex items-center">
                <span className="mr-2">Vencimento:</span>
                <span className="font-medium text-red-500">{formattedDueDate}</span>
              </div>
            </div>

            {/* Countdown */}
            <div className="bg-goldbright p-3 rounded-md mb-6 flex items-center justify-between">
              <div className="flex items-center">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span className="text-goldraw">Tempo restante para pagamento:</span>
              </div>
              <span className="font-bold text-goldraw">{formatCountdown()}</span>
            </div>

            {/* Boleto Preview */}
            <div className="border border-gray-200 rounded-md p-4 mb-6 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="flex items-center">
                    <div className="bg-amarelo h-8 w-8 flex items-center justify-center rounded-sm mr-2">
                      <span className="text-black font-bold text-sm">P</span>
                    </div>
                    <span className="font-medium">Paymilles</span>
                  </div>
                  <p className="text-sm text-gray-500">CNPJ: 12.345.678/0001-90</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    Valor: <span className="text-green-600">R$699,00</span>
                  </p>
                  <p className="text-sm text-gray-500">Vencimento: {formattedDueDate}</p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-md mb-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Código de barras:</span>
                  <div className="flex items-center">
                    <button
                      onClick={copyBarcode}
                      className={`px-2 py-1 rounded-md flex items-center text-xs mr-2 transition-colors ${
                        copied ? "bg-green-100 text-green-600" : "bg-goldbright text-blueroyal hover:bg-goldbright/80"
                      }`}
                    >
                      {copied ? (
                        <>
                          <CheckCircleIcon size={14} className="mr-1" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <CopyIcon size={14} className="mr-1" />
                          Copiar
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="font-mono text-sm break-all bg-gray-50 p-2 rounded border border-gray-100">
                  {barcodeNumber}
                </div>
              </div>

              <div className="flex justify-center mb-4">
                <div className="bg-white p-2 border border-gray-200 rounded-md">
                  <Image
                    src="/placeholder.svg?height=80&width=300"
                    alt="Código de barras"
                    width={300}
                    height={80}
                    className="mx-auto"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={printBoleto}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-md flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <PrinterIcon size={16} className="mr-2" />
                  Imprimir
                </button>
                <button
                  onClick={downloadBoleto}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-md flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <DownloadIcon size={16} className="mr-2" />
                  Download PDF
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
                Observações
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Ao confirmar o pagamento via boleto, será gerado um código de barras para visualização. Basta copiar o
                código de barras e informar dentro do aplicativo do seu banco para prosseguir com o seu pagamento.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
                <p className="text-sm text-yellow-700 flex items-start">
                  <svg
                    className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    ></path>
                  </svg>
                  <span>
                    O boleto tem vencimento em 3 dias úteis. Após este prazo, o pedido será automaticamente cancelado.
                  </span>
                </p>
              </div>
            </div>

            {/* How to pay */}
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  ></path>
                </svg>
                Como pagar com Boleto:
              </h3>
              <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
                <li>Copie o código de barras acima</li>
                <li>Abra o aplicativo do seu banco</li>
                <li>Acesse a área de pagamentos ou boletos</li>
                <li>Cole o código copiado e confirme o pagamento</li>
                <li>Alternativamente, você pode imprimir o boleto e pagar em uma agência bancária ou lotérica</li>
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
              <button
                onClick={simulatePayment}
                className="flex-1 bg-green-500 text-white py-3 rounded-md flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <CheckCircleIcon size={16} className="mr-2" />
                Já realizei o pagamento
              </button>
            </div>

            <p className="text-sm text-gray-500 text-center mt-4">
              Após o pagamento, você receberá um e-mail de confirmação.
              <br />O processamento do boleto pode levar até 3 dias úteis.
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
                <span>Frete</span>
                <span className="text-green-500">Grátis</span>
              </div>
              <div className="flex justify-between font-bold mt-2 text-lg">
                <span>Total</span>
                <span>R$699,00</span>
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
                Seu pedido será processado assim que confirmarmos o pagamento do boleto.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

