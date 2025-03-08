export class FooController {
  static async FindById(req: Request, res: Response) {
    const id = Number(req.params['id'])
    const [err, foo] = await safeAwait(FooService.GetFooById(id))
    if (err !== null) {
      const response = new FailedResponse(
        'Could not find foo with the id ' + id, // message
        404 // status code
      )
      response.buildResponse(req, res)
      // ^^ sends response message with status code
      return
    }
    if (!plan.Bar) {
      const response = new FailedResponse(
        'Could not find bar for foo with the id ' + id,
        404
      )
      response.buildResponse(req, res)
      return
    }

    const [errBar, bar] = await safeAwait(Bar.GetBarById(foo.Bar.BarId))
    if (errBar !== null) {
      // make an failed response and return
      return
    }
    foo.Bar = bar

    // ...

    const response = new OkResponse('found all data successfully', foo)
    response.buildResponse(req, res)
  }
}
