import { it, describe, expect } from 'vitest';
import { createElement } from '..';

describe('createElement', () => {
  it('should return element virtual dom', () => {
    const el = createElement('div', null, 'hello')
    expect(el).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": [],
                "nodeValue": "hello",
              },
              "type": "TEXT_ELEMENT",
            },
          ],
        },
        "type": "div",
      }
    `)
  })
})