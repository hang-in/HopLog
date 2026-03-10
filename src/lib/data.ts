export interface Post {
  id: string;
  date: string;
  title: string;
  category: string[];
  excerpt: string;
  image?: string;
  fontFamily?: string;
  fontUrl?: string;
  visibility?: "public" | "private";
}
