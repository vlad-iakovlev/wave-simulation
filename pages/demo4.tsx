import type { NextPage } from 'next'
import Head from 'next/head'
import { Demo4 } from '../components/Demo4'
import { DemoPage } from '../components/DemoPage'

const Home: NextPage = () => (
  <>
    <Head>
      <title>Wave simulation – Demo 4</title>
    </Head>

    <DemoPage Demo={Demo4} />
  </>
)

export default Home
