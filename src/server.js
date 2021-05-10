import { createRequire } from 'module';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import availableCitiesRouter from './resources/public/routes/public.available-cities.router';
import cateringEventsRouter from './resources/public/routes/public.catering-events.router';
import pressReleasesRouter from './resources/public/routes/public.pressReleases.router';
import ingredientsRouter from './resources/public/routes/public.ingredients.router';
import productsRouter from './resources/public/routes/public.products.router';
import bakeriesRouter from './resources/public/routes/public.bakeries.router';
import clientRouter from './resources/client/routes/clients.router';
import usersRouter from './resources/user/routes/users.router';
import winston from './config/winston';

const require = createRequire(import.meta.url);
const express = require('express');
const helmet = require("helmet");

const app = express();
dotenv.config({ path: '../.env' });

app.disable('x-powered-by');

app.use(
  cors({
    origin: [process.env.FRONT_URL],
    credentials: true,
    exposedHeaders: ['Token', 'Refresh-Token', 'Client-Token', 'Content-Type'],
    methods: ["GET", 'POST', 'DELETE', 'PUT', 'OPTIONS']
  })
);
app.use(helmet.contentSecurityPolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());
app.use(bodyParser.default.json());
app.use(bodyParser.default.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/:lang/available-cities', availableCitiesRouter);
app.use('/api/:lang/bakeries', bakeriesRouter);
app.use('/api/:lang/catering', cateringEventsRouter);
app.use('/api/:lang/ingredients', ingredientsRouter);
app.use('/api/:lang/products', productsRouter);
app.use('/api/:lang/press', pressReleasesRouter);
app.use('/api/protected/user/auth', usersRouter);
app.use('/api/protected/client/auth', clientRouter);
app.use(morgan('combined', { stream: winston.stream }));

export const start = async () => {
  try {
    app.listen(process.env.SERVER_PORT, () => {
      console.log(`REST API on http://localhost:${process.env.SERVER_PORT}`);
    });
  } catch (e) {
    console.error(e);
  }
};
