// Uncomment the code below and write your tests
import fs from 'fs';
import path from 'path';
import { doStuffByTimeout, doStuffByInterval, readFileAsynchronously } from '.';

const DELAY = 100;

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    jest.spyOn(global, 'setTimeout');
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const cb = jest.fn();

    doStuffByTimeout(cb, DELAY);
    expect(setTimeout).toHaveBeenCalledWith(cb, DELAY);
  });

  test('should call callback only after timeout', () => {
    const cb = jest.fn();

    doStuffByTimeout(cb, DELAY);
    expect(cb).not.toHaveBeenCalled();

    jest.runOnlyPendingTimers();
    expect(cb).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    jest.spyOn(global, 'setInterval');
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const cb = jest.fn();

    doStuffByInterval(cb, DELAY);
    expect(setInterval).toHaveBeenCalledWith(cb, DELAY);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const cb = jest.fn();

    doStuffByInterval(cb, DELAY);
    expect(cb).toHaveBeenCalledTimes(0);
    jest.advanceTimersByTime(DELAY);
    expect(cb).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(DELAY);
    expect(cb).toHaveBeenCalledTimes(2);
    jest.advanceTimersByTime(DELAY);
    expect(cb).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  beforeEach(() => {
    jest.spyOn(path, 'join');
  });

  test('should call join with pathToFile', async () => {
    await readFileAsynchronously('./file.txt');
    expect(path.join).toHaveBeenCalledWith(expect.any(String), './file.txt');
  });

  test('should return null if file does not exist', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValueOnce(false);

    const result = await readFileAsynchronously('./file.txt');
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const fileContent = 'Some text innformation';

    jest
      .spyOn(fs.promises, 'readFile')
      .mockResolvedValue(Buffer.from(fileContent, 'utf8'));
    jest.spyOn(fs, 'existsSync').mockReturnValueOnce(true);

    const result = await readFileAsynchronously('./file.txt');
    expect(result).toBe(fileContent);
  });
});
