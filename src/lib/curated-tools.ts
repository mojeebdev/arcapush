import { url } from "inspector/promises";

export type CuratedTool = {
  url: string;
  name: string;
  description?: string;
  category: string;
  builtByArcapush?: boolean;
};

export const CURATED_TOOLS: CuratedTool[] = [
  
  {
    url: "https://arcapush.com",
    name: "Arcapush",
    category: "Directory",
    builtByArcapush: true,
  },
  {
    url: "https://arcaprompt.arcapush.com",
    name: "ArcaPrompt",
    category: "AI Prompt Engineering",
    builtByArcapush: true,
  },
  {
    url: "https://promptrank.arcapush.com",
    name: "PromptRank",
    category: "AI Prompt Ranking",
    builtByArcapush: true,
  },
  {
    url: "https://claude.ai",
    name: "Claude",
    category: "AI Assistant",
  },

  {
    url: "https://gemini.google.com",
    name: "Gemini",
    category: "AI Assistant",
  },

  {
    url: "https://cursor.sh",
    name: "Cursor",
    category: "AI Editor",
  },
  {
    url: "https://v0.dev",
    name: "v0",
    category: "UI Generator",
  },
  {
    url: "https://bolt.new",
    name: "Bolt",
    category: "Full-stack Builder",
  },
];