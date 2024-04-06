// Uncomment the code below and write your tests
import axios from 'axios';
import { throttledGetDataFromApi } from './index';

const QUERY = 'todos/1';
const MOCK_DATA = {
  userId: 1,
  id: 1,
  title: 'delectus aut autem',
  completed: false,
};

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should create instance with provided base url', async () => {
    jest.spyOn(axios, 'create');
    await throttledGetDataFromApi(QUERY);
    jest.runOnlyPendingTimers();
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const axiosProto = axios.Axios.prototype;

    jest.spyOn(axiosProto, 'get');
    await throttledGetDataFromApi(QUERY);
    jest.runOnlyPendingTimers();
    expect(axiosProto.get).toHaveBeenCalledWith(QUERY);
  });

  test('should return response data', async () => {
    const axiosProto = axios.Axios.prototype;

    jest.spyOn(axiosProto, 'get').mockResolvedValue({ data: MOCK_DATA });
    const result = await throttledGetDataFromApi(QUERY);
    jest.runOnlyPendingTimers();
    expect(result).toEqual(MOCK_DATA);
  });
});
