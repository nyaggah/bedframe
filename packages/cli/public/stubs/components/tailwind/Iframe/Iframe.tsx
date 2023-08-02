import { type ReactNode } from 'react'

export interface IframeProps {
  children?: ReactNode
}

export function Iframe(props: IframeProps): JSX.Element {
  const { children, ...rest } = props

  return (
    <iframe
      className="opacity-0 w-[560px] min-w-[560px] max-w-[960px] min-h-[50vh] shadow-[0_1px_1px_hsl(0deg_0%_0%_/_0.075),0_2px_2px_hsl(0deg_0%_0%_/_0.075),0_4px_4px_hsl(0deg_0%_0%_/_0.075),0_8px_8px_hsl(0deg_0%_0%_/_0.075),0_16px_16px_hsl(0deg_0%_0%_/_0.075)] bg-white pointer-events-auto rounded-xl border-solid border-[#e9ebee] z-[9999999]"
      {...rest}
    >
      {children}
    </iframe>
  )
}
