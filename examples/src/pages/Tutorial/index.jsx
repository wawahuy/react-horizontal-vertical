import React, {useEffect, useMemo, useRef} from 'react';

const code = {
  install: '',
  cssLocalIdentName: `
:global {
  @import "~react-horizontal-vertical/dist/index.umd.css";;
}
  `,
  css: `@import "~react-horizontal-vertical/dist/index.umd.css";;`,
  orCss: `import "react-horizontal-vertical/rhv.css";`,
  js: `
import { Rhv } from 'react-horizontal-vertical';

const Page2 = () => {
  return <div className='page-2'>Page 2</div>;
}

export const App = () => {
  return (
    <Rhv>
      {/* Page 1 */}
      <div className='page-1'>Page 1</div>
      {/* Page 2 */}
      <Page2 />
    </Rhv>
  );
}
  `,
  props: [
    {
      'name': 'rootElement',
      'description': 'Container scroll',
      'type': 'HTMLElement'
    },
    {
      'name': 'thresholdCount',
      'description': 'Intersect Threshold.\r\nDefault: 400',
      'type': 'number'
    },
    {
      'name': 'pauseAnimation',
      'description': 'Active pause element when state <> Focus',
      'type': 'boolean'
    },
    {
      'name': 'onStateChange',
      'description': 'Event visibility',
      'type': '(state: RhvItemState, index: number, element?: any) => void'
    },
  ],
  rhvItemState: [
    {
      'name': 'None',
      'description': '',
    },
    {
      'name': 'Initiated',
      'description': 'After compute',
    },
    {
      'name': 'Enter',
      'description': 'When two page floating',
    },
    {
      'name': 'Leave',
      'description': 'When page hidden in viewport',
    },
    {
      'name': 'Focus',
      'description': 'When one page visible in viewport',
    },
  ]
}

export const TutorialPage = () => {

  const propsAndCallback = useMemo(() => {
    return code.props.map((item, index) => {
      return (
        <tr key={'propsCb_' + index}>
          <td>{item.name}</td>
          <td>
            <pre>{item.description}</pre>
          </td>
          <td>{item.type}</td>
        </tr>
      )
    })
  }, []);

  const rhvItemState = useMemo(() => {
    return code.rhvItemState.map((item, index) => {
      return (
        <tr key={'propsCb_' + index}>
          <td>{item.name}</td>
          <td>
            <pre>{item.description}</pre>
          </td>
        </tr>
      )
    })
  }, []);

  return (
    <div className={`rhv-ex`}>
      <div className="rhv-ex-name">
        Tutorial
      </div>

      <div className="rhv-ex-box">
        <div className="rhv-ex-title">Install</div>
        <div className="rhv-ex-group">
          <pre className='code'>
            <code lang="language-sh">
              npm install --save react-horizontal-vertical
            </code>
          </pre>
        </div>
      </div>

      <div className="rhv-ex-box">
        <div className="rhv-ex-title">Usage</div>

        <div className="rhv-ex-group">
          <div className="rhv-ex-subtitle">
            import style in '.css/scss' file:
          </div>
          <pre className='code'>
            <code lang="language-scss">
              {code.css.trim()}
            </code>
          </pre>
        </div>

        <div className="rhv-ex-group">
          <div className="rhv-ex-subtitle">
            or in App.jsx
          </div>
          <pre className='code'>
            <code lang="language-scss">
              {code.orCss.trim()}
            </code>
          </pre>
        </div>

        <div className="rhv-ex-group">
          <div className="rhv-ex-subtitle">
            if css-loader has config localIdentName:
          </div>
          <pre className='code'>
            <code lang="language-scss">
              {code.cssLocalIdentName.trim()}
            </code>
          </pre>
        </div>

        <div className="rhv-ex-group">
          <div className="rhv-ex-subtitle">
            in project:
          </div>
          <pre className='code'>
            <code lang="language-scss">
              {code.js.trim()}
            </code>
          </pre>
        </div>

        <div className="rhv-ex-group">
          <div className="rhv-ex-subtitle">
            properties and callback:
          </div>
          <div className="rhv-ex-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {propsAndCallback}
              </tbody>
            </table>
          </div>
        </div>


        <div className="rhv-ex-group">
          <div className="rhv-ex-subtitle">
            RhvItemState (enum):
          </div>
          <div className="rhv-ex-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {rhvItemState}
              </tbody>
            </table>
            </div>
        </div>

      </div>
    </div>
  );
}
