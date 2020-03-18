import 'reflect-metadata';
import { Router, Request, Response, NextFunction } from 'express';
import { controller, get, post } from '../decorator';
import { getResponseData } from '../utils/util';

interface BodyRequest extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

@controller('/api')
export class LoginController {
  static isLogin(req: BodyRequest): boolean {
    return !!(req.session ? req.session.login : false);
  }

  @get('/isLogin')
  isLogin(req: BodyRequest, res: Response): void {
    const isLogin = LoginController.isLogin(req);
    const result = getResponseData<responseResult.isLogin>(isLogin);
    res.json(result);
  }

  @post('/login')
  login(req: BodyRequest, res: Response): void {
    const { password } = req.body;
    const isLogin = LoginController.isLogin(req);
    if (isLogin) {
      res.json(getResponseData<boolean>(true));
    } else {
      if (password === '123' && req.session) {
        req.session.login = true;
        res.json(getResponseData<responseResult.login>(true));
      } else {
        res.json(getResponseData<responseResult.login>(false, '登录失败'));
      }
    }
  }

  @get('/logout')
  logout(req: BodyRequest, res: Response): void {
    if (req.session) {
      req.session.login = undefined;
    }
    res.json(getResponseData<responseResult.logout>(true));
  }

  @get('/')
  home(req: BodyRequest, res: Response): void {
    const isLogin = LoginController.isLogin(req);

    if (isLogin) {
      res.send(`
        <html>
          <body>
            <a href='/getData'>爬取内容</a>
            <a href='/showData'>展示内容</a>
            <a href='/logout'>退出</a>
          </body>
        </html>
      `);
    } else {
      res.send(`
      <html>
        <body>
          <form method="post" action="/login">
            <input type="password" name="password" />
            <button>登录</button>
          </form>
        </body>
      </html>
      `);
    }
  }
}
