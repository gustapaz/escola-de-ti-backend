export interface IUpdate<T, R> {
  update(id: string, input: T): Promise<R>;
}
