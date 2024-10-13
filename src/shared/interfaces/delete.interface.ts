export interface IDelete<T> {
    delete(id: string): Promise<T>;
}