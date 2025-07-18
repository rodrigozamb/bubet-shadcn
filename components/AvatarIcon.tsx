"use client"

import clsx from 'clsx'
import Image from 'next/image'
import { useEffect, useState } from 'react'


interface avatarIconProps {
    src: string,
    name: string,
    size?: number | null
    className?: string
}

const colors = [
  "#4F46E5", // indigo
  "#10B981", // emerald
  "#EF4444", // red
  "#F59E0B", // amber
  "#3B82F6", // blue
  "#8B5CF6", // violet
  "#EC4899", // pink
  "#22D3EE", // cyan
  "#84CC16", // lime
  "#F97316", // orange
  "#6366F1", // indigo-light
  "#14B8A6", // teal
  "#E11D48", // rose
  "#DB2777", // fuchsia
  "#0EA5E9", // sky
  "#EAB308", // yellow
  "#A855F7", // purple
  "#F43F5E", // warm-pink
  "#2563EB", // royal-blue
  "#059669"  // jungle-green
];


export default function AvatarIcon({ src, name, size, className = "" }: avatarIconProps) {
  const [imgError, setImgError] = useState(false)

  const [color, setColor] = useState("#EF4444")

  useEffect(() => {
    const cn = Math.floor(Math.random() * 20) + 1
    setColor(colors[cn])
  }, [])

  const initials = name ? name
    .split(' ')
    .map(part => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

    :

    "Pessoa"
  
    if (!size){
    size = 40
  }

  // If no valid src or image errored, render fallback
  if (!src || imgError) {
    return (
      <div
        className={clsx("flex items-center justify-center rounded-full", className)}
        style={{
          width: size,
          height: size,
          backgroundColor: color, // change to your theme color
          color: 'white',
          fontWeight: 'bold',
          fontSize: size / 2.5,
          textTransform: 'uppercase',
        }}
      >
        {initials}
      </div>
    )
  }
  return (
    <Image
      src={src}
      alt={name}
      width={size}
      height={size}
      className={clsx("rounded-full object-cover", className)}
      onError={() => setImgError(true)}
      unoptimized // optional: skip built-in optimization if loading external
    />
  )
}
