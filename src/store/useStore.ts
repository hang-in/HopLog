import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BlogState {
  selectedCategory: string | null;
  setCategory: (category: string | null) => void;
  isWideMode: boolean;
  toggleWideMode: () => void;
  visibleCount: number;
  loadMore: () => void;
  colorSchema: string;
  setColorSchema: (schemaId: string) => void;
}

const POSTS_PER_PAGE = 10;

export const useBlogStore = create<BlogState>()(
  persist(
    (set) => ({
      selectedCategory: null,
      // 카테고리가 바뀔 때마다 보여주는 갯수를 초기화
      setCategory: (category) =>
        set({ selectedCategory: category, visibleCount: POSTS_PER_PAGE }),

      isWideMode: true,
      toggleWideMode: () => set((state) => ({ isWideMode: !state.isWideMode })),

      visibleCount: POSTS_PER_PAGE,
      loadMore: () =>
        set((state) => ({ visibleCount: state.visibleCount + POSTS_PER_PAGE })),

      colorSchema: "default",
      setColorSchema: (id) => {
        set({ colorSchema: id });
        document.documentElement.setAttribute("data-color-schema", id);
      },
    }),
    {
      name: "vimlog-storage",
      partialize: (state) => ({
        isWideMode: state.isWideMode,
        colorSchema: state.colorSchema,
      }), // 와이드 모드와 스키마 상태 영속성 유지
    },
  ),
);
