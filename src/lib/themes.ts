import fs from "fs";
import path from "path";
import yaml from "js-yaml";

export interface ColorTheme {
  id: string;
  name: string;
  light: Record<string, string>;
  dark: Record<string, string>;
}

const defaultThemes: ColorTheme[] = [
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

function loadThemeFile(filePath: string): ColorTheme | null {
  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const theme = yaml.load(fileContents) as ColorTheme | null;
    return theme;
  } catch (error) {
    console.error(`Failed to load theme file: ${filePath}`, error);
    return null;
  }
}

export function getColorThemes(): ColorTheme[] {
  const contentDir = process.env.CONTENT_DIR || "content";
  const themesDir = path.join(process.cwd(), contentDir, "themes");
  const legacyThemesDir = path.join(process.cwd(), contentDir, "schemas");
  const legacyFilePath = path.join(process.cwd(), contentDir, "schemas.yml");

  for (const directoryPath of [themesDir, legacyThemesDir]) {
    if (!fs.existsSync(directoryPath)) {
      continue;
    }

    try {
      const themeFiles = fs
        .readdirSync(directoryPath)
        .filter((fileName) => /\.ya?ml$/i.test(fileName))
        .sort();

      const themes = themeFiles
        .map((fileName) => loadThemeFile(path.join(directoryPath, fileName)))
        .filter((theme): theme is ColorTheme => theme !== null);

      if (themes.length > 0) {
        return themes;
      }
    } catch (error) {
      console.error(`Failed to load theme directory: ${directoryPath}`, error);
    }
  }

  if (fs.existsSync(legacyFilePath)) {
    try {
      const fileContents = fs.readFileSync(legacyFilePath, "utf8");
      return yaml.load(fileContents) as ColorTheme[];
    } catch (error) {
      console.error("Failed to load legacy schemas.yml", error);
    }
  }

  return defaultThemes;
}
