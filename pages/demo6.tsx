import type { NextPage } from 'next'
import Head from 'next/head'
import { Demo6 } from '../components/Demo6'
import { DemoPage } from '../components/DemoPage'

const Home: NextPage = () => (
  <>
    <Head>
      <title>Wave simulation – Demo 6</title>
    </Head>

    <DemoPage Demo={Demo6} />
  </>
)

export default Home
