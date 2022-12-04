import type { NextPage } from 'next'
import Head from 'next/head'
import { Demo2 } from '../components/Demo2'

const Home: NextPage = () => (
  <>
    <Head>
      <title>Wave simulation – Demo 2</title>
    </Head>

    <div className="flex items-center justify-center min-h-full">
      <Demo2 />
    </div>
  </>
)

export default Home
