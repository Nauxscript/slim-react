import { it, describe, expect } from 'vitest';
import { createTextNode } from '..';

describe('createElement', () => {
  it('should return element virtual dom', () => {
    const el = createTextNode('hello')
    expect(el).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [],
          "nodeValue": "hello",
        },
        "type": "TEXT_ELEMENT",
      }
    `)
  })
})