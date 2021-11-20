import { logger } from './configs';
import {
  Room,
  RoomDictionary,
  RoomDictElement,
  Step,
} from './definitions';

export class CalcPathService {
  public calcPath(
    roomMap: Room[],
    startingRoom: number,
    objectToCollect: string[],
  ): Step[] {
    return this.calcInternalPath(
      this.calcRoomDictionary(roomMap),
      startingRoom,
      objectToCollect,
    );
  }

  private calcRoomDictionary = (
    roomMap: Room[],
  ): RoomDictionary => roomMap.reduce(
    (accumulator, currentRoom) => ({
      ...accumulator,
      [currentRoom.id]: this.transformRoom(currentRoom),
    }),
    {},
  );

  private calcInternalPath(
    roomDict: RoomDictionary,
    startingRoomIdx: number,
    objectToCollect: string[],
  ): Step[] {
    const roomsCount = Object.keys(roomDict).length;
    const objSet: Set<string> = new Set(objectToCollect);
    const crossedRooms: Step[] = new Array<Step>();

    let currentRoomIdx = startingRoomIdx;
    let backCounter = 1;
    let roomsVisited = new Set(
      crossedRooms.map((it) => it.id),
    ).size;
    while (
      objSet.size !== 0
      && backCounter !== 0
      && roomsVisited < roomsCount
    ) {
      const currentRoom = roomDict[currentRoomIdx];
      logger.debug(
        `Current room: ${currentRoom.originalRoom.id}`,
      );
      const takenObject: string[] = this.takeSomeRoomObjects(
        currentRoom.objects,
        objSet,
      );
      crossedRooms.push({
        id: currentRoomIdx,
        name: currentRoom.originalRoom.name,
        objectCollected:
          takenObject.length > 0 ? takenObject : undefined,
      });
      this.removeObjectsAlreadyTaken(objSet, takenObject);
      const nextRoomIdx = currentRoom.dependencies.find(
        (it) => !crossedRooms.find(
          (visistedRoom) => visistedRoom.id === it,
        ),
      );
      if (nextRoomIdx) {
        logger.debug(`Go forward to room: ${nextRoomIdx}`);
        currentRoomIdx = nextRoomIdx;
        backCounter = 1;
      } else {
        const backRoom = crossedRooms[
          crossedRooms.length - 1 - backCounter
        ];
        if (backRoom) {
          logger.debug(`Go back to room: ${backRoom.id}`);
          currentRoomIdx = backRoom.id;
          backCounter += 2;
        } else {
          backCounter = 0;
        }
      }
      roomsVisited = new Set(
        crossedRooms.map((it) => it.id),
      ).size;
      logger.debug(`Objects till to collect: ${objSet}`);
    }
    return crossedRooms;
  }

  private transformRoom = (room: Room): RoomDictElement => {
    const dependencies: number[] = new Array<number>();
    if (room.north) {
      dependencies.push(room.north);
    }
    if (room.south) {
      dependencies.push(room.south);
    }
    if (room.west) {
      dependencies.push(room.west);
    }
    if (room.east) {
      dependencies.push(room.east);
    }
    return {
      originalRoom: room,
      objects: room.objects.map((it) => it.name),
      dependencies,
    };
  };

  private takeSomeRoomObjects(
    objectInRoom: string[],
    objectToCollect: Set<string>,
  ): string[] {
    logger.debug(`Objects to collect: ${objectToCollect}`);
    const objsFound = objectInRoom.filter((objInRoom) => objectToCollect.has(objInRoom));
    return objsFound;
  }

  private removeObjectsAlreadyTaken(
    objectToCollect: Set<string>,
    takenObject: string[],
  ) {
    takenObject.forEach((it) => objectToCollect.delete(it));
  }
}
