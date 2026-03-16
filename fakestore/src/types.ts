export interface Book {
  id: number;
  title: string;
  description: string;
  pageCount: number;
  excerpt: string;
  publishDate: string;
}

export interface Author {
  id: number;
  idBook: number;
  firstName: string;
  lastName: string;
}

export interface User {
  id: number;
  userName: string;
  password?: string;
}

export interface Activity {
  id: number;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface Photo {
  id: number;
  idBook: number;
  url: string;
}
