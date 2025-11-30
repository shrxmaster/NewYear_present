import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type CrystalType = "kindness" | "memories" | "courage" | "unity";

export interface Crystal {
  type: CrystalType;
  name: string;
  description: string;
  collected: boolean;
  icon: string;
}

export type ChapterKey = "start" | "attic" | "cozyStreet" | "market" | "forest" | "square" | "final" | "collection";

export interface GameState {
  currentChapter: ChapterKey;
  crystals: {
    kindness: boolean;
    memories: boolean;
    courage: boolean;
    unity: boolean;
  };
  completedChapters: ChapterKey[];
  themeColor: ThemeColor;
  gameCompleted: boolean;
}

export type ThemeColor = "blue" | "pink" | "purple" | "mint";

export const defaultGameState: GameState = {
  currentChapter: "start",
  crystals: {
    kindness: false,
    memories: false,
    courage: false,
    unity: false,
  },
  completedChapters: [],
  themeColor: "blue",
  gameCompleted: false,
};

export const crystalInfo: Record<CrystalType, Omit<Crystal, "collected">> = {
  kindness: {
    type: "kindness",
    name: "Crystal of Kindness",
    description: "Found on the Cozy Street, where neighbors help each other prepare for New Year.",
    icon: "Heart",
  },
  memories: {
    type: "memories",
    name: "Crystal of Memories",
    description: "Discovered at the Market, where warm memories of past New Years linger.",
    icon: "Camera",
  },
  courage: {
    type: "courage",
    name: "Crystal of Courage",
    description: "Retrieved from the Winter Forest, where bravery lights the way.",
    icon: "Shield",
  },
  unity: {
    type: "unity",
    name: "Crystal of Unity",
    description: "Earned at the Celebration Square, where the town comes together.",
    icon: "Users",
  },
};

export const chapterInfo: Record<ChapterKey, { title: string; order: number }> = {
  start: { title: "Start", order: 0 },
  attic: { title: "The Attic", order: 1 },
  cozyStreet: { title: "Cozy Street", order: 2 },
  market: { title: "The Market", order: 3 },
  forest: { title: "Winter Forest", order: 4 },
  square: { title: "Celebration Square", order: 5 },
  final: { title: "The Star's Glow", order: 6 },
  collection: { title: "Collection", order: 7 },
};
