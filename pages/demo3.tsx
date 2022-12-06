import type { NextPage } from 'next'
import Head from 'next/head'
import { Demo3 } from '../components/Demo3'

const Home: NextPage = () => (
  <>
    <Head>
      <title>Wave simulation – Demo 3</title>
    </Head>

    <Demo3 />
  </>
)

export default Home
