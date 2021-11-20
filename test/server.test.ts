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

  it('POST / Hello API Request', async () => {
    const result = await request(cut).get('/');
    expect(result.status).toEqual(200);
    expect(result.text).toEqual('Welcome!');
  });

  it('POST calc-path API request with all params correctly set', async () => {
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
      .post('/calc-path')
      .send(inputRoomMap)
      .query({
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

  it('POST calc-path API Request with missing params', async () => {
    const result = await request(cut).post('/calc-path');
    expect(result.status).toEqual(404);
    expect(result.text).toEqual('Missing Parameter');
  });

  it('POST calc-path API Request with wrong format rooms body', async () => {
    const result = await request(cut)
      .post('/calc-path')
      .send({rooms: 'blabla'})
      .query({
        startingRoom: '1',
        objectsToCollect: 'Knife,Ball',
      });
    expect(result.status).toEqual(404);
    expect(result.text).toMatch(/Parameter format wrong/);
  });

  it('POST calc-path API Request with wrong format rooms body object', async () => {
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
      .post('/calc-path')
      .send(inputRoomMap)
      .query({
        startingRoom: '1',
        objectsToCollect: 'Knife,Ball',
      });
    expect(result.status).toEqual(404);
    expect(result.text).toEqual('Parameter format wrong - [roomMap]');
  });

  it('POST calc-path API Request with wrong format startingRoom param', async () => {
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
      .post('/calc-path')
      .send(inputRoomMap)
      .query({
        roomMap: `${JSON.stringify(inputRoomMap)}`,
        startingRoom: 'blablabla',
        objectsToCollect: 'Knife,Ball',
      });
    expect(result.status).toEqual(404);
    expect(result.text).toEqual('Parameter format wrong - [startingRoom]');
  });

  it('POST calc-path API Request with startingRoom param value too big', async () => {
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
      .post('/calc-path')
      .send(inputRoomMap)
      .query({
        roomMap: `${JSON.stringify(inputRoomMap)}`,
        startingRoom: '100',
        objectsToCollect: 'Knife,Ball',
      });
    expect(result.status).toEqual(404);
    expect(result.text).toEqual('Parameter format wrong - [startingRoom too big]');
  });
});
