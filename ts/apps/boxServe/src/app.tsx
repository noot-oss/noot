import { useState } from 'preact/hooks'
import './app.css'
import {H1, H2} from "@noot/ui/src/components/Typography"
import { cn } from '~ui/lib/utils'

export function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex items-center justify-center h-full flex-col">
        <H1 className="lg:text-6xl text-6xl">Welcome to NootBox!</H1>
        <span className="text-2xl font-light">Let's get you set up.</span>
    </div>
  )
}
