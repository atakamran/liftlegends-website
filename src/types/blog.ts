
import { ReactNode } from "react";

export interface BlogPost {
  id: string;
  category: string;
  categorySlug: string;
  icon: ReactNode;
  title: string;
  description: string;
  date: string;
  readTime: string;
  image: string;
  featured: boolean;
}
