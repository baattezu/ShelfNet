export interface CommunityPreview {
  id: string;
  name: string;
  tags: string[];
  memberCount: number;
  previewBooks: {
    id: string;
    title: string;
    primaryAuthor: string;
    source?: string;
  }[];
}
