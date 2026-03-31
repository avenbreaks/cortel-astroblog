import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

type MenuItem = {
  title: string
  href: string
  description: string
}

const newsItems: MenuItem[] = [
  { title: "Blockchain", href: "/blog?tag=blockchain", description: "Latest chain ecosystem updates." },
  { title: "Web3", href: "/blog?tag=web3", description: "Web3 products, infra, and adoption." },
  { title: "Crypto", href: "/blog?tag=crypto", description: "Market, protocol, and token narratives." },
  { title: "Jobs", href: "/blog?tag=jobs", description: "Career and hiring signals in the space." },
  { title: "AI", href: "/blog?tag=ai", description: "AI x blockchain and tooling stories." },
  { title: "Other", href: "/blog?tag=other", description: "Additional noteworthy updates." },
]

const developerItems: MenuItem[] = [
  { title: "Tutorial", href: "/blog?tag=tutorial", description: "Hands-on implementation guides." },
  { title: "How-to", href: "/blog?tag=how-to", description: "Practical step-by-step walkthroughs." },
  { title: "Guides", href: "/blog?tag=guides", description: "Long-form references and patterns." },
  { title: "Devtools", href: "/blog?tag=devtools", description: "Tools and workflow optimization." },
  { title: "Engineering", href: "/blog?tag=engineering", description: "Architecture and code quality topics." },
  { title: "Frontend", href: "/blog?tag=frontend", description: "UI and frontend implementation tips." },
]

function ListItem({ title, href, description }: MenuItem) {
  return (
    <li>
      <NavigationMenuLink
        render={
          <a href={href} className="flex flex-col gap-1 p-2">
            <div className="leading-none font-medium text-foreground">{title}</div>
            <div className="line-clamp-2 text-[11px] text-muted-foreground">{description}</div>
          </a>
        }
      />
    </li>
  )
}

export default function HeaderNavMenu() {
  return (
    <NavigationMenu align="end">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="h-8 px-2 text-xs">News</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[260px] gap-1">{newsItems.map((item) => <ListItem key={item.href} {...item} />)}</ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="h-8 px-2 text-xs">Developer</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[280px] gap-1">{developerItems.map((item) => <ListItem key={item.href} {...item} />)}</ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
