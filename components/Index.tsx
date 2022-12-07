import Link from 'next/link'
import { FC } from 'react'

const pages = [
  { name: 'Demo 1', href: '/demo1' },
  { name: 'Demo 2', href: '/demo2' },
  { name: 'Demo 3', href: '/demo3' },
  { name: 'Demo 4', href: '/demo4' },
]

export const Index: FC = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      {pages.map((page) => (
        <Link
          key={page.href}
          className="bg-slate-900 hover:bg-slate-700 focus:outline-none text-white font-semibold h-12 px-6 rounded-lg flex items-center justify-center"
          href={page.href}
        >
          {page.name}
        </Link>
      ))}
    </div>
  )
}
