export interface Room {
  id: number;
  name: string;
  north?: number;
  south?: number;
  west?: number;
  east?: number;
  objects: MyObject[];
}

export interface RoomDictElement {
  originalRoom: Room;
  objects: string[];
  dependencies: number[];
}

export interface RoomDictionary {
  [id: number]: RoomDictElement;
}

export interface MyObject {
  name: string;
}

export interface Step {
  id: number;
  name: string;
  objectCollected?: string[];
}

export function isRoom(arg: any): arg is Room {
  return (
    arg.id !== undefined
    && arg.name !== undefined
    && arg.objects !== undefined
    && arg.objects.every((it: any) => isMyObject(it))
  );
}

function isMyObject(arg: any): arg is MyObject {
  return arg.name !== undefined;
}
