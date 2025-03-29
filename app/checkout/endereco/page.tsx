"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { ChevronLeftIcon, ChevronRightIcon, InfoIcon, TruckIcon, MinusIcon, PlusIcon } from "lucide-react"

type AddressFormData = {
  cep: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
}

export default function CheckoutEndereco() {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [coupon, setCoupon] = useState("")
  const [cepError, setCepError] = useState("")
  const [isLoadingCep, setIsLoadingCep] = useState(false)
  const unitPrice = 699.0
  const totalPrice = unitPrice * quantity
  const installmentValue = (totalPrice / 12).toFixed(2)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddressFormData>({
    defaultValues: {
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
    },
  })

  const cep = watch("cep")

  useEffect(() => {
    // Função para buscar endereço pelo CEP
    const fetchAddressByCep = async () => {
      // Remover caracteres não numéricos
      const cleanCep = cep.replace(/\D/g, "")

      // Verificar se o CEP tem 8 dígitos
      if (cleanCep.length !== 8) return

      setIsLoadingCep(true)
      setCepError("")

      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
        const data = await response.json()

        if (data.erro) {
          setCepError("CEP não encontrado")
          return
        }

        // Preencher os campos com os dados retornados
        setValue("logradouro", data.logradouro || "")
        setValue("bairro", data.bairro || "")
        setValue("cidade", data.localidade || "")
        setValue("estado", data.uf || "")

        // Focar no campo número após preencher o endereço
        document.getElementById("numero")?.focus()
      } catch (error) {
        setCepError("Erro ao buscar CEP")
      } finally {
        setIsLoadingCep(false)
      }
    }

    // Buscar endereço quando o CEP tiver 8 dígitos (sem considerar formatação)
    if (cep && cep.replace(/\D/g, "").length === 8) {
      fetchAddressByCep()
    }
  }, [cep, setValue])

  const onSubmit = (data: AddressFormData) => {
    console.log("Endereço enviado com sucesso:", data)
    // Salvar os dados no localStorage para persistência entre páginas
    localStorage.setItem("addressData", JSON.stringify(data))
    // Redirecionar para a próxima página
    router.push("/checkout/pagamento")
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
          <Link href="/checkout/dados" className="flex items-center bg-gray-100 px-4 py-2 rounded-full text-sm">
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
              <span className="font-bold">Endereço de entrega</span>
              <ChevronRightIcon size={16} className="mx-2 text-gray-400" />
              <span className="text-gray-400">Pagamento</span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg p-6 border border-gray-200">
              {/* CEP */}
              <div className="mb-6">
                <label htmlFor="cep" className="block mb-1">
                  CEP<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="cep"
                    type="text"
                    className={`w-full border ${errors.cep || cepError ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2`}
                    placeholder="00.000-000"
                    {...register("cep", {
                      required: "CEP é obrigatório",
                      pattern: {
                        value: /^\d{5}-?\d{3}$/,
                        message: "CEP inválido",
                      },
                    })}
                  />
                  {isLoadingCep && (
                    <div className="absolute right-3 top-2">
                      <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                    </div>
                  )}
                </div>
                {errors.cep && <p className="text-red-500 text-sm mt-1">{errors.cep.message}</p>}
                {cepError && <p className="text-red-500 text-sm mt-1">{cepError}</p>}
              </div>

              {/* Logradouro */}
              <div className="mb-6">
                <label htmlFor="logradouro" className="block mb-1">
                  Logradouro<span className="text-red-500">*</span>
                </label>
                <input
                  id="logradouro"
                  type="text"
                  className={`w-full border ${errors.logradouro ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2`}
                  placeholder="Ex.: Rua dos Ventos"
                  {...register("logradouro", { required: "Logradouro é obrigatório" })}
                />
                {errors.logradouro && <p className="text-red-500 text-sm mt-1">{errors.logradouro.message}</p>}
              </div>

              {/* Número e Complemento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="numero" className="block mb-1">
                    Número<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="numero"
                    type="text"
                    className={`w-full border ${errors.numero ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2`}
                    placeholder="000"
                    {...register("numero", { required: "Número é obrigatório" })}
                  />
                  {errors.numero && <p className="text-red-500 text-sm mt-1">{errors.numero.message}</p>}
                </div>
                <div>
                  <label htmlFor="complemento" className="block mb-1">
                    Complemento
                  </label>
                  <input
                    id="complemento"
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Ex.: Apto 302"
                    {...register("complemento")}
                  />
                </div>
              </div>

              {/* Bairro e Cidade */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="bairro" className="block mb-1">
                    Bairro<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="bairro"
                    type="text"
                    className={`w-full border ${errors.bairro ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2`}
                    placeholder="Ex.: Caiçaras"
                    {...register("bairro", { required: "Bairro é obrigatório" })}
                  />
                  {errors.bairro && <p className="text-red-500 text-sm mt-1">{errors.bairro.message}</p>}
                </div>
                <div>
                  <label htmlFor="cidade" className="block mb-1">
                    Cidade<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="cidade"
                    type="text"
                    className={`w-full border ${errors.cidade ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2`}
                    placeholder="Ex.: São Paulo"
                    {...register("cidade", { required: "Cidade é obrigatória" })}
                  />
                  {errors.cidade && <p className="text-red-500 text-sm mt-1">{errors.cidade.message}</p>}
                </div>
              </div>

              {/* Estado */}
              <div className="mb-6">
                <label htmlFor="estado" className="block mb-1">
                  Estado<span className="text-red-500">*</span>
                </label>
                <input
                  id="estado"
                  type="text"
                  className={`w-full border ${errors.estado ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2`}
                  placeholder="Ex.: São Paulo"
                  {...register("estado", { required: "Estado é obrigatório" })}
                />
                {errors.estado && <p className="text-red-500 text-sm mt-1">{errors.estado.message}</p>}
              </div>

              {/* Error message */}
              {Object.keys(errors).length > 0 && <p className="text-red-500 text-sm mb-4">Preencha todos os campos*</p>}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-fundoBotoes text-white py-3 rounded-md flex items-center justify-center hover:bg-corGradiente transition-colors"
              >
                Continuar para pagamento <ChevronRightIcon size={16} className="ml-1" />
              </button>
            </form>
          </div>

          {/* Cart Summary */}
          <div className="w-full lg:w-80">
            <div className="bg-amarelo text-center py-4 rounded-t-lg font-medium">Carrinho</div>
            <div className="bg-[#eceef4] p-4 rounded-b-lg">
              {/* Product */}
              <div className="bg-white p-4 rounded-md mb-4">
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
                    <button type="button" onClick={decreaseQuantity} className="px-2 py-1">
                      <MinusIcon size={16} />
                    </button>
                    <span className="px-2 py-1">{quantity}</span>
                    <button type="button" onClick={increaseQuantity} className="px-2 py-1 text-blueroyal">
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
                  <span className="font-medium">R${totalPrice.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="text-right text-xs text-gray-500 mb-4">
                  ou em até 12x de R${installmentValue.replace(".", ",")}
                </div>
              </div>

              <div className="bg-blue-100 p-3 rounded-md mb-4 flex items-start">
                <InfoIcon size={16} className="text-blueroyal mr-2 mt-1 flex-shrink-0" />
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

