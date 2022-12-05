import React from 'react'
import CopyButton from '@theme/CodeBlock/CopyButton'

function pickTextColorBasedOnBgColorSimple(bgColor, lightColor, darkColor) {
  const color = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor
  const r = parseInt(color.substring(0, 2), 16) // hexToR
  const g = parseInt(color.substring(2, 4), 16) // hexToG
  const b = parseInt(color.substring(4, 6), 16) // hexToB
  return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? darkColor : lightColor
}

function ColorItem({ token, code }) {
  const color = pickTextColorBasedOnBgColorSimple(code, true, false)
  return (
    <div>
      <div
        style={{ backgroundColor: code }}
        className="h-14 rounded mb-1 w-full relative"
      >
        <div className="flex absolute top-2 right-1">
          <CopyButton
            code={code}
            className={`flex items-center p-2 rounded hover:text-rebelPink ${
              color ? 'text-white' : 'text-black'
            }`}
          />
        </div>
      </div>
      <p className="font-VTEXMedium text-seriousBlack text-xs block ">
        {token}
      </p>
      <p className="text-xs">{code}</p>
    </div>
  )
}

export default function ColorPalette({ colors }) {
  return (
    <div className="grid grid-flow-col-dense gap-1">
      {Object.keys(colors).map((key) => (
        <ColorItem key={key} token={key} code={colors[key]} />
      ))}
    </div>
  )
}
