import type { NextPage } from 'next'
import Head from 'next/head'
import { Index } from '../components/Index'

const Home: NextPage = () => (
  <>
    <Head>
      <title>Wave simulation</title>
    </Head>

    <Index />
  </>
)

export default Home
