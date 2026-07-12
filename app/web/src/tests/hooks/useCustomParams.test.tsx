import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { useCustomParams } from '../../hooks/useCustomParams'; // Adjust this path to your hook

// A localized spy to read the URL changes in our test
let currentTestLocation: any;
const LocationSpy = () => {
  currentTestLocation = useLocation();
  return null;
};

describe('useCustomParams', () => {
  
  it('should get query parameters successfully', () => {
    // 1. Create a raw, completely clean wrapper just for this test
    const CleanRouterWrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter initialEntries={['/dashboard?tab=settings&id=456']}>
        {children}
      </MemoryRouter>
    );

    // 2. Pass the clean wrapper to isolate it from your global setup tree
    const { result } = renderHook(() => useCustomParams(), { 
      wrapper: CleanRouterWrapper 
    });

    const params = result.current.getParams('tab', 'id');
    expect(params).toEqual({
      tab: 'settings',
      id: '456'
    });
  });

  it('should set and append query parameters smoothly', () => {
    const CleanRouterWrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter initialEntries={['/dashboard?status=active']}>
        <LocationSpy /> {/* Captures URL state changes inside the router */}
        {children}
      </MemoryRouter>
    );

    const { result } = renderHook(() => useCustomParams(), { 
      wrapper: CleanRouterWrapper 
    });

    act(() => {
      result.current.setParams({ mode: 'dark' });
    });

    // Check if it updated parameters while keeping the old ones on the same path
    expect(currentTestLocation.pathname).toBe('/dashboard');
    expect(currentTestLocation.search).toBe('?status=active&mode=dark');
  });
});
