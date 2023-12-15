import type { NextPage } from 'next'
import { Demo1 } from '../components/demo/Demo1.js'
import { Demo2 } from '../components/demo/Demo2.js'
import { Demo3 } from '../components/demo/Demo3.js'
import { Demo4 } from '../components/demo/Demo4.js'
import { Demo5 } from '../components/demo/Demo5.js'
import { Demo6 } from '../components/demo/Demo6.js'
import { Demo7 } from '../components/demo/Demo7.js'
import { NextHead } from '../components/next/Head.js'
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

const Home: NextPage = () => (
  <>
    <NextHead>
      <title>Wave Simulation</title>
    </NextHead>

    <div className="flex flex-col items-center justify-center min-h-full py-8">
      <h1 className="mb-2 text-2xl sm:text-3xl font-bold text-center">
        Cellular automaton for wave simulation
      </h1>

      <p className="mb-8 text-zinc-300 text-center">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center gap-4">
        {pages.map((page) => (
          <NextLink key={page.href} href={page.href}>
            <page.Demo width={300} height={200} scale={2} speed={1} />
          </NextLink>
        ))}
      </div>
    </div>
  </>
)

export default Home
