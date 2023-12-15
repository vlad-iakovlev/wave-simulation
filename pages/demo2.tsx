import type { NextPage } from 'next'
import { Demo2 } from '../components/demo/Demo2.js'
import { DemoPage } from '../components/layout/DemoPage.js'
import { NextHead } from '../components/next/Head.js'

const Home: NextPage = () => (
  <>
    <NextHead>
      <title>Wave Simulation – Demo 2</title>
    </NextHead>

    <DemoPage Demo={Demo2} />
  </>
)

export default Home
