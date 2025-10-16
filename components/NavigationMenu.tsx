"use client"

import * as React from "react"
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu"

export function NavigationMenuLandingPage() {
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <NavigationMenu className="mx-10">
      <NavigationMenuList>
        <NavigationMenuItem>
          <button
            onClick={() => scrollToSection("como-apostar")}
            className="bg-blue-950 text-amber-50 font-bold text-xl px-4 py-2 rounded-md hover:bg-blue-800"
          >
            Como apostar?
          </button>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <button
            onClick={() => scrollToSection("sobre-nos")}
            className="bg-blue-950 text-amber-50 font-bold text-xl px-4 py-2 rounded-md hover:bg-blue-800"
          >
            Sobre nós
          </button>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
