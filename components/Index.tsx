import Link from 'next/link'
import { FC } from 'react'

export const Index: FC = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <Link
        className="bg-slate-900 hover:bg-slate-700 focus:outline-none text-white font-semibold h-12 px-6 rounded-lg flex items-center justify-center"
        href="/demo1"
      >
        Demo 1
      </Link>

      <Link
        className="bg-slate-900 hover:bg-slate-700 focus:outline-none text-white font-semibold h-12 px-6 rounded-lg flex items-center justify-center"
        href="/demo2"
      >
        Demo 2
      </Link>
    </div>
  )
}
