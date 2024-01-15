import generalUtil from './generalUtil';

describe('generalUtil', () => {
  describe('isError', () => {
    test('should return true if the response is an error', () => {
      const response = {
        error: 'error',
      };
      expect(generalUtil.isError(response)).toEqual(true);
    });
    test('should return false if the response is not an error', () => {
      const response = {
        result: 'result',
      };
      expect(generalUtil.isError(response)).toEqual(false);
    });
  });
});
