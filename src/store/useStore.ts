import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_LOCALE, getHtmlLang, type Locale } from "@/lib/i18n";
import { POSTS_PER_PAGE } from "@/lib/data";

interface BlogState {
  selectedCategory: string | null;
  setCategory: (category: string | null) => void;
  isWideMode: boolean;
  toggleWideMode: () => void;
  visibleCount: number;
  loadMore: () => void;
  colorTheme: string;
  setColorTheme: (themeId: string) => void;
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useBlogStore = create<BlogState>()(
  persist(
    (set) => ({
      selectedCategory: null,
      setCategory: (category) =>
        set({ selectedCategory: category, visibleCount: POSTS_PER_PAGE }),

      isWideMode: true,
      toggleWideMode: () => set((state) => ({ isWideMode: !state.isWideMode })),

      visibleCount: POSTS_PER_PAGE,
      loadMore: () =>
        set((state) => ({ visibleCount: state.visibleCount + POSTS_PER_PAGE })),

      colorTheme: "default",
      setColorTheme: (id) => {
        set({ colorTheme: id });
        document.documentElement.setAttribute("data-color-theme", id);
      },

      locale: DEFAULT_LOCALE,
      setLocale: (locale) => {
        set({ locale });
        document.documentElement.lang = getHtmlLang(locale);
      },
    }),
    {
      name: "hoplog-storage",
      merge: (persistedState, currentState) => {
        const typedState = persistedState as Partial<BlogState> & { colorSchema?: string };

        return {
          ...currentState,
          ...typedState,
          colorTheme: typedState.colorTheme ?? typedState.colorSchema ?? currentState.colorTheme,
          locale: typedState.locale ?? currentState.locale,
        };
      },
      partialize: (state) => ({
        isWideMode: state.isWideMode,
        colorTheme: state.colorTheme,
        locale: state.locale,
      }),
    },
  ),
);
