declare module 'app-store-scraper' {
  interface AppResult {
    id: number;
    title: string;
    url: string;
    description: string;
    icon: string;
    genres: string[];
    genreIds: string[];
    primaryGenre: string;
    primaryGenreId: number;
    contentRating: string;
    languages: string[];
    size: string;
    requiredOsVersion: string;
    released: string;
    updated: string;
    releaseNotes: string;
    version: string;
    price: number;
    free: boolean;
    currency: string;
    developerId: number;
    developer: string;
    developerUrl: string;
    developerWebsite: string;
    score: number;
    reviews: number;
    currentVersionScore: number;
    currentVersionReviews: number;
    screenshots: string[];
    ipadScreenshots: string[];
    appletvScreenshots: string[];
    supportedDevices: string[];
    ratings: number;
  }

  interface ReviewResult {
    id: string;
    userName: string;
    userUrl: string;
    version: string;
    score: number;
    title: string;
    text: string;
    url: string;
    updated: string;
  }

  interface AppOptions {
    id?: number | string;
    appId?: string;
    country?: string;
    lang?: string;
    ratings?: boolean;
  }

  interface ReviewOptions {
    id: number | string;
    appId?: string;
    country?: string;
    page?: number;
    sort?: number;
  }

  const sort: {
    RECENT: number;
    HELPFUL: number;
  };

  function app(opts: AppOptions): Promise<AppResult>;
  function reviews(opts: ReviewOptions): Promise<ReviewResult[]>;

  export default {
    app,
    reviews,
    sort,
  };
}

declare module 'google-play-scraper' {
  interface AppResult {
    title: string;
    description: string;
    descriptionHTML: string;
    summary: string;
    installs: string;
    minInstalls: number;
    maxInstalls: number;
    score: number;
    scoreText: string;
    ratings: number;
    reviews: number;
    histogram: Record<string, number>;
    price: number;
    free: boolean;
    currency: string;
    priceText: string;
    offersIAP: boolean;
    IAPRange: string;
    size: string;
    androidVersion: string;
    androidVersionText: string;
    developer: string;
    developerId: string;
    developerEmail: string;
    developerWebsite: string;
    developerAddress: string;
    privacyPolicy: string;
    genre: string;
    genreId: string;
    icon: string;
    headerImage: string;
    screenshots: string[];
    video: string;
    videoImage: string;
    contentRating: string;
    contentRatingDescription: string;
    adSupported: boolean;
    released: string;
    updated: number;
    version: string;
    recentChanges: string;
    comments: string[];
    appId: string;
    url: string;
  }

  interface ReviewResult {
    data: Array<{
      id: string;
      userName: string;
      date: string;
      score: number;
      title: string;
      text: string;
      url: string;
      thumbsUp: number;
      version: string;
    }>;
    nextPaginationToken: string | null;
  }

  interface AppOptions {
    appId: string;
    lang?: string;
    country?: string;
  }

  interface ReviewOptions {
    appId: string;
    lang?: string;
    country?: string;
    sort?: number;
    num?: number;
    paginate?: boolean;
    nextPaginationToken?: string;
  }

  const sort: {
    NEWEST: number;
    RATING: number;
    HELPFULNESS: number;
  };

  function app(opts: AppOptions): Promise<AppResult>;
  function reviews(opts: ReviewOptions): Promise<ReviewResult>;

  export { app, reviews, sort };
  export default { app, reviews, sort };
}
