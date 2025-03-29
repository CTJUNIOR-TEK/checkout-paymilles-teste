"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { MinusIcon, PlusIcon, CreditCardIcon, ChevronRightIcon, InfoIcon, TruckIcon, FilterIcon } from "lucide-react"

type Plan = "Base" | "Plus"

type Machine = {
  id: string
  name: string
  model: string
  price: number
  installmentPrice: number
  quantity: number
  plan: Plan
}

export default function Home() {
  const router = useRouter()
  const [selectedPlanFilter, setSelectedPlanFilter] = useState<Plan | "Todos">("Todos")
  const [machines, setMachines] = useState<Machine[]>([
    {
      id: "smart-base",
      name: "Paymilles Smart",
      model: "A930/P2*",
      price: 597.0,
      installmentPrice: 49.75,
      quantity: 0,
      plan: "Base",
    },
    {
      id: "pro-base",
      name: "Paymilles Pro",
      model: "S920/Q92*",
      price: 497.0,
      installmentPrice: 41.42,
      quantity: 0,
      plan: "Base",
    },
    {
      id: "mini-base",
      name: "Paymilles Mini",
      model: "D195*",
      price: 337.0,
      installmentPrice: 28.08,
      quantity: 0,
      plan: "Base",
    },
    {
      id: "smart-plus",
      name: "Paymilles Smart Plus",
      model: "A930/P2*",
      price: 697.0,
      installmentPrice: 58.08,
      quantity: 0,
      plan: "Plus",
    },
    {
      id: "pro-plus",
      name: "Paymilles Pro Plus",
      model: "S920/Q92*",
      price: 597.0,
      installmentPrice: 49.75,
      quantity: 0,
      plan: "Plus",
    },
    {
      id: "mini-plus",
      name: "Paymilles Mini Plus",
      model: "D195*",
      price: 397.0,
      installmentPrice: 33.08,
      quantity: 0,
      plan: "Plus",
    },
  ])
  const [coupon, setCoupon] = useState("")
  const [filteredMachines, setFilteredMachines] = useState<Machine[]>(machines)

  // Filtrar máquinas quando o filtro de plano mudar
  useEffect(() => {
    if (selectedPlanFilter === "Todos") {
      setFilteredMachines(machines)
    } else {
      setFilteredMachines(machines.filter((machine) => machine.plan === selectedPlanFilter))
    }
  }, [selectedPlanFilter, machines])

  const updateQuantity = (id: string, change: number) => {
    setMachines(
      machines.map((machine) =>
        machine.id === id ? { ...machine, quantity: Math.max(0, machine.quantity + change) } : machine,
      ),
    )
  }

  const calculateSubtotal = () => {
    return machines.reduce((total, machine) => total + machine.price * machine.quantity, 0)
  }

  const subtotal = calculateSubtotal()
  const total = subtotal // Poderia incluir frete ou descontos aqui
  const installmentValue = (total / 12).toFixed(2)

  const handleContinue = () => {
    // Verificar se pelo menos uma máquina foi selecionada
    if (machines.some((machine) => machine.quantity > 0)) {
      // Salvar o estado do carrinho no localStorage
      localStorage.setItem("cartItems", JSON.stringify(machines.filter((m) => m.quantity > 0)))
      router.push("/checkout/dados")
    } else {
      alert("Por favor, selecione pelo menos uma máquina para continuar.")
    }
  }

  const applyCoupon = () => {
    if (coupon.trim()) {
      alert(`Cupom "${coupon}" aplicado!`)
    }
  }

  const isMachineSelected = (id: string) => {
    return machines.find((machine) => machine.id === id)?.quantity! > 0
  }

  return (
    <div className="min-h-screen bg-[#fbfbfb]">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center">
            <Image src="/images/logo.png" alt="paymilles" width={140} height={40} className="h-10 w-auto" />
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {/* Plan Filter */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <FilterIcon size={20} className="mr-2 text-amarelo" />
                <h2 className="text-lg font-medium">Filtrar por plano</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  className={`px-4 py-2 rounded-md transition-colors ${
                    selectedPlanFilter === "Todos" ? "bg-amarelo text-black" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedPlanFilter("Todos")}
                >
                  Todos
                </button>
                <button
                  className={`px-4 py-2 rounded-md transition-colors ${
                    selectedPlanFilter === "Base" ? "bg-amarelo text-black" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedPlanFilter("Base")}
                >
                  Plano Base
                </button>
                <button
                  className={`px-4 py-2 rounded-md transition-colors ${
                    selectedPlanFilter === "Plus" ? "bg-amarelo text-black" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedPlanFilter("Plus")}
                >
                  Plano Plus
                </button>
              </div>
            </div>

            {/* Machine Selection */}
            <h2 className="text-lg font-medium mb-4">Escolha sua máquina</h2>

            {filteredMachines.length === 0 ? (
              <div className="bg-gray-100 p-8 rounded-lg text-center">
                <p className="text-gray-600">Nenhuma máquina encontrada para o filtro selecionado.</p>
              </div>
            ) : (
              filteredMachines.map((machine) => (
                <div
                  key={machine.id}
                  className={`border rounded-lg p-6 mb-6 transition-all ${
                    isMachineSelected(machine.id)
                      ? "border-2 border-amarelo shadow-md"
                      : "border-[#cccfd9] hover:border-gray-400"
                  }`}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center">
                    <div className="flex flex-col items-center mb-4 md:mb-0 md:mr-6">
                      <Image
                        src="/images/maquina.png"
                        alt={machine.name}
                        width={80}
                        height={120}
                        className="mb-2 h-32 w-auto object-contain"
                      />
                      <h3 className="font-medium">{machine.name}</h3>
                      <p className="text-sm text-[#677294]">{machine.model}</p>
                      <span className="mt-1 px-2 py-1 bg-goldbright text-xs rounded-full text-goldraw font-medium">
                        Plano {machine.plan}
                      </span>

                      <div className="flex mt-2 space-x-4 text-xs">
                        <div className="text-center">
                          <p className="font-medium">DÉBITO</p>
                          <p>1,39%</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">CRÉDITO</p>
                          <p>2,91%</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">CRÉD 12X</p>
                          <p>11,51%</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center border border-[#cccfd9] rounded-md">
                          <button
                            className="px-3 py-1 hover:bg-gray-100 transition-colors"
                            onClick={() => updateQuantity(machine.id, -1)}
                          >
                            <MinusIcon size={16} />
                          </button>
                          <span className="px-3 py-1">{machine.quantity}</span>
                          <button
                            className="px-3 py-1 text-blueroyal hover:bg-blue-50 transition-colors"
                            onClick={() => updateQuantity(machine.id, 1)}
                          >
                            <PlusIcon size={16} />
                          </button>
                        </div>

                        <div>
                          <div className="flex items-center mb-1">
                            <CreditCardIcon size={16} className="mr-2" />
                            <span className="font-medium">
                              12x de R$ {machine.installmentPrice.toFixed(2).replace(".", ",")} sem juros
                            </span>
                          </div>
                          <p className="text-sm text-[#677294]">
                            Ou por R$ {machine.price.toFixed(2).replace(".", ",")} à vista
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            <p className="text-xs text-[#677294] mt-4">
              *Imagens meramente ilustrativas. A máquina pode ser enviada nos modelos informados ou similar com as
              mesmas funções e na cor amarela, da empresa parceira que nos fornece os equipamentos.
            </p>
          </div>

          {/* Cart Summary */}
          <div className="w-full lg:w-80">
            <div className="bg-amarelo text-center py-4 rounded-t-lg font-medium">Carrinho</div>
            <div className="bg-[#eceef4] p-4 rounded-b-lg">
              <div className="border-b border-[#cccfd9] pb-4 mb-4">
                {machines.some((m) => m.quantity > 0) ? (
                  <div className="space-y-3 mb-3">
                    {machines
                      .filter((m) => m.quantity > 0)
                      .map((machine) => (
                        <div key={machine.id} className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Image
                              src="/images/maquina.png"
                              alt={machine.name}
                              width={30}
                              height={40}
                              className="mr-2 h-10 w-auto object-contain"
                            />
                            <span className="text-sm">
                              {machine.name} x{machine.quantity}
                            </span>
                          </div>
                          <span className="text-sm font-medium">
                            R${(machine.price * machine.quantity).toFixed(2).replace(".", ",")}
                          </span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-3 text-gray-500">
                    <p>Seu carrinho está vazio</p>
                    <p className="text-xs mt-1">Adicione máquinas para continuar</p>
                  </div>
                )}
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>R${subtotal.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete</span>
                  <span className="text-[#4cae79]">Grátis</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <span className="mr-2">Cupom</span>
                  <div className="flex flex-1">
                    <input
                      type="text"
                      className="border border-[#cccfd9] rounded-l-md px-3 py-1 w-full text-sm"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                    />
                    <button
                      className="bg-blueroyal text-white px-3 py-1 rounded-r-md text-sm hover:bg-blueroyal/90 transition-colors"
                      onClick={applyCoupon}
                    >
                      Aplicar
                    </button>
                  </div>
                </div>

                <div className="flex justify-between mb-1">
                  <span className="font-medium">Total</span>
                  <span className="font-medium">R${total.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="text-right text-xs text-[#677294] mb-4">
                  ou em até 12x de R${installmentValue.replace(".", ",")}
                </div>

                <button
                  className={`w-full py-3 rounded-md flex items-center justify-center ${
                    subtotal > 0 ? "bg-blueroyal text-white hover:bg-blueroyal/90" : "bg-[#cccfd9] text-[#677294]"
                  } transition-colors`}
                  onClick={handleContinue}
                  disabled={subtotal === 0}
                >
                  Continuar a compra <ChevronRightIcon size={16} className="ml-1" />
                </button>
              </div>

              <div className="bg-blue-100 p-3 rounded-md mb-4 flex items-start">
                <InfoIcon size={16} className="text-blue-500 mr-2 mt-1 flex-shrink-0" />
                <p className="text-xs text-blue-800">
                  **Sul, Sudeste, Centro-oeste 2-16 dias úteis Nordeste e Norte: 5 a 20 dias úteis
                </p>
              </div>

              <div className="bg-green-100 p-3 rounded-md mb-4 flex items-start">
                <TruckIcon size={16} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                <p className="text-xs text-green-800">Frete grátis para todo o Brasil</p>
              </div>

              <div className="text-xs text-[#677294] space-y-3">
                <p>
                  **Prazo válido após a criação do cadastro em nosso portal com sua aprovação e criação da conta com
                  taxas especiais.
                </p>
                <p>Consulte em nosso site taxas de parcelamento até 18x.</p>
                <p>Em caso de UPGRADE é necessário solicitar a nossa equipe a atualização das taxas.</p>
                <p>
                  Ao continuar você aceita os <span className="text-blueroyal">Termos e Condições de Uso</span>
                  <br />
                  Ao continuar você concorda com a <span className="text-blueroyal">Política de Privacidade</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

