import { describe, it, expect, vi } from 'vitest';
import { helloWorld } from './index';

describe('helloWorld', () => {
  it('should log \'hello world from the package\' to the console', () => {
    // Create a spy on console.log
    const logSpy = vi.spyOn(console, 'log');

    // Call the function
    helloWorld();

    // Assert that the spy was called with the expected message
    expect(logSpy).toHaveBeenCalledWith('hello world from the package');

    // Restore the original console.log
    logSpy.mockRestore();
  });
});
