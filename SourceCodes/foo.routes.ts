export const FooRouter: Router = express.Router()

FooRouter.get('/:id', async (req: Request, res: Response) => {
  await FooController.FindById(req, res)
})
