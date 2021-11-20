import { CalcPathService } from './calc-path-service';
import * as server from './server';

const calcPathSvc = new CalcPathService();
// tslint:disable-next-line:no-unused-expression
new server.Api(calcPathSvc);
