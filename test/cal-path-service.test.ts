import { CalcPathService } from '../src/calc-path-service';
import { Room, Step } from '../src/definitions';

const sut = new CalcPathService();
test(`given a room map, a starting room and a list of object to collect
      when the graph is complete and all the objects could be collected
      should return a specific step list containing all the objects`, () => {
  const roomsMap: Room[] = [
    { id: 1, name: 'Hallway', north: 2, objects: [] },
    { id: 2, name: 'Dining Room', south: 1, west: 3, east: 4, objects: [] },
    {
      id: 3,
      name: 'Kitchen',
      east: 2,
      objects: [
        {
          name: 'Knife',
        },
      ],
    },
    {
      id: 4,
      name: 'Sun Room',
      west: 2,
      objects: [
        {
          name: 'Potted Plant',
        },
      ],
    },
  ];
  const startingRoom = 2;
  const objectsToCollect: string[] = ['Knife', 'Potted Plant'];

  const expectedResult: Step[] = [
    { id: 2, name: 'Dining Room' },
    { id: 1, name: 'Hallway' },
    { id: 2, name: 'Dining Room' },
    { id: 3, name: 'Kitchen', objectCollected: ['Knife'] },
    { id: 2, name: 'Dining Room' },
    { id: 4, name: 'Sun Room', objectCollected: ['Potted Plant'] },
  ];
  expect(
    JSON.stringify(sut.calcPath(roomsMap, startingRoom, objectsToCollect)),
  ).toBe(JSON.stringify(expectedResult));
});

test(`given a room map, a starting room and a list of object to collect
      when there are more than one object in a single room
      should return a specific step list containing all the objects`, () => {
  const roomsMap: Room[] = [
    { id: 1, name: 'Hallway', north: 2, objects: [] },
    { id: 2, name: 'Dining Room', south: 1, west: 3, east: 4, objects: [] },
    {
      id: 3,
      name: 'Kitchen',
      east: 2,
      objects: [
        {
          name: 'Knife',
        },
        {
          name: 'Potted Plant',
        },
      ],
    },
    {
      id: 4,
      name: 'Sun Room',
      west: 2,
      objects: [],
    },
  ];
  const startingRoom = 2;
  const objectsToCollect: string[] = ['Knife', 'Potted Plant'];

  const expectedResult: Step[] = [
    { id: 2, name: 'Dining Room' },
    { id: 1, name: 'Hallway' },
    { id: 2, name: 'Dining Room' },
    { id: 3, name: 'Kitchen', objectCollected: ['Knife', 'Potted Plant'] },
  ];
  expect(
    JSON.stringify(sut.calcPath(roomsMap, startingRoom, objectsToCollect)),
  ).toBe(JSON.stringify(expectedResult));
});

test(`given another bigger room map, a starting room and a list of object to collect
      when the graph is complete and all the objects could be collected
      should return a specific step list containing all the objects`, () => {
  const roomsMap: Room[] = [
    {
      id: 1,
      name: 'Hallway',
      north: 2,
      east: 7,
      objects: [],
    },
    {
      id: 2,
      name: 'Dining Room',
      north: 5,
      south: 1,
      west: 3,
      east: 4,
      objects: [],
    },
    {
      id: 3,
      name: 'Kitchen',
      east: 2,
      objects: [
        {
          name: 'Knife',
        },
      ],
    },
    {
      id: 4,
      name: 'Sun Room',
      west: 2,
      north: 6,
      south: 7,
      objects: [],
    },
    {
      id: 5,
      name: 'Bedroom',
      south: 2,
      east: 6,
      objects: [
        {
          name: 'Pillow',
        },
      ],
    },
    {
      id: 6,
      name: 'Bathroom',
      west: 5,
      south: 4,
      objects: [],
    },
    {
      id: 7,
      name: 'Living room',
      west: 1,
      north: 4,
      objects: [
        {
          name: 'Potted Plant',
        },
      ],
    },
  ];
  const startingRoom = 4;
  const objectsToCollect: string[] = ['Knife', 'Potted Plant', 'Pillow'];

  const expectedResult: Step[] = [
    { id: 4, name: 'Sun Room' },
    { id: 6, name: 'Bathroom' },
    { id: 5, name: 'Bedroom', objectCollected: ['Pillow'] },
    { id: 2, name: 'Dining Room' },
    { id: 1, name: 'Hallway' },
    { id: 7, name: 'Living room', objectCollected: ['Potted Plant'] },
    { id: 1, name: 'Hallway' },
    { id: 2, name: 'Dining Room' },
    { id: 3, name: 'Kitchen', objectCollected: ['Knife'] }];
  expect(
    JSON.stringify(sut.calcPath(roomsMap, startingRoom, objectsToCollect)),
  ).toBe(JSON.stringify(expectedResult));
});

test(`given a room map, a starting room and a list of object to collect
      when the rooms are empty
      should return a specific step list without objects`, () => {
  const roomsMap: Room[] = [
    {
      id: 1,
      name: 'Hallway',
      north: 2,
      east: 7,
      objects: [],
    },
    {
      id: 2,
      name: 'Dining Room',
      north: 5,
      south: 1,
      west: 3,
      east: 4,
      objects: [],
    },
    {
      id: 3,
      name: 'Kitchen',
      east: 2,
      objects: [],
    },
    {
      id: 4,
      name: 'Sun Room',
      west: 2,
      north: 6,
      south: 7,
      objects: [],
    },
    {
      id: 5,
      name: 'Bedroom',
      south: 2,
      east: 6,
      objects: [],
    },
    {
      id: 6,
      name: 'Bathroom',
      west: 5,
      south: 4,
      objects: [],
    },
    {
      id: 7,
      name: 'Living room',
      west: 1,
      north: 4,
      objects: [],
    },
  ];
  const startingRoom = 4;
  const objectsToCollect: string[] = ['Knife', 'Potted Plant', 'Pillow'];

  const expectedResult: Step[] = [
    { id: 4, name: 'Sun Room' },
    { id: 6, name: 'Bathroom' },
    { id: 5, name: 'Bedroom' },
    { id: 2, name: 'Dining Room' },
    { id: 1, name: 'Hallway' },
    { id: 7, name: 'Living room' },
    { id: 1, name: 'Hallway' },
    { id: 2, name: 'Dining Room' },
    { id: 3, name: 'Kitchen' }];
  expect(
    JSON.stringify(sut.calcPath(roomsMap, startingRoom, objectsToCollect)),
  ).toBe(JSON.stringify(expectedResult));
});

test(`given a room map, a starting room and a list of object to collect
      when the starting room is closed
      should return a step list containing the starting room only`, () => {
  const roomsMap: Room[] = [
    {
      id: 1,
      name: 'Hallway',
      north: 2,
      east: 7,
      objects: [],
    },
    {
      id: 2,
      name: 'Dining Room',
      north: 5,
      south: 1,
      west: 3,
      objects: [],
    },
    {
      id: 3,
      name: 'Kitchen',
      east: 2,
      objects: [],
    },
    {
      id: 4,
      name: 'Sun Room',
      objects: [],
    },
    {
      id: 5,
      name: 'Bedroom',
      south: 2,
      east: 6,
      objects: [],
    },
    {
      id: 6,
      name: 'Bathroom',
      west: 5,
      objects: [],
    },
    {
      id: 7,
      name: 'Living room',
      west: 1,
      objects: [],
    },
  ];
  const startingRoom = 4;
  const objectsToCollect: string[] = ['Knife', 'Potted Plant', 'Pillow'];

  const expectedResult: Step[] = [
    { id: 4, name: 'Sun Room' }];
  expect(
    JSON.stringify(sut.calcPath(roomsMap, startingRoom, objectsToCollect)),
  ).toBe(JSON.stringify(expectedResult));
});

test(`given a room map, a starting room and a list of object to collect
      when the room map has not reachable rooms
      should return a specific step list without the not reachable rooms`, () => {
  const roomsMap: Room[] = [
    {
      id: 1,
      name: 'Hallway',
      north: 2,
      east: 7,
      objects: [],
    },
    {
      id: 2,
      name: 'Dining Room',
      north: 5,
      south: 1,
      east: 4,
      objects: [],
    },
    {
      id: 3,
      name: 'Kitchen',
      objects: [],
    },
    {
      id: 4,
      name: 'Sun Room',
      west: 2,
      north: 6,
      south: 7,
      objects: [],
    },
    {
      id: 5,
      name: 'Bedroom',
      south: 2,
      east: 6,
      objects: [],
    },
    {
      id: 6,
      name: 'Bathroom',
      west: 5,
      south: 4,
      objects: [],
    },
    {
      id: 7,
      name: 'Living room',
      west: 1,
      north: 4,
      objects: [],
    },
  ];
  const startingRoom = 4;
  const objectsToCollect: string[] = ['Knife', 'Potted Plant', 'Pillow'];

  const expectedResult: Step[] = [
    { id: 4, name: 'Sun Room' },
    { id: 6, name: 'Bathroom' },
    { id: 5, name: 'Bedroom' },
    { id: 2, name: 'Dining Room' },
    { id: 1, name: 'Hallway' },
    { id: 7, name: 'Living room' },
    { id: 1, name: 'Hallway' },
    { id: 2, name: 'Dining Room' },
    { id: 5, name: 'Bedroom' },
    { id: 6, name: 'Bathroom' },
    { id: 4, name: 'Sun Room' }];
  expect(
    JSON.stringify(sut.calcPath(roomsMap, startingRoom, objectsToCollect)),
  ).toBe(JSON.stringify(expectedResult));
});
