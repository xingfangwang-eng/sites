export interface Note {
  id: string;
  title: string;
  content: string;
  tags: Tag[];
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}
