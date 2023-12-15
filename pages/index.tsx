import type { NextPage } from 'next'
import { NextHead } from '../components/next/Head.js'
import { Index } from '../components/pages/Index.js'

const Home: NextPage = () => (
  <>
    <NextHead>
      <title>Wave Simulation</title>
    </NextHead>

    <Index />
  </>
)

export default Home
