import { faArrowRightArrowLeft, faBox, faHandHoldingDroplet, faHome, faPalette, faShieldHeart, faWallet } from "@fortawesome/free-solid-svg-icons";

export const pages: any = [
    {
      title: "overview",
      url: "home",
      icon: 'home',
    },
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
    // {
    //   title: "swap",
    //   url: "token-swap",
    //   icon: 'swap-horizontal',
    // },
    // {
    //   title: "liquid staking",
    //   url: "liquid-stake",
    //   icon: 'water',
    // },
    // {
    //   title: "pools",
    //   url: "/defi/pools",
    //   icon: faSwimmingPool,
    // },
    // {
    //   title: "lending",
    //   url: "lending",
    //   icon: faCoins,
    // },
    //    {
    //   title: "the lab",
    //   url: "laboratory",
    //   icon: 'flask',
    // },
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