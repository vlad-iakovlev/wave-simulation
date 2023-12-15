import type { NextPage } from 'next'
import { Demo7 } from '../components/demo/Demo7.js'
import { DemoPage } from '../components/layout/DemoPage.js'
import { NextHead } from '../components/next/Head.js'

const Home: NextPage = () => (
  <>
    <NextHead>
      <title>Wave Simulation – Demo 7</title>
    </NextHead>

    <DemoPage Demo={Demo7} />
  </>
)

export default Home
