'use client'

import { Demo1 } from '../../components/demo/Demo1.jsx'
import { DemoPage } from '../../components/layout/DemoPage.jsx'

export default function Demo1Page() {
  return (
    <>
      <title>Wave Simulation – Demo 1</title>
      <DemoPage Demo={Demo1} />
    </>
  )
}
