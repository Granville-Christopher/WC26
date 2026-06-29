/** Official FIFA World Cup 26 hospitality hero images (Webflow CDN) */
export const FIFA_HERO = {
  /** Portrait — player action shot (788×1000) */
  portrait:
    "https://cdn.prod.website-files.com/689fd0a66c26ce8fe1446c25/69d95f1cd329a58ab5240e4b_FWC26_Ecomm_Photo_Update_A_788x1000.webp",
  /** Wide — stadium crowd atmosphere (1000×720) */
  stadium:
    "https://cdn.prod.website-files.com/689fd0a66c26ce8fe1446c25/69d95f4c71d00684ba1d8e76_FWC26_Ecomm_Photo_Update_B_1000x720.webp",
};

export const LOUNGE_IMAGES: Record<string, string> = {
  "Pitchside Lounge": FIFA_HERO.stadium,
  VIP: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80",
  "Trophy Lounge":
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
  "Champions Club":
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
  "FIFA Pavilion":
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
};

export const SECTION_IMAGES = {
  privateSuites: FIFA_HERO.stadium,
  platinum:
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80",
  accommodations:
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
};
