import type { NextPage } from 'next'
import { DemoPage } from '../components/layout/DemoPage.js'
import { NextHead } from '../components/next/Head.js'
import { Demo7 } from '../components/pages/Demo7.js'

const Home: NextPage = () => (
  <>
    <NextHead>
      <title>Wave Simulation – Demo 7</title>
    </NextHead>

    <DemoPage Demo={Demo7} />
  </>
)

export default Home
