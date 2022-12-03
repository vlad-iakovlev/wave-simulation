import type { NextPage } from 'next'
import Head from 'next/head'
import { WaveSimulation } from '../components/WaveSimulation'

const Home: NextPage = () => (
  <>
    <Head>
      <title>Wave simulation</title>
    </Head>

    <div className="flex items-center justify-center min-h-full">
      <WaveSimulation />
    </div>
  </>
)

export default Home
