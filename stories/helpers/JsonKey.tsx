import React, {ReactNode} from 'react';
import {get} from 'lodash-es';

interface Props {
  json: Record<string, any>;
}

const JsonKeyReplace: React.FC<Props> = ({json, children}) => {
  const matchRegexp = /\{\{\s*([\w\.-_]*)\s*}}/gm

  function replaceChild(children: ReactNode) {
    if (children.props.children) {
      if (typeof children.props.children === "string" && matchRegexp.test(children.props.children)) {
        const matches = children.props.children.replace(matchRegexp, (...args) => {
          return get(json, args[1])
        })
        return React.cloneElement(children, {
          ...children.props,
          children: matches
        })
      } else {
        return replaceChild(children.props.children)
      }
    }
    return children
  }

  return React.Children.map(children, child => {
    return replaceChild(child);
  });
}

export default JsonKeyReplace;
