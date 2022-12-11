import Link from 'next/link'
import { FC } from 'react'
import { Demo1 } from './Demo1'
import { Demo2 } from './Demo2'
import { Demo3 } from './Demo3'
import { Demo4 } from './Demo4'
import { Demo5 } from './Demo5'
import { Demo6 } from './Demo6'

const pages = [
  { Demo: Demo1, href: '/demo1' },
  { Demo: Demo2, href: '/demo2' },
  { Demo: Demo3, href: '/demo3' },
  { Demo: Demo4, href: '/demo4' },
  { Demo: Demo5, href: '/demo5' },
  { Demo: Demo6, href: '/demo6' },
]

export const Index: FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center p-4 gap-4">
      {pages.map((page) => (
        <Link key={page.href} href={page.href}>
          <page.Demo width={300} height={200} scale={2} speed={1} />
        </Link>
      ))}
    </div>
  )
}
