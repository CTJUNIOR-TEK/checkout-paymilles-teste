"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { CheckCircleIcon, TruckIcon, CalendarIcon, ReceiptIcon, HomeIcon } from "lucide-react"

export default function CheckoutConfirmacao() {
  // Simular um número de pedido
  const [orderNumber, setOrderNumber] = useState("")
  const [loading, setLoading] = useState(true)

  // Simular envio de e-mail de confirmação e carregamento da página
  useEffect(() => {
    const timer = setTimeout(() => {
      setOrderNumber(
        Math.floor(Math.random() * 1000000)
          .toString()
          .padStart(6, "0"),
      )
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Obter data estimada de entrega (7-15 dias a partir de hoje)
  const getEstimatedDeliveryDate = () => {
    const today = new Date()
    const minDelivery = new Date(today)
    minDelivery.setDate(today.getDate() + 7)

    const maxDelivery = new Date(today)
    maxDelivery.setDate(today.getDate() + 15)

    const formatDate = (date: Date) => {
      return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
    }

    return `${formatDate(minDelivery)} - ${formatDate(maxDelivery)}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbfbfb] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amarelo"></div>
          <p className="mt-4 text-gray-600">Processando seu pedido...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fbfbfb] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircleIcon size={48} className="text-green-500" />
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-2 text-center">Pedido Confirmado!</h1>
          <p className="text-gray-600 mb-6 text-center">Seu pedido #{orderNumber} foi realizado com sucesso.</p>

          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-lg">Detalhes do pedido</h2>
              <span className="text-sm text-gray-500">#{orderNumber}</span>
            </div>

            <div className="flex items-center mb-6 bg-white p-4 rounded-md border border-gray-100">
              <div className="mr-4">
                <Image src="/placeholder.svg?height=80&width=60" alt="Yelly Plus Pro" width={60} height={80} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Yelly Plus Pro</h3>
                <p className="text-sm text-gray-500">1 unidade</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs bg-goldbright text-goldraw px-2 py-0.5 rounded-full">
                    ECONOMIC (não antecipado)
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">R$699,00</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-4">
              <div className="flex justify-between mb-1 text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>R$699,00</span>
              </div>
              <div className="flex justify-between mb-1 text-sm">
                <span className="text-gray-600">Frete</span>
                <span className="text-green-500">Grátis</span>
              </div>
              <div className="flex justify-between font-medium mt-2">
                <span>Total</span>
                <span>R$699,00</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-goldbright p-3 rounded-md flex items-start">
                <TruckIcon size={18} className="text-blueroyal mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-goldraw">Entrega estimada</p>
                  <p className="text-goldraw">{getEstimatedDeliveryDate()}</p>
                </div>
              </div>

              <div className="bg-green-50 p-3 rounded-md flex items-start">
                <ReceiptIcon size={18} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-700">Pagamento</p>
                  <p className="text-green-600">Aprovado</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md mb-6 flex items-start">
            <CalendarIcon size={20} className="text-blueroyal mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Próximos passos</p>
              <ol className="text-sm text-gray-600 mt-2 space-y-2 list-decimal list-inside">
                <li>Enviamos um e-mail com os detalhes da sua compra</li>
                <li>Seu pedido está sendo preparado para envio</li>
                <li>Você receberá atualizações sobre o status do seu pedido</li>
                <li>Assim que o pedido for enviado, você receberá o código de rastreamento</li>
              </ol>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/"
              className="flex-1 bg-amarelo text-black font-medium py-3 rounded-md hover:bg-fundoBotoes transition-colors flex items-center justify-center"
            >
              <HomeIcon size={18} className="mr-2" />
              Voltar para a loja
            </Link>

            <Link
              href="#"
              className="flex-1 border border-gray-300 text-gray-700 font-medium py-3 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <ReceiptIcon size={18} className="mr-2" />
              Ver meus pedidos
            </Link>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Dúvidas? Entre em contato com nosso suporte:</p>
          <p className="font-medium">suporte@paymilles.com.br | (11) 9999-9999</p>
        </div>
      </div>
    </div>
  )
}

