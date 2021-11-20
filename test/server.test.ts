import request from 'supertest';
import * as TypeMoq from 'typemoq';
import { CalcPathService } from '../src/calc-path-service';
import * as server from '../src/server';

describe('API services test', () => {

  const calcPathSvcMock = TypeMoq.Mock.ofType<CalcPathService>();

  const cut = new server.Api(calcPathSvcMock.object).app;
  beforeEach(() => {
    calcPathSvcMock
      .setup((it) => it
        .calcPath(
          TypeMoq.It.isAny(),
          TypeMoq.It.isAnyNumber(),
          TypeMoq.It.isAny()))
      .returns(() => [
        {
          id: 1,
          name: 'Fake step',
        },
      ]);
  });

  it('GET / Hello API Request', async () => {
    const result = await request(cut).get('/');
    expect(result.status).toEqual(200);
    expect(result.text).toEqual('Welcome!');
  });

  it('GET calcPath API request with all params correctly set', async () => {
    const inputRoomMap = {
      rooms: [
        {
          id: 1,
          name: 'Hallway',
          north: 2,
          objects: [],
        },
        {
          id: 2,
          name: 'Dining Room',
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
          objects: [
            {
              name: 'Potted Plant',
            },
          ],
        },
      ],
    };

    const result = await request(cut)
      .get('/calcPath')
      .query({
        roomMap: `${JSON.stringify(inputRoomMap)}`,
        startingRoom: '1',
        objectsToCollect: 'Knife,Ball',
      });

    const expectedResult = JSON.stringify([
      {
        id: 1,
        name: 'Fake step',
      },
    ]);
    expect(result.status).toEqual(200);
    expect(result.text).toEqual(expectedResult);
  });

  it('GET calcPath API Request with missing params', async () => {
    const result = await request(cut).get('/calcPath');
    expect(result.status).toEqual(404);
    expect(result.text).toEqual('Missing Parameter');
  });

  it('GET calcPath API Request with wrong format roomMap param', async () => {
    const result = await request(cut)
      .get('/calcPath')
      .query({
        roomMap: 'blabla',
        startingRoom: '1',
        objectsToCollect: 'Knife,Ball',
      });
    expect(result.status).toEqual(404);
    expect(result.text).toMatch(/Parameter format wrong/);
  });

  it('GET calcPath API Request with wrong format roomMap object param', async () => {
    const result = await request(cut)
      .get('/calcPath')
      .query({
        roomMap: '{"blabla": "bleble"}',
        startingRoom: '1',
        objectsToCollect: 'Knife,Ball',
      });
    expect(result.status).toEqual(404);
    expect(result.text).toEqual('Parameter format wrong - [roomMap]');
  });

  it('GET calcPath API Request with wrong format roomMap object param', async () => {
    const inputRoomMap = {
      rooms: [
        {
          name: 'Hallway',
          north: 2,
          objects: [],
        },
        {
          id: 2,
          name: 'Dining Room',
          south: 1,
          west: 3,
          east: 4,
          objects: [],
        },
      ],
    };
    const result = await request(cut)
      .get('/calcPath')
      .query({
        roomMap: `${JSON.stringify(inputRoomMap)}`,
        startingRoom: '1',
        objectsToCollect: 'Knife,Ball',
      });
    expect(result.status).toEqual(404);
    expect(result.text).toEqual('Parameter format wrong - [roomMap]');
  });

  it('GET calcPath API Request with wrong format startingRoom param', async () => {
    const inputRoomMap = {
      rooms: [
        {
          id: 1,
          name: 'Hallway',
          north: 2,
          objects: [],
        },
        {
          id: 2,
          name: 'Dining Room',
          south: 1,
          west: 3,
          east: 4,
          objects: [],
        },
      ],
    };

    const result = await request(cut)
      .get('/calcPath')
      .query({
        roomMap: `${JSON.stringify(inputRoomMap)}`,
        startingRoom: 'blablabla',
        objectsToCollect: 'Knife,Ball',
      });
    expect(result.status).toEqual(404);
    expect(result.text).toEqual('Parameter format wrong - [startingRoom]');
  });

  it('GET calcPath API Request with startingRoom param value too big', async () => {
    const inputRoomMap = {
      rooms: [
        {
          id: 1,
          name: 'Hallway',
          north: 2,
          objects: [],
        },
        {
          id: 2,
          name: 'Dining Room',
          south: 1,
          west: 3,
          east: 4,
          objects: [],
        },
      ],
    };

    const result = await request(cut)
      .get('/calcPath')
      .query({
        roomMap: `${JSON.stringify(inputRoomMap)}`,
        startingRoom: '100',
        objectsToCollect: 'Knife,Ball',
      });
    expect(result.status).toEqual(404);
    expect(result.text).toEqual('Parameter format wrong - [startingRoom too big]');
  });
});
