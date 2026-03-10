import fs from "fs";
import path from "path";
import yaml from "js-yaml";

export interface ColorSchema {
  id: string;
  name: string;
  light: Record<string, string>;
  dark: Record<string, string>;
}

export function getColorSchemas(): ColorSchema[] {
  const contentDir = process.env.CONTENT_DIR || "content";
  const filePath = path.join(process.cwd(), contentDir, "schemas.yml");

  if (!fs.existsSync(filePath)) {
    return [
      {
        id: "default",
        name: "Default Blue",
        light: {
          background: "#ffffff",
          foreground: "#191f28",
          card: "#ffffff",
          "card-foreground": "#191f28",
          muted: "#f2f4f6",
          "muted-foreground": "#8b95a1",
          border: "#e5e8eb",
          primary: "#3182f6",
          "primary-foreground": "#ffffff",
        },
        dark: {
          background: "#000000",
          foreground: "#f9fafb",
          card: "#131518",
          "card-foreground": "#f9fafb",
          muted: "#1e2024",
          "muted-foreground": "#8b95a1",
          border: "#222428",
          primary: "#3182f6",
          "primary-foreground": "#ffffff",
        },
      },
    ];
  }

  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    return yaml.load(fileContents) as ColorSchema[];
  } catch (e) {
    console.error("Failed to load schemas.yml", e);
    return [];
  }
}
