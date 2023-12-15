import type { NextPage } from 'next'
import { DemoPage } from '../components/layout/DemoPage.js'
import { NextHead } from '../components/next/Head.js'
import { Demo6 } from '../components/pages/Demo6.js'

const Home: NextPage = () => (
  <>
    <NextHead>
      <title>Wave Simulation – Demo 6</title>
    </NextHead>

    <DemoPage Demo={Demo6} />
  </>
)

export default Home
