import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Voib",
  AUTHOR: "Jesús Bossa",
  EMAIL: "x@jesusbossa.dev",
  NUM_POSTS_ON_HOMEPAGE: 20,
  NUM_WORKS_ON_HOMEPAGE: 2,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Voib - Un blog de Jesús Bossa",
  DESCRIPTION: "Un blog para compartir opinión de programación y videojuegos. Sientete como en casa, tratare de escribir temas recurrentemente.",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "Un blog para compartir opinión de programación y videojuegos. Sientete como en casa, tratare de escribir temas recurrentemente.",
};

export const WORK: Metadata = {
  TITLE: "Work",
  DESCRIPTION: "Where I have worked and what I have done.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION: "A collection of my projects, with links to repositories and demos.",
};

export const SOCIALS: Socials = [
  { 
    NAME: "instagram",
    HREF: "https://www.instagram.com/jesusbossa.dev",
  },
  { 
    NAME: "github",
    HREF: "https://github.com/makinox"
  },
  { 
    NAME: "linkedin",
    HREF: "https://www.linkedin.com/in/jesusbossa",
  },
  { 
    NAME: "home",
    HREF: "https://jesusbossa.dev",
  },
];

export const API_ACTIVE = true;