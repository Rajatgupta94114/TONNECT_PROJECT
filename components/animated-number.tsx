"use client"

import { animate } from "framer-motion"
import { useEffect, useState } from "react"

interface AnimatedNumberProps {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
}

export function AnimatedNumber({ value, duration = 1, prefix = "", suffix = "", decimals = 0 }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(() => value.toFixed(decimals))

  useEffect(() => {
    const controls = animate(0, value, {
      duration,
      onUpdate(latest) {
        setDisplay(latest.toFixed(decimals))
      },
    })
    return () => controls.stop()
  }, [value, duration, decimals])

  return (
    <span className="tabular-nums select-none">
      {prefix}
      {display}
      {suffix}
    </span>
  )
}
