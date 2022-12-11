import type { NextPage } from 'next'
import Head from 'next/head'
import { Demo1 } from '../components/Demo1'
import { DemoPage } from '../components/DemoPage'

const Home: NextPage = () => (
  <>
    <Head>
      <title>Wave simulation – Demo 1</title>
    </Head>

    <DemoPage Demo={Demo1} />
  </>
)

export default Home
