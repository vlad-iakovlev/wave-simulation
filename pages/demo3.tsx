import type { NextPage } from 'next'
import { Demo3 } from '../components/demo/Demo3.js'
import { DemoPage } from '../components/layout/DemoPage.js'
import { NextHead } from '../components/next/Head.js'

const Home: NextPage = () => (
  <>
    <NextHead>
      <title>Wave Simulation – Demo 3</title>
    </NextHead>

    <DemoPage Demo={Demo3} />
  </>
)

export default Home
