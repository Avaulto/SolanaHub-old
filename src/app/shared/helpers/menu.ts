import { faHouseChimney, faBullseye, faPalette, faStore, faDroplet, faRightLeft, faShieldHeart } from "@fortawesome/free-solid-svg-icons";

export const pages: any = [
    {
      title: "overview",
      url: "home",
      icon: faHouseChimney,
    },
    // {
    //   title: "learning center",
    //   url: "learn",
    //   icon: 'book-outline',
    // },
    {
      title: "dashboard",
      url: "dashboard",
      icon: faBullseye
    },
    {
      title: "NFT",
      url: "nft-gallery",
      icon: faPalette
    },
    {
      title: "DeFi",
      url: "/defi",
      icon: faStore,
      children: [
        {
          title: "liquid staking",
          url: "/defi/liquid-stake",
          icon: faDroplet,
        },
        {
          title: "swap",
          url: "/defi/token-swap",
          icon: faRightLeft,
        },
        // {
        //   title: 'nft-liquidity',
        //   url: "/defi/nft-liquidity",
        //   icon: 'cash-outline',
        // },
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
      icon: faShieldHeart
    }
  ];