import { Request, Response, Router } from 'express'

const router: Router = Router()

router.get('/', (req: Request, res: Response) => {
  return res.json({
    teste: 'alvaro',
  })
})

export { router }
