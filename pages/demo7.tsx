import type { NextPage } from 'next'
import Head from 'next/head'
import { Demo7 } from '../components/Demo7'
import { DemoPage } from '../components/DemoPage'

const Home: NextPage = () => (
  <>
    <Head>
      <title>Wave simulation – Demo 7</title>
    </Head>

    <DemoPage Demo={Demo7} />
  </>
)

export default Home
