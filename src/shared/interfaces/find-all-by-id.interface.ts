export interface IFindAllById<T> {
    findAllById(id: string): Promise<T[]>;
  }
  