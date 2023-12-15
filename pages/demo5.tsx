import type { NextPage } from 'next'
import { DemoPage } from '../components/layout/DemoPage.js'
import { NextHead } from '../components/next/Head.js'
import { Demo5 } from '../components/pages/Demo5.js'

const Home: NextPage = () => (
  <>
    <NextHead>
      <title>Wave Simulation – Demo 5</title>
    </NextHead>

    <DemoPage Demo={Demo5} />
  </>
)

export default Home
