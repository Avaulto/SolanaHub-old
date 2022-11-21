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
          title: "swap",
          url: "/defi/token-swap",
          icon: 'swap-horizontal',
        },
        {
          title: "liquid staking",
          url: "/defi/liquid-stake",
          icon: 'water',
        },
          // {
    //   title: "lending",
    //   url: "lending",
    //   icon: faCoins,
    // },
        // {
        //   title: "pools",
        //   url: "/defi/pools",
        //   icon: 'faSwimmingPool',
        // },
        // {
        //   title: "volt strategies",
        //   url: "/defi/volt-strategies",
        //   icon: 'flask',
        // },
      ]
    },
    {
      title: "support us",
      url: "support-us",
      icon: 'heart-circle',
    },
  ];