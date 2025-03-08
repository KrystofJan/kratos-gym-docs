export class FooService {
  static async GetFooById(id: number): Promise<Foo> {
    const db = new BasicQueryDatabase()
    const [databaseErr, databaseResponse] = await safeAwait(
      db.SelectSpecific(Foo, id)
    )
    if (databaseErr !== null) {
      throw databaseErr
    }
    const model = new Foo(databaseResponse)
    if (!model) {
      throw new Error('Could not create a model')
    }
    return model
  }
}
