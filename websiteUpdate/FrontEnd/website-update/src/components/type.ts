export type Chapter = {
  title: string;
  link: string;
};

export type Manga = {
  title: string;
  chapters: Chapter[];
  readTill: number;
  _id?: string
};