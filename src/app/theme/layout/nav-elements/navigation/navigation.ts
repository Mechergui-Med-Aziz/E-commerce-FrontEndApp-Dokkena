export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;

  children?: NavigationItem[];
}
export const NavigationItems: NavigationItem[] = [
  {
    id: 'navigation',
    title: 'Navigation',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'home',
        title: 'Page d\'accueil',
        type: 'item',
        url: '/home',
        icon: 'feather icon-home',
        classes: 'nav-item'
      },
      {
        id: 'product-list',
        title: 'Liste des produits',
        type: 'item',
        url: '/product-list',
        classes: 'nav-item',
        icon: 'feather icon-list'
      }
    ]
  },
   {
    id: 'category',
    title: 'Catégories',
    type: 'group',
    icon: 'icon-ui',
    children: [
      {
        id: 'categories',
        title: 'Catégories',
        type: 'collapse',
        icon: 'feather icon-box',
        children: [
          {
            id: 'beauty',
            title: 'Beauty',
            type: 'item',
            url: '/categories/beauty'
          },
          {
            id: 'electronic',
            title: 'Electronic',
            type: 'item',
            url: '/categories/electronic'
          },
          {
            id: 'fashion',
            title: 'Fashion',
            type: 'item',
            url: '/categories/fashion'
          },
          {
            id: 'game',
            title: 'Game',
            type: 'item',
            url: '/categories/game'
          },
          {
            id: 'kitchen',
            title: 'Kitchen',
            type: 'item',
            url: '/categories/kitchen'
          },
          {
            id: 'sport',
            title: 'Sport',
            type: 'item',
            url: '/categories/sport'
          }
        ]
      }
    ]
  }
];
