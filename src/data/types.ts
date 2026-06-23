export interface PaperLink {
  id: string;
  x?: number;        // 省略可能
  y?: number;        // 省略可能
  r?: number;        // 省略可能
  speed?: number;    // 省略可能
  rotSpeed?: number; // 省略可能
  dir?: number;      // 省略可能
}

export interface BlogPage {
  id: string;
  title: string;
  content: string;
  leftLinks: PaperLink[];
  rightLinks: PaperLink[];
}
