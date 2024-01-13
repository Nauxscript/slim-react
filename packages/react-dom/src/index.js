import { render } from '@slim-react/core';

export function createRoot(container) {
  return {
    render(App) {
      render(App, container)      
    }
  } 
}