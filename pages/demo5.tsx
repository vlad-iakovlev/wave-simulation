import type { NextPage } from 'next'
import { Demo5 } from '../components/demo/Demo5.js'
import { DemoPage } from '../components/layout/DemoPage.js'
import { NextHead } from '../components/next/Head.js'

const Home: NextPage = () => (
  <>
    <NextHead>
      <title>Wave Simulation – Demo 5</title>
    </NextHead>

    <DemoPage Demo={Demo5} />
  </>
)

export default Home
