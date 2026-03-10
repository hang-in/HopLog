import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post } from './data'; // 기존 타입 재사용을 위함

export interface PostDetail extends Post {
  content: string;
}

// 환경 변수 기반 스토리지 경로 (기본값: 루트의 content 폴더)
const contentDir = process.env.CONTENT_DIR || 'content';
const postsDirectory = path.join(process.cwd(), contentDir, 'posts');

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) return [];
  
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const id = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      // gray-matter를 이용해 frontmatter(메타데이터) 파싱
      const matterResult = matter(fileContents);
      
      // 카테고리 정규화 (string -> string[], comma-separated -> string[])
      let categories: string[] = [];
      if (Array.isArray(matterResult.data.category)) {
        categories = matterResult.data.category;
      } else if (typeof matterResult.data.category === 'string') {
        categories = matterResult.data.category.split(',').map(c => c.trim());
      }

      return {
        id,
        ...(matterResult.data as Omit<Post, 'id' | 'category'>),
        category: categories,
      } as Post;
    });

  // 날짜 기준 내림차순 정렬
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostById(id: string): PostDetail | null {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  let categories: string[] = [];
  if (Array.isArray(matterResult.data.category)) {
    categories = matterResult.data.category;
  } else if (typeof matterResult.data.category === 'string') {
    categories = matterResult.data.category.split(',').map(c => c.trim());
  }

  return {
    id,
    content: matterResult.content,
    ...(matterResult.data as Omit<Post, 'id' | 'category'>),
    category: categories,
  } as PostDetail;
}
