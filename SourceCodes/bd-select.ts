export class BasicQueryDatabase extends Database {
  constructor() {
    super()
    // ^^ initialize Database
    // (a wrapper for postgres sql library)
  }

  async SelectSpecific<T extends Model>(
    modelType: new (data: IDictionary<DatabaseType>) => T,
    id: number
  ): Promise<DatabaseFoundSingle<T>> {
    const tableName = Reflect.getMetadata(DecoratorType.TABLE_NAME, modelType)
    const pkey: string = Reflect.getMetadata(
      DecoratorType.PRIMARY_KEY,
      modelType
    )

    try {
      const [result]: T[] = await this.sql<T[]>`
	Select * from ${this.sql(tableName)}
	where ${this.sql(pkey)} = ${id}
      `
      return new DatabaseFoundSingle<T>(result)
    } catch (error) {
      const err = error as Error
      throw new CodedError(ErrorCode.DATABASE_ERROR, err?.message)
    } finally {
      this.sql.end() // close connection
    }
  }
}
