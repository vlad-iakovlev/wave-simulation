import type { NextPage } from 'next'
import { DemoPage } from '../components/layout/DemoPage.js'
import { NextHead } from '../components/next/Head.js'
import { Demo2 } from '../components/pages/Demo2.js'

const Home: NextPage = () => (
  <>
    <NextHead>
      <title>Wave Simulation – Demo 2</title>
    </NextHead>

    <DemoPage Demo={Demo2} />
  </>
)

export default Home
