import type { NextPage } from 'next'
import Head from 'next/head'
import { Index } from '../components/Index'

const Home: NextPage = () => (
  <>
    <Head>
      <title>Wave simulation</title>
    </Head>

    <div className="flex items-center justify-center min-h-full">
      <Index />
    </div>
  </>
)

export default Home
