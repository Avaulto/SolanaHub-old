import { faArrowRightArrowLeft, faBox, faHandHoldingDroplet, faHome, faPalette, faShieldHeart, faSwimmingPool, faWallet } from "@fortawesome/free-solid-svg-icons";

export const pages: any = [
    {
      title: "overview",
      url: "home",
      icon: 'home',
    },
    // {
    //   title: "learning center",
    //   url: "learn",
    //   icon: 'book-outline',
    // },
    {
      title: "dashboard",
      url: "dashboard",
      icon: 'grid-outline'
    },
    {
      title: "NFT",
      url: "nft-gallery",
      icon: 'color-palette'
    },
    {
      title: "DeFi",
      icon: "cube-outline",
      url: "/defi",
      children: [
        {
          title: "liquid staking",
          url: "/defi/liquid-stake",
          icon: 'water',
        },
        {
          title: "swap",
          url: "/defi/token-swap",
          icon: 'swap-horizontal',
        },
        {
          title: "volt strategies",
          url: "/defi/volt-strategies",
          icon: 'flask',
        },
      ]
    },
    // {
    //   title: "learning center",
    //   url: "learning-center",
    //   icon: 'book-outline',
    // },
    {
      title: "stake with us",
      url: "stake-with-us",
      icon: 'heart-circle',
    },
    {
      title: "settings",
      url: "settings",
      icon: 'cog',
    },
  ];