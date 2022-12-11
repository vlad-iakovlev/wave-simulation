import type { NextPage } from 'next'
import Head from 'next/head'
import { Demo5 } from '../components/Demo5'
import { DemoPage } from '../components/DemoPage'

const Home: NextPage = () => (
  <>
    <Head>
      <title>Wave simulation – Demo 5</title>
    </Head>

    <DemoPage Demo={Demo5} />
  </>
)

export default Home
