export type ReadingStatus = 'WANT_TO_READ' | 'READING' | 'COMPLETED';

export type Book = {
  id: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  publishedYear: number | null;
  status: ReadingStatus;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
  };
};

export type BooksResponse = {
  success: boolean;
  data: Book[];
};
