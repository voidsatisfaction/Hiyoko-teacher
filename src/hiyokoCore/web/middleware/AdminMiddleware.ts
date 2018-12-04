import * as express from 'express'
import { Configure } from '../../../../config';

export const checkAdminTokenMiddleware: express.Handler = (req: express.Request, res: express.Response, next) => {
  const config = new Configure()
  if (req.headers['admin-token'] !== config.adminToken) {
    // admin page should be not found
    res.status(404).json('not found')
    return
  }
  next()
}