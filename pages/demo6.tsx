import { Demo6 } from '../components/demo/Demo6.jsx'
import { DemoPage } from '../components/layout/DemoPage.jsx'
import { NextHead } from '../components/next/Head.js'

export default function Demo6Page() {
  return (
    <>
      <NextHead>
        <title>Wave Simulation – Demo 6</title>
      </NextHead>

      <DemoPage Demo={Demo6} />
    </>
  )
}
