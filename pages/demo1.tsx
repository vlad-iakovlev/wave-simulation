import { Demo1 } from '../components/demo/Demo1.jsx'
import { DemoPage } from '../components/layout/DemoPage.jsx'
import { NextHead } from '../components/next/Head.js'

export default function Demo1Page() {
  return (
    <>
      <NextHead>
        <title>Wave Simulation – Demo 1</title>
      </NextHead>

      <DemoPage Demo={Demo1} />
    </>
  )
}
