import { Demo2 } from '../components/demo/Demo2.jsx'
import { DemoPage } from '../components/layout/DemoPage.jsx'
import { NextHead } from '../components/next/Head.js'

export default function Demo2Page() {
  return (
    <>
      <NextHead>
        <title>Wave Simulation – Demo 2</title>
      </NextHead>

      <DemoPage Demo={Demo2} />
    </>
  )
}
