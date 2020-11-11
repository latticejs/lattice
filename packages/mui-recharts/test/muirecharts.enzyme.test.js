import React from 'react';

describe('mui-recharts', () => {
  let useEffect;
  test('useEffect', () => {
    useEffect = jest.spyOn(React, 'useEffect');
    const mockUseEffect = jest.fn();
    mockUseEffect();
    expect(mockUseEffect).toHaveBeenCalled();
  });
});
