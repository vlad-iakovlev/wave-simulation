import type { NextPage } from 'next'
import Head from 'next/head'
import { Demo2 } from '../components/Demo2'
import { DemoPage } from '../components/DemoPage'

const Home: NextPage = () => (
  <>
    <Head>
      <title>Wave simulation – Demo 2</title>
    </Head>

    <DemoPage Demo={Demo2} />
  </>
)

export default Home
