import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from 'hisar-ui';

export function Bar() {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink href="#" style={{ padding: '8px 12px', fontSize: 14, fontWeight: 500 }}>
                        Panel
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink href="#" style={{ padding: '8px 12px', fontSize: 14, fontWeight: 500 }}>
                        Randevular
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink href="#" style={{ padding: '8px 12px', fontSize: 14, fontWeight: 500 }}>
                        Doktorlar
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink href="#" style={{ padding: '8px 12px', fontSize: 14, fontWeight: 500 }}>
                        Raporlar
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}
