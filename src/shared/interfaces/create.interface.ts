export interface ICreate<T, R> {
  create(input: T): Promise<R>;
}
