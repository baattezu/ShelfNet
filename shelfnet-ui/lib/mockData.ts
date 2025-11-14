import { Book, Community, SearchResult, UserProfile } from "@/types";

export const booksMock: Book[] = [
  {
    id: "dune",
    title: "Dune",
    author: "Frank Herbert",
    coverUrl:
      "https://images.unsplash.com/photo-1544937950-fa07a98d237f?auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    tags: ["Sci-Fi", "Classic"],
    category: "sci-fi",
    description:
      "Epic science fiction saga that follows Paul Atreides on the desert planet Arrakis where politics, ecology, and prophecy collide.",
    stats: {
      pages: 688,
      language: "English",
      year: 1965,
    },
  },
  {
    id: "circe",
    title: "Circe",
    author: "Madeline Miller",
    coverUrl:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=400&q=80",
    rating: 4.6,
    tags: ["Mythology", "Fantasy"],
    category: "fantasy",
    description:
      "A feminist retelling of Circe's myth that explores immortality, love, and independence on a remote island.",
    stats: {
      pages: 400,
      language: "English",
      year: 2018,
    },
  },
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    coverUrl:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
    tags: ["Productivity", "Habits"],
    category: "non-fiction",
    description:
      "Guide to building better habits through marginal gains, identity shifts, and systems thinking.",
    stats: {
      pages: 320,
      language: "English",
      year: 2019,
    },
  },
  {
    id: "project-hail-mary",
    title: "Project Hail Mary",
    author: "Andy Weir",
    coverUrl:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80",
    rating: 4.7,
    tags: ["Adventure", "Space"],
    category: "sci-fi",
    description:
      "Teacher-turned-astronaut Ryland Grace wakes alone on a ship and must save Earth with the help of an unexpected ally.",
    stats: {
      pages: 496,
      language: "English",
      year: 2021,
    },
  },
];

export const communitiesMock: Community[] = [
  {
    id: "sci-fi-explorers",
    name: "Sci-Fi Explorers",
    members: 12340,
    description: "Weekly deep dives into speculative futures and space operas.",
    coverUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "classic-lit",
    name: "Classic Literature Club",
    members: 8100,
    description:
      "Discuss Tolstoy, Austen, Nabokov, and other timeless authors.",
    coverUrl:
      "https://images.unsplash.com/photo-1463320898484-cdee8141c787?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "modern-fantasy",
    name: "Modern Fantasy Fans",
    members: 25700,
    description: "Urban fantasy, romantasy, cozy fantasy — we read it all.",
    coverUrl:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
  },
];

export const readersMock: UserProfile[] = [
  {
    id: "elena",
    name: "Elena Voronina",
    username: "elenavreads",
    avatarUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
    bio: "Fantasy devourer. Coffee-powered reviewer.",
    favoriteGenres: ["Fantasy", "Romance"],
    stats: {
      booksRead: 184,
      reviewsWritten: 62,
      communitiesJoined: 8,
    },
  },
  {
    id: "mark",
    name: "Mark Chen",
    username: "markchen",
    avatarUrl:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=200&q=80",
    bio: "Sci-fi nerd. Collects retro paperbacks.",
    favoriteGenres: ["Sci-Fi", "Thriller"],
    stats: {
      booksRead: 210,
      reviewsWritten: 40,
      communitiesJoined: 5,
    },
  },
  {
    id: "aisha",
    name: "Aisha Khan",
    username: "aishak",
    avatarUrl:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80",
    bio: "History buff. Always annotating.",
    favoriteGenres: ["Non-Fiction", "History"],
    stats: {
      booksRead: 132,
      reviewsWritten: 23,
      communitiesJoined: 6,
    },
  },
];

export const globalSearchMock: SearchResult[] = [
  {
    id: "search-dune",
    type: "book",
    title: "Dune",
    subtitle: "Frank Herbert · 4.8 ⭐",
    thumbnail: booksMock[0].coverUrl,
    link: "/books/dune",
  },
  {
    id: "search-elena",
    type: "user",
    title: "Elena Voronina",
    subtitle: "@elenavreads",
    thumbnail: readersMock[0].avatarUrl,
    link: "/profile/elena",
  },
  {
    id: "search-sci-fi",
    type: "community",
    title: "Sci-Fi Explorers",
    subtitle: "12.3k members",
    thumbnail: communitiesMock[0].coverUrl,
    link: "/community",
  },
];
