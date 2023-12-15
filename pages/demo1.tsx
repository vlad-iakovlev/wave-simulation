import type { NextPage } from 'next'
import { Demo1 } from '../components/demo/Demo1.js'
import { DemoPage } from '../components/layout/DemoPage.js'
import { NextHead } from '../components/next/Head.js'

const Home: NextPage = () => (
  <>
    <NextHead>
      <title>Wave Simulation – Demo 1</title>
    </NextHead>

    <DemoPage Demo={Demo1} />
  </>
)

export default Home
