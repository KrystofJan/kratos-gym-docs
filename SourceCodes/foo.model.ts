@Table('foo')
@PrimaryKey('foo_id')
export class Foo extends Model {
  @Column('foo_id')
  public FooId: number

  @ForeignKey(Bar)
  @Column('bar_id')
  public Bar: Bar | undefined

  constructor(jsonData: IDictionary<any>) {
    super()
    this.FooId = jsonData['foo_id'] ?? jsonData['FooId']

    if (jsonData['Bar']) {
      this.Bar = new Bar(jsonData['Bar'])
    } else if (jsonData['bar']) {
      this.Bar = new Bar(jsonData['bar'])
    } else {
      this.Bar = new Bar(jsonData)
      if (!this.Bar?.BarId) {
        this.Bar = undefined
      }
    }
  }
}
