import express from 'express';
import './controller/LoginController';
import './controller/CrowllerController';
import router from './router';
import cookieSession from 'cookie-session';

const app = express();

app.use(express.urlencoded({ extended: false }));

app.use(
  cookieSession({
    name: 'session',
    keys: ['teacher xixi'],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  })
);

app.use(router);

app.listen(7001, () => {
  console.log('server is running');
});
