"use client"

import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export function MenuNav() {
  return (
    <NavigationMenu className="flex-1 justify-start">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Build with</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="https://shyft.to"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Image
                      src={"/shyft-logo.webp"}
                      alt="Shyft.to logo"
                      width={26}
                      height={26}
                    />
                    <div className="my-2 text-lg font-medium">Shyft.to</div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Lightning-fast Web3 APIs to launch faster and more
                      efficiently.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="https://docs.shyft.to/" title="Shyft APIs">
                Suite of managed services for frictionless web3 development.
              </ListItem>
              <ListItem
                href="https://translator.shyft.to/"
                title="Solana Translator"
              >
                A simple to read, human-friendly Solana explorer.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="https://shyft.to" target="_blank" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Shyft
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = forwardRef<ElementRef<"a">, ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  }
)
ListItem.displayName = "ListItem"
