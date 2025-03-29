import Image from "next/image"
import Link from "next/link"

export default function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <Image src="/images/logo.png" alt="paymilles" width={140} height={40} className="h-10 w-auto" />
    </Link>
  )
}

