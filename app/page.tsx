'use client'

import { Demo1 } from '../components/demo/Demo1.jsx'
import { Demo2 } from '../components/demo/Demo2.jsx'
import { Demo3 } from '../components/demo/Demo3.jsx'
import { Demo4 } from '../components/demo/Demo4.jsx'
import { Demo5 } from '../components/demo/Demo5.jsx'
import { Demo6 } from '../components/demo/Demo6.jsx'
import { Demo7 } from '../components/demo/Demo7.jsx'
import { NextLink } from '../components/next/Link.js'

const pages = [
  { Demo: Demo1, href: '/demo1' },
  { Demo: Demo2, href: '/demo2' },
  { Demo: Demo3, href: '/demo3' },
  { Demo: Demo4, href: '/demo4' },
  { Demo: Demo5, href: '/demo5' },
  { Demo: Demo6, href: '/demo6' },
  { Demo: Demo7, href: '/demo7' },
]

export default function IndexPage() {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center pb-[calc(env(safe-area-inset-bottom)+2rem)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pt-[calc(env(safe-area-inset-top)+2rem)]">
        <h1 className="mb-2 text-center text-2xl font-bold sm:text-3xl">
          Cellular automaton for wave simulation
        </h1>

        <p className="mb-8 text-center text-zinc-300">
          (inspired by{' '}
          <a
            className="underline"
            href="https://youtu.be/noUpBKY2rIg"
            target="_blank"
            rel="noreferrer"
          >
            https://youtu.be/noUpBKY2rIg
          </a>
          )
        </p>

        <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <NextLink key={page.href} href={page.href}>
              <page.Demo width={300} height={200} scale={2} speed={1} />
            </NextLink>
          ))}
        </div>
      </div>
    </>
  )
}
