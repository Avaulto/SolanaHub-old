export interface DefiApp {
    name: string;
    image: string;
    description: string;
    learnMoreLink: string;
    deepLink: string;
    status: 'active' | 'pending';
  }