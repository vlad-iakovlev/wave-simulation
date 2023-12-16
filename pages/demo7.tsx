import { Demo7 } from '../components/demo/Demo7.jsx'
import { DemoPage } from '../components/layout/DemoPage.jsx'
import { NextHead } from '../components/next/Head.js'

export default function Demo7Page() {
  return (
    <>
      <NextHead>
        <title>Wave Simulation – Demo 7</title>
      </NextHead>

      <DemoPage Demo={Demo7} />
    </>
  )
}
