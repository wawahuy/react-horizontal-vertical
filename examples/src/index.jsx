import React, { useMemo } from 'react';
import ReactDOM from "react-dom/client";
import { Rhv, ReactFromModule } from 'react-horizontal-vertical';
import './styles.scss'

console.log('React instance:', React === ReactFromModule);

export const App = () => {
  const render = useMemo(() => {
    return Array.from({ length: 2 }).map((_, index) => {
      return (
        <div key={index}>
          <h1>Page {index}</h1>
          {
            ['#aaa', '#bbb', '#ccc', '#ddd', '#aaa', '#bbb', '#ccc', '#ddd', '#aaa', '#bbb', '#ccc', '#ddd', '#aaa', '#bbb', '#ccc', '#ddd']
              .slice(0,2)
              .map((background, index) => {
                return (
                  <p key={`abc_${index}`} style={{ background }}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                  </p>
                )
              })
          }
        </div>
      )
    })
  }, [])

  function handleStateChange(state, index, element) {
  }

  return (
    <Rhv thresholdCount={1000} onStateChange={handleStateChange}>
      {render}
    </Rhv>
  )
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
