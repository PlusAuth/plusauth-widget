import { get } from 'lodash-es';
import type { ReactNode } from 'react';
import React from 'react';

interface Props {
  json: Record<string, any>;
}

const JsonKeyReplace: React.FC<Props> = ({ json, children }) => {
  const matchRegexp = /\{\{\s*([\w\.-_]*)\s*}}/gm

  function replaceChild(children: ReactNode) {
    const subChild = children.props.children
    if (subChild) {
      if (typeof subChild === 'string' && matchRegexp.test(subChild)) {
        const matches = subChild.replace(matchRegexp, (...args) => {
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
