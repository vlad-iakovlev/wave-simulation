import type { NextPage } from 'next'
import { Demo6 } from '../components/demo/Demo6.js'
import { DemoPage } from '../components/layout/DemoPage.js'
import { NextHead } from '../components/next/Head.js'

const Home: NextPage = () => (
  <>
    <NextHead>
      <title>Wave Simulation – Demo 6</title>
    </NextHead>

    <DemoPage Demo={Demo6} />
  </>
)

export default Home
