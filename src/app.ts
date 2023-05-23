import createError, {HttpError} from 'http-errors';
import express, {Application, Request, Response, NextFunction} from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';

import noteRouter from './routes/note';
import usersRouter from './routes/users';
import homePage from './routes/homepage';


const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', noteRouter);
app.use('/', usersRouter);
app.use('/', homePage);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err: HttpError, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const port = process.env.PORT || 3000

const MONGO_URL = "mongodb+srv://sofiyyahabidoye:sofiyyah@cluster1.qndy2vq.mongodb.net/test"

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL).then(()=> {
  console.log('Database connection established')
})
mongoose.connection.on('error', (error: Error) => console.log(error));

export default app;