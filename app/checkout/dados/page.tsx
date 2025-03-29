"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { ChevronLeftIcon, ChevronRightIcon, InfoIcon, TruckIcon, MinusIcon, PlusIcon } from "lucide-react"
import { IMaskInput } from "react-imask"

type FormData = {
  documentType: "CPF" | "CNPJ"
  document: string
  firstName: string
  lastName: string
  email: string
  phone: string
  termsAccepted: boolean
  privacyAccepted: boolean
}

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
}

export default function CheckoutDados() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [coupon, setCoupon] = useState("")

  useEffect(() => {
    // Carregar itens do carrinho do localStorage
    const savedCart = localStorage.getItem("cartItems")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      documentType: "CPF",
      document: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      termsAccepted: false,
      privacyAccepted: false,
    },
  })

  const documentType = watch("documentType")

  const onSubmit = (data: FormData) => {
    console.log("Formulário enviado com sucesso:", data)
    // Salvar os dados no localStorage para persistência entre páginas
    localStorage.setItem("userData", JSON.stringify(data))
    // Redirecionar para a próxima página
    router.push("/checkout/endereco")
  }

  const updateQuantity = (id: string, change: number) => {
    const updatedCart = cartItems
      .map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + change)
          return { ...item, quantity: newQuantity }
        }
        return item
      })
      .filter((item) => item.quantity > 0)

    setCartItems(updatedCart)
    localStorage.setItem("cartItems", JSON.stringify(updatedCart))
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const subtotal = calculateSubtotal()
  const total = subtotal
  const installmentValue = (total / 12).toFixed(2)

  const applyCoupon = () => {
    // Implementação do cupom ficaria aqui
    alert(`Cupom "${coupon}" aplicado!`)
  }

  return (
    <div className="min-h-screen bg-[#fbfbfb]">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Image src="/images/logo.png" alt="paymilles" width={140} height={40} className="h-10 w-auto" />
          </div>
          <Link href="/" className="flex items-center bg-gray-100 px-4 py-2 rounded-full text-sm">
            <ChevronLeftIcon size={16} className="mr-1" />
            Voltar
          </Link>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {/* Checkout Steps */}
            <div className="flex items-center mb-8 text-sm">
              <span className="font-bold">Seus dados</span>
              <ChevronRightIcon size={16} className="mx-2 text-gray-400" />
              <span className="text-gray-400">Endereço de entrega</span>
              <ChevronRightIcon size={16} className="mx-2 text-gray-400" />
              <span className="text-gray-400">Pagamento</span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg p-6 border border-gray-200">
              {/* Document Type */}
              <div className="mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      id="cpf"
                      type="radio"
                      value="CPF"
                      {...register("documentType")}
                      className="w-4 h-4 text-blueroyal"
                    />
                    <label htmlFor="cpf" className="ml-2">
                      CPF
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="cnpj"
                      type="radio"
                      value="CNPJ"
                      {...register("documentType")}
                      className="w-4 h-4 text-blueroyal"
                    />
                    <label htmlFor="cnpj" className="ml-2">
                      CNPJ
                    </label>
                  </div>
                  <span className="text-red-500">*</span>
                </div>

                <div className="mt-2">
                  <IMaskInput
                    mask={documentType === "CPF" ? "000.000.000-00" : "00.000.000/0000-00"}
                    unmask={false}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder={documentType === "CPF" ? "000.000.000-00" : "00.000.000/0000-00"}
                    {...register("document", {
                      required: "Este campo é obrigatório",
                    })}
                    onAccept={(value) => {
                      setValue("document", value)
                    }}
                  />
                  {errors.document && <p className="text-red-500 text-sm mt-1">{errors.document.message}</p>}
                </div>
              </div>

              {/* Name and Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="firstName" className="block mb-1">
                    Nome<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    {...register("firstName", { required: "Nome é obrigatório" })}
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label htmlFor="lastName" className="block mb-1">
                    Sobrenome<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    {...register("lastName", { required: "Sobrenome é obrigatório" })}
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                </div>
              </div>

              {/* Email and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="email" className="block mb-1">
                    E-mail<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    {...register("email", {
                      required: "E-mail é obrigatório",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "E-mail inválido",
                      },
                    })}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block mb-1">
                    Whatsapp/Celular<span className="text-red-500">*</span>
                  </label>
                  <IMaskInput
                    mask="(00) 00000-0000"
                    unmask={false}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="(00) 00000-0000"
                    {...register("phone", {
                      required: "Telefone é obrigatório",
                    })}
                    onAccept={(value) => {
                      setValue("phone", value)
                    }}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              {/* Terms and Privacy */}
              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <input
                    id="termsAccepted"
                    type="checkbox"
                    className="mt-1 w-4 h-4"
                    {...register("termsAccepted", { required: "Você precisa aceitar os termos de uso" })}
                  />
                  <label htmlFor="termsAccepted" className="ml-2 text-sm text-gray-600">
                    Li e aceito os{" "}
                    <Link href="#" className="text-blueroyal">
                      Termos e Condições de Uso
                    </Link>
                  </label>
                </div>
                {errors.termsAccepted && <p className="text-red-500 text-sm">{errors.termsAccepted.message}</p>}

                <div className="flex items-start">
                  <input
                    id="privacyAccepted"
                    type="checkbox"
                    className="mt-1 w-4 h-4"
                    {...register("privacyAccepted", { required: "Você precisa aceitar a política de privacidade" })}
                  />
                  <label htmlFor="privacyAccepted" className="ml-2 text-sm text-gray-600">
                    Li e concordo com a{" "}
                    <Link href="#" className="text-blueroyal">
                      Política de Privacidade
                    </Link>
                  </label>
                </div>
                {errors.privacyAccepted && <p className="text-red-500 text-sm">{errors.privacyAccepted.message}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-fundoBotoes text-white py-3 rounded-md flex items-center justify-center hover:bg-corGradiente transition-colors"
              >
                Continuar para entrega <ChevronRightIcon size={16} className="ml-1" />
              </button>
            </form>
          </div>

          {/* Cart Summary */}
          <div className="w-full lg:w-80">
            <div className="bg-amarelo text-center py-4 rounded-t-lg font-medium">Carrinho</div>
            <div className="bg-[#eceef4] p-4 rounded-b-lg">
              {/* Products */}
              {cartItems.length > 0 ? (
                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-md flex items-center">
                      <div className="mr-3">
                        <Image
                          src="/images/maquina.png"
                          alt={item.name}
                          width={40}
                          height={60}
                          className="h-14 w-auto object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.quantity} unidade(s)</p>
                        <p className="font-medium">R${(item.price * item.quantity).toFixed(2).replace(".", ",")}</p>
                      </div>
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button type="button" onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1">
                          <MinusIcon size={16} />
                        </button>
                        <span className="px-2 py-1">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2 py-1 text-blueroyal"
                        >
                          <PlusIcon size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-4 rounded-md mb-4 text-center">
                  <p className="text-gray-500">Seu carrinho está vazio</p>
                </div>
              )}

              <div className="border-b border-gray-300 pb-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span>Plano</span>
                  <span>ECONOMIC (não antecipado)</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>R${subtotal.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete</span>
                  <span className="text-green-500">Grátis</span>
                </div>
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
                      className="bg-blueroyal text-white px-3 py-1 rounded-r-md text-sm"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>

                <div className="flex justify-between mb-1">
                  <span className="font-medium">Total</span>
                  <span className="font-medium">R${total.toFixed(2).replace(".", ",")}</span>
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
                  <Link href="#" className="text-blueroyal">
                    Termos e Condições de Uso
                  </Link>
                  <br />
                  Ao continuar você concorda com a{" "}
                  <Link href="#" className="text-blueroyal">
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

