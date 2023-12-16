import { Demo4 } from '../components/demo/Demo4.jsx'
import { DemoPage } from '../components/layout/DemoPage.jsx'
import { NextHead } from '../components/next/Head.js'

export default function Demo4Page() {
  return (
    <>
      <NextHead>
        <title>Wave Simulation – Demo 4</title>
      </NextHead>

      <DemoPage Demo={Demo4} />
    </>
  )
}
