import { Demo3 } from '../components/demo/Demo3.jsx'
import { DemoPage } from '../components/layout/DemoPage.jsx'
import { NextHead } from '../components/next/Head.js'

export default function Demo3Page() {
  return (
    <>
      <NextHead>
        <title>Wave Simulation – Demo 3</title>
      </NextHead>

      <DemoPage Demo={Demo3} />
    </>
  )
}
