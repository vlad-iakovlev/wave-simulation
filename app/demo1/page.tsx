'use client'

import { Demo1 } from '../../components/demo/Demo1'
import { DemoPage } from '../../components/layout/DemoPage'

export default function Demo1Page() {
  return (
    <>
      <title>Wave Simulation – Demo 1</title>
      <DemoPage Demo={Demo1} />
    </>
  )
}
