export interface IFindById<T> {
  findById(id: string): Promise<T>;
}
