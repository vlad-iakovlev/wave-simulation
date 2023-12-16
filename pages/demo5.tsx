import { Demo5 } from '../components/demo/Demo5.jsx'
import { DemoPage } from '../components/layout/DemoPage.jsx'
import { NextHead } from '../components/next/Head.js'

export default function Demo5Page() {
  return (
    <>
      <NextHead>
        <title>Wave Simulation – Demo 5</title>
      </NextHead>

      <DemoPage Demo={Demo5} />
    </>
  )
}
