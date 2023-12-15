import type { NextPage } from 'next'
import { DemoPage } from '../components/layout/DemoPage.js'
import { NextHead } from '../components/next/Head.js'
import { Demo4 } from '../components/pages/Demo4.js'

const Home: NextPage = () => (
  <>
    <NextHead>
      <title>Wave Simulation – Demo 4</title>
    </NextHead>

    <DemoPage Demo={Demo4} />
  </>
)

export default Home
