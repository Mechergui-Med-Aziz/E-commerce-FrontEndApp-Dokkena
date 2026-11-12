export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  categorySlug: string;
  image: string;
  author: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'guide-choisir-smartphone-tunisie',
    title: 'Guide d\'achat : Comment bien choisir son smartphone en Tunisie ?',
    excerpt: 'Autonomie, qualité photo, connectivité et rapport qualité/prix : retrouvez nos critères essentiels pour trouver le meilleur smartphone selon votre budget.',
    date: '2026-10-15',
    readTime: '5 min de lecture',
    category: 'Electronic',
    categorySlug: 'electronic',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
    author: 'Équipe Tech Dokkena',
    content: `
      <p class="lead">Face à la multitude de modèles disponibles sur le marché tunisien, sélectionner le smartphone adapté à son quotidien et à son budget peut rapidement sembler complexe. Entre les marques historiques et les nouveaux challengers, quels critères privilégier pour réussir son achat ?</p>
      
      <h2>1. Définir son budget et ses priorités d'utilisation</h2>
      <p>Avant toute chose, identifiez vos usages majeurs : navigation sur les réseaux sociaux, visionnage multimédia, gaming ou photographie. Pour un usage standard, un smartphone milieu de gamme équipé d'au moins 6 Go de mémoire RAM et de 128 Go de stockage assure une excellente fluidité sans faire exploser la facture.</p>

      <h2>2. L'écran : la clé du confort visuel quotidien</h2>
      <p>Privilégiez les dalles AMOLED ou OLED avec une fréquence de rafraîchissement d'au moins 90 Hz ou 120 Hz. Ces écrans offrent des contrastes parfaits, des noirs profonds et une lisibilité remarquable, même en plein soleil méditerranéen.</p>

      <h2>3. L'autonomie et la recharge rapide</h2>
      <p>Une batterie d'au moins 5 000 mAh est devenue le standard incontournable pour tenir une journée complète voire deux sans angoisse. Ne négligez pas la puissance de recharge : un chargeur rapide de 33W à 67W permet de regagner 50% de batterie en moins de 30 minutes.</p>

      <h2>4. La garantie locale et le service après-vente</h2>
      <p>Acheter sur Dokkena vous assure un produit original bénéficiant d'une garantie constructeur officielle et d'une livraison sécurisée à domicile sur toute la Tunisie.</p>
    `
  },
  {
    slug: 'tendances-mode-beaute-rentree',
    title: 'Les indispensables Beauté et Mode : Conseils et astuces pour un style soigné',
    excerpt: 'Découvrez notre sélection tendance pour composer une garde-robe élégante et une routine beauté protectrice au meilleur prix chez Dokkena.',
    date: '2026-10-28',
    readTime: '4 min de lecture',
    category: 'Fashion & Beauty',
    categorySlug: 'fashion',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
    author: 'Équipe Style Dokkena',
    content: `
      <p class="lead">Prendre soin de son allure et de sa peau au fil des saisons commence par des gestes simples et des pièces intemporelles bien choisies. Découvrez nos conseils pour allier confort, élégance et protection au quotidien.</p>

      <h2>1. Les essentiels d'un vestiaire capsule moderne</h2>
      <p>Inutile de multiplier les achats superflus : misez sur des pièces polyvalentes de qualité faciles à assortir. Une chemise bien coupée, une veste structurée, des baskets épurées et des accessoires raffinés constituent la base d'un look chic et décontracté.</p>

      <h2>2. Hydratation et protection solaire : le duo beauté gagnant</h2>
      <p>Quel que soit votre type de peau, le climat tunisien exige une hydratation constante et une protection solaire adaptée tout au long de l'année. Un nettoyant doux suivi d'une crème hydratante riche en antioxydants préserve la jeunesse et l'éclat de votre teint.</p>

      <h2>3. Des soins sélectionnés sur Dokkena</h2>
      <p>Retrouvez dans notre univers Beauté et Mode des produits cosmétiques certifiés, respectueux de votre peau et livrés rapidement chez vous avec nos garanties de satisfaction.</p>
    `
  }
];

