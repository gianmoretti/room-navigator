import express = require('express');
import {
  Request,
  Response,
} from 'express-serve-static-core';
import { CalcPathService } from './calc-path-service';
import { logger } from './configs';
import { isRoom, Room } from './definitions';

interface RoomMapInputBody {
  rooms: Room[];
}

interface InputQueryParams {
  startingRoom: string;
  objectsToCollect: string;
}

function isRoomMapInputParam(
  arg: any,
): arg is RoomMapInputBody {
  return (
    arg.rooms !== undefined
    && arg.rooms.every((it: any) => isRoom(it))
  );
}

export class Api {
  public app: express.Application;

  private calcPathSvc: CalcPathService;

  constructor(calcPathService: CalcPathService) {
    this.app = express();
    this.calcPathSvc = calcPathService;
    this.app.use(express.urlencoded({extended: true}));
    this.app.use(express.json())
    this.app.get('/', (_: any, res: Response) => {
      res.status(200).send('Welcome!');
    });

    this.app.post(
      '/calc-path',
      (
        req: Request<any, any, RoomMapInputBody, InputQueryParams>,
        res: Response,
      ) => {
        try {
          const {
            startingRoom,
            objectsToCollect,
          }: InputQueryParams = req.query;

          const roomMap: RoomMapInputBody = req.body;

          this.checkIfAllParamsArePresent(
            roomMap,
            startingRoom,
            objectsToCollect,
            res,
          );

          const {
            startingRoomParsed,
            rooms,
            objectsToCollectParsed,
          } = this.checkIfAllParamsHaveTheRightFormat(
            roomMap,
            startingRoom,
            objectsToCollect,
            res,
          );

          logger.info(
            'Parameters processed with success: calling calc path service...',
          );
          const result = this.calcPathSvc.calcPath(
            rooms,
            startingRoomParsed,
            objectsToCollectParsed,
          );
          logger.debug(
            `Calc path service completed [result=${JSON.stringify(
              result,
            )}]`,
          );

          res.status(200).json(result);
        } catch (err) {
          const error = err instanceof Error
            ? err.message
            : 'Failed to do something exceptional';
          this.setWrongParamMessage(res, error);
        }
      },
    );

    this.app.listen(9090, () => logger.info('App listening on port 9090!'));
  }

  private checkIfAllParamsArePresent(
    roomMap: RoomMapInputBody,
    startingRoom: string,
    objectsToCollect: string,
    res: Response,
  ) {
    if (!roomMap || !startingRoom || !objectsToCollect) {
      logger.warn('Missing Params');
      this.setMissingParamMessage(res);
    }
  }

  private checkIfAllParamsHaveTheRightFormat(
    roomMap: RoomMapInputBody,
    startingRoom: string,
    objectsToCollect: string,
    res: Response,
  ) {
    if (!isRoomMapInputParam(roomMap)) {
      logger.warn('Bad Param: roomMap');
      this.setWrongParamMessage(res, 'roomMap');
    }

    const startingRoomParsed = parseInt(startingRoom, 10);
    if (!startingRoomParsed) {
      logger.warn('Bad Param: startingRoom');
      this.setWrongParamMessage(res, 'startingRoom');
    }

    const objectsToCollectParsed = this.parseObjects(
      objectsToCollect,
    );
    if (
      !objectsToCollectParsed
      || objectsToCollectParsed.length === 0
    ) {
      logger.warn('Bad Param: objectToCollect');
      this.setWrongParamMessage(res, 'objectToCollect');
    }

    if (startingRoomParsed > roomMap.rooms.length) {
      logger.warn('Bad Param: startingRoom vs roomMap');
      this.setWrongParamMessage(
        res,
        'startingRoom too big',
      );
    }

    return {
      startingRoomParsed,
      rooms: roomMap.rooms,
      objectsToCollectParsed,
    };
  }

  private setWrongParamMessage(
    resp: Response,
    param: string,
  ) {
    resp
      .status(404)
      .send(`Parameter format wrong - [${param}]`);
  }

  private setMissingParamMessage(resp: Response) {
    resp.status(404).send('Missing Parameter');
  }

  private parseObjects(objects: string): string[] {
    return objects.split(',').map((it) => it.trim());
  }
}
