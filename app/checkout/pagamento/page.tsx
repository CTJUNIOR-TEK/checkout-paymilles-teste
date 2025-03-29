"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  InfoIcon,
  TruckIcon,
  MinusIcon,
  PlusIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ShieldIcon,
} from "lucide-react"
import { IMaskInput } from "react-imask"

type PaymentFormData = {
  paymentMethod: "credit" | "boleto" | "pix"
  cardNumber: string
  cardHolder: string
  expiryDate: string
  cvv: string
  installments: string
}

export default function CheckoutPagamento() {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [coupon, setCoupon] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"credit" | "boleto" | "pix">("credit")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const unitPrice = 699.0
  const totalPrice = unitPrice * quantity
  const pixDiscount = paymentMethod === "pix" ? totalPrice * 0.05 : 0
  const finalPrice = totalPrice - pixDiscount
  const installmentValue = (finalPrice / 12).toFixed(2)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PaymentFormData>({
    defaultValues: {
      paymentMethod: "credit",
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: "",
      installments: `1 x de R$${finalPrice.toFixed(2)}`,
    },
  })

  // Atualizar o valor das parcelas quando o preço final mudar
  useEffect(() => {
    setValue("installments", `1 x de R$${finalPrice.toFixed(2)}`)
  }, [finalPrice, setValue])

  const onSubmit = (data: PaymentFormData) => {
    setIsSubmitting(true)
    console.log("Dados de pagamento:", data)

    // Salvar os dados no localStorage para persistência entre páginas
    localStorage.setItem("paymentData", JSON.stringify(data))

    // Simular processamento de pagamento
    setTimeout(() => {
      setIsSubmitting(false)

      // Mostrar detalhes do pagamento específico ou redirecionar para página de confirmação
      if (data.paymentMethod === "credit") {
        // Para cartão de crédito, vamos direto para a confirmação
        router.push("/checkout/confirmacao")
      } else {
        // Se for PIX ou Boleto, redirecionar para a página específica
        if (data.paymentMethod === "pix") {
          router.push("/checkout/pagamento/pix")
        } else if (data.paymentMethod === "boleto") {
          router.push("/checkout/pagamento/boleto")
        }
      }
    }, 1500)
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  const applyCoupon = () => {
    alert(`Cupom "${coupon}" aplicado!`)
  }

  // Gerar opções de parcelamento
  const installmentOptions = Array.from({ length: 12 }, (_, i) => {
    const installmentNumber = i + 1
    const value = (finalPrice / installmentNumber).toFixed(2).replace(".", ",")
    return `${installmentNumber} x de R$${value}`
  })

  // Detectar bandeira do cartão
  const getCardType = (cardNumber: string) => {
    const cleanNumber = cardNumber.replace(/\D/g, "")

    if (/^4/.test(cleanNumber)) return "Visa"
    if (/^5[1-5]/.test(cleanNumber)) return "Mastercard"
    if (/^3[47]/.test(cleanNumber)) return "American Express"
    if (/^(6011|65|64[4-9])/.test(cleanNumber)) return "Discover"

    return null
  }

  const cardNumber = watch("cardNumber")
  const cardType = getCardType(cardNumber)

  return (
    <div className="min-h-screen bg-[#fbfbfb]">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Image src="/images/logo.png" alt="paymilles" width={140} height={40} className="h-10 w-auto" />
          </div>
          <Link
            href="/checkout/endereco"
            className="flex items-center bg-gray-100 px-4 py-2 rounded-full text-sm hover:bg-gray-200 transition-colors"
          >
            <ChevronLeftIcon size={16} className="mr-1" />
            Voltar
          </Link>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {/* Checkout Steps */}
            <div className="flex items-center mb-8 text-sm">
              <Link href="/checkout/dados" className="text-gray-400 hover:text-gray-600">
                Seus dados
              </Link>
              <ChevronRightIcon size={16} className="mx-2 text-gray-400" />
              <Link href="/checkout/endereco" className="text-gray-400 hover:text-gray-600">
                Endereço de entrega
              </Link>
              <ChevronRightIcon size={16} className="mx-2 text-gray-400" />
              <span className="font-bold">Pagamento</span>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
            >
              {/* Payment Method Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <button
                  type="button"
                  className={`flex flex-col items-center justify-center p-4 border rounded-md transition-all ${
                    paymentMethod === "credit"
                      ? "border-highlight bg-goldbright shadow-sm"
                      : "border-gray-300 hover:border-blue-300 hover:bg-blue-50/30"
                  }`}
                  onClick={() => {
                    setPaymentMethod("credit")
                    setValue("paymentMethod", "credit")
                  }}
                >
                  <CreditCardIcon
                    className={`mb-2 ${paymentMethod === "credit" ? "text-blueroyal" : "text-gray-500"}`}
                  />
                  <span className={paymentMethod === "credit" ? "text-blueroyal font-medium" : "text-gray-700"}>
                    Cartão de crédito
                  </span>
                </button>

                <button
                  type="button"
                  className={`flex flex-col items-center justify-center p-4 border rounded-md transition-all ${
                    paymentMethod === "boleto"
                      ? "border-highlight bg-goldbright shadow-sm"
                      : "border-gray-300 hover:border-blue-300 hover:bg-blue-50/30"
                  }`}
                  onClick={() => {
                    setPaymentMethod("boleto")
                    setValue("paymentMethod", "boleto")
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`mb-2 ${paymentMethod === "boleto" ? "text-blueroyal" : "text-gray-500"}`}
                  >
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <line x1="7" y1="8" x2="17" y2="8" />
                    <line x1="7" y1="12" x2="17" y2="12" />
                    <line x1="7" y1="16" x2="13" y2="16" />
                  </svg>
                  <span className={paymentMethod === "boleto" ? "text-blueroyal font-medium" : "text-gray-700"}>
                    Boleto
                  </span>
                </button>

                <button
                  type="button"
                  className={`flex flex-col items-center justify-center p-4 border rounded-md relative transition-all ${
                    paymentMethod === "pix"
                      ? "border-highlight bg-goldbright shadow-sm"
                      : "border-gray-300 hover:border-blue-300 hover:bg-blue-50/30"
                  }`}
                  onClick={() => {
                    setPaymentMethod("pix")
                    setValue("paymentMethod", "pix")
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`mb-2 ${paymentMethod === "pix" ? "text-blueroyal" : "text-gray-500"}`}
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                  <span className={paymentMethod === "pix" ? "text-blueroyal font-medium" : "text-gray-700"}>PIX</span>

                  {/* 5% OFF Badge */}
                  <div className="absolute top-1 right-1 bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full flex items-center">
                    <CheckCircleIcon size={12} className="mr-1" />
                    5% OFF
                  </div>
                </button>
              </div>

              {/* Credit Card Form */}
              {paymentMethod === "credit" && (
                <>
                  {/* Card Number */}
                  <div className="mb-4">
                    <label htmlFor="cardNumber" className="block mb-1 text-sm font-medium">
                      Número do cartão de crédito<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <IMaskInput
                        id="cardNumber"
                        mask="0000 0000 0000 0000"
                        unmask={false}
                        className={`w-full border ${errors.cardNumber ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 pr-10`}
                        placeholder="0000 0000 0000 0000"
                        {...register("cardNumber", {
                          required: "Número do cartão é obrigatório",
                        })}
                        onAccept={(value) => setValue("cardNumber", value)}
                      />
                      {cardType && (
                        <div className="absolute right-3 top-2.5">
                          <span className="text-xs font-medium bg-goldbright text-goldraw px-2 py-0.5 rounded">
                            {cardType}
                          </span>
                        </div>
                      )}
                    </div>
                    {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber.message}</p>}
                  </div>

                  {/* Card Holder */}
                  <div className="mb-4">
                    <label htmlFor="cardHolder" className="block mb-1 text-sm font-medium">
                      Titular do cartão<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="cardHolder"
                      type="text"
                      className={`w-full border ${errors.cardHolder ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2`}
                      placeholder="Digite o nome escrito no cartão de crédito"
                      {...register("cardHolder", { required: "Nome do titular é obrigatório" })}
                    />
                    {errors.cardHolder && <p className="text-red-500 text-sm mt-1">{errors.cardHolder.message}</p>}
                  </div>

                  {/* Expiry Date and CVV */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="expiryDate" className="block mb-1 text-sm font-medium">
                        Validade<span className="text-red-500">*</span>
                      </label>
                      <IMaskInput
                        id="expiryDate"
                        mask="00/0000"
                        unmask={false}
                        className={`w-full border ${errors.expiryDate ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2`}
                        placeholder="MM/YYYY"
                        {...register("expiryDate", {
                          required: "Data de validade é obrigatória",
                        })}
                        onAccept={(value) => setValue("expiryDate", value)}
                      />
                      {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block mb-1 text-sm font-medium">
                        CVV<span className="text-red-500">*</span>
                      </label>
                      <IMaskInput
                        id="cvv"
                        mask="0000"
                        unmask={false}
                        className={`w-full border ${errors.cvv ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2`}
                        placeholder="0000"
                        {...register("cvv", {
                          required: "CVV é obrigatório",
                        })}
                        onAccept={(value) => setValue("cvv", value)}
                      />
                      {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv.message}</p>}
                    </div>
                  </div>

                  {/* Installments */}
                  <div className="mb-6">
                    <label htmlFor="installments" className="block mb-1 text-sm font-medium">
                      Número de parcelas<span className="text-red-500">*</span>
                    </label>
                    <select
                      id="installments"
                      className={`w-full border ${errors.installments ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2`}
                      {...register("installments", { required: "Número de parcelas é obrigatório" })}
                    >
                      {installmentOptions.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {errors.installments && <p className="text-red-500 text-sm mt-1">{errors.installments.message}</p>}
                  </div>

                  <div className="bg-goldbright p-3 rounded-md mb-6 flex items-start">
                    <ShieldIcon size={18} className="text-blueroyal mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-goldraw">
                      Seus dados de pagamento estão protegidos com criptografia de ponta a ponta.
                    </p>
                  </div>
                </>
              )}

              {/* Boleto Payment */}
              {paymentMethod === "boleto" && (
                <div className="bg-gray-50 p-4 rounded-md mb-6">
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
                    Ao confirmar o pagamento via boleto, será gerado um código de barras para visualização. Basta copiar
                    o código de barras e informar dentro do aplicativo do seu banco para prosseguir com o seu pagamento.
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
                        O boleto tem vencimento em 3 dias úteis. Após este prazo, o pedido será automaticamente
                        cancelado.
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {/* PIX Payment */}
              {paymentMethod === "pix" && (
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 text-green-600 px-3 py-1 rounded-md flex items-center mr-3">
                      <CheckCircleIcon size={16} className="mr-1" />
                      5% de desconto
                    </div>
                    <p className="text-sm text-gray-600">
                      De <span className="line-through">R${totalPrice.toFixed(2).replace(".", ",")}</span> por{" "}
                      <span className="font-bold text-green-600">R${finalPrice.toFixed(2).replace(".", ",")}</span>
                    </p>
                  </div>
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
                    Ao confirmar o pagamento via PIX, será gerado um QR Code e um código para cópia. Basta escanear o QR
                    Code ou copiar o código e informar dentro do aplicativo do seu banco para prosseguir com o seu
                    pagamento.
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
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <span>
                        O PIX tem validade de 30 minutos. Após este prazo, será necessário gerar um novo código.
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {/* Error message */}
              {Object.keys(errors).length > 0 && (
                <p className="text-red-500 text-sm mb-4">Preencha todos os campos obrigatórios*</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-md flex items-center justify-center transition-colors ${
                  isSubmitting
                    ? "bg-fundoBotoes text-white cursor-not-allowed"
                    : "bg-blueroyal text-white hover:bg-blueroyal/90"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    Finalizar compra <ChevronRightIcon size={16} className="ml-1" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Cart Summary */}
          <div className="w-full lg:w-80">
            <div className="bg-amarelo text-center py-4 rounded-t-lg font-medium">Carrinho</div>
            <div className="bg-[#eceef4] p-4 rounded-b-lg">
              {/* Product */}
              <div className="bg-white p-4 rounded-md mb-4 shadow-sm">
                <div className="flex items-center">
                  <div className="mr-3">
                    <Image src="/placeholder.svg?height=60&width=40" alt="Yelly Plus Pro" width={40} height={60} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Yelly Plus Pro</h3>
                    <p className="text-sm text-gray-500">{quantity} unidade</p>
                    <p className="font-medium">R${totalPrice.toFixed(2).replace(".", ",")}</p>
                  </div>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      className="px-2 py-1 hover:bg-gray-100 transition-colors"
                    >
                      <MinusIcon size={16} />
                    </button>
                    <span className="px-2 py-1">{quantity}</span>
                    <button
                      type="button"
                      onClick={increaseQuantity}
                      className="px-2 py-1 text-blueroyal hover:bg-blue-50 transition-colors"
                    >
                      <PlusIcon size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-300 pb-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span>Plano</span>
                  <span>ECONOMIC (não antecipado)</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>R${totalPrice.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete</span>
                  <span className="text-green-500">Grátis</span>
                </div>
                {paymentMethod === "pix" && (
                  <div className="flex justify-between mt-2 text-green-600">
                    <span>Desconto PIX (5%)</span>
                    <span>-R${pixDiscount.toFixed(2).replace(".", ",")}</span>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <span className="mr-2">Cupom</span>
                  <div className="flex flex-1">
                    <input
                      type="text"
                      className="border border-gray-300 rounded-l-md px-3 py-1 w-full text-sm"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      className="bg-blueroyal text-white px-3 py-1 rounded-r-md text-sm hover:bg-blueroyal/90 transition-colors"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>

                <div className="flex justify-between mb-1">
                  <span className="font-medium">Total</span>
                  <span className="font-medium">R${finalPrice.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="text-right text-xs text-gray-500 mb-4">
                  ou em até 12x de R${installmentValue.replace(".", ",")}
                </div>
              </div>

              <div className="bg-blue-100 p-3 rounded-md mb-4 flex items-start">
                <InfoIcon size={16} className="text-blue-500 mr-2 mt-1 flex-shrink-0" />
                <p className="text-xs text-blue-800">
                  **Sul, Sudeste, Centro-oeste: 2-15 dias úteis
                  <br />
                  Nordeste e Norte: 5 a 20 dias úteis
                </p>
              </div>

              <div className="bg-green-100 p-3 rounded-md mb-4 flex items-start">
                <TruckIcon size={16} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                <p className="text-xs text-green-800">Frete grátis para todo o Brasil</p>
              </div>

              <div className="text-xs text-gray-500 space-y-3">
                <p>
                  **Prazo válido após a criação do cadastro em nosso portal com sua aprovação e criação da conta com
                  taxas especiais.
                </p>
                <p>Consulte em nosso site taxas de parcelamento até 18x.</p>
                <p>Em caso de UPGRADE é necessário solicitar a nossa equipe a atualização das taxas.</p>
                <p>
                  Ao continuar você aceita os{" "}
                  <Link href="#" className="text-blue-500 hover:underline">
                    Termos e Condições de Uso
                  </Link>
                  <br />
                  Ao continuar você concorda com a{" "}
                  <Link href="#" className="text-blue-500 hover:underline">
                    Política de Privacidade
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

