import React from 'react';
import { Flex, Image, Heading, Text, Button } from 'theme-ui';
import Link from 'gatsby-link';
import base from '@theme-ui/preset-base';

function Card(_ref) {
  var children = _ref.children,
      variant = _ref.variant;
  var variantStr = "card" + (variant ? "." + variant : '');
  return React.createElement(Flex, {
    variant: variantStr
  }, children);
}

function CardImage(_ref) {
  var alt = _ref.alt,
      src = _ref.src,
      href = _ref.href;
  var linkProps = {
    as: Link,
    to: href,
    variant: 'card.image.link'
  };
  return React.createElement(Flex, {
    variant: "card.image"
  }, React.createElement(Flex, Object.assign({}, linkProps), React.createElement(Image, {
    variant: "card.image.content",
    alt: alt,
    src: src,
    loading: "lazy"
  })));
}

function CardInfo(_ref) {
  var title = _ref.title,
      description = _ref.description,
      children = _ref.children;
  return React.createElement(Flex, {
    variant: "card.info"
  }, title && React.createElement(Heading, {
    variant: "card.info.title"
  }, title), description && React.createElement(Text, {
    variant: "card.info.description"
  }, description), children && React.createElement(Flex, {
    variant: "card.info.children"
  }, children));
}

function CardInfoAction(_ref) {
  var href = _ref.href,
      label = _ref.label;
  var props = {
    as: Link,
    to: href,
    variant: 'card.info.action'
  };
  return React.createElement(Button, Object.assign({}, props), label);
}

var CardTheme = {
  card: {
    margin: '0 auto',
    width: '100%',
    maxWidth: ['100%', '100%', '96rem'],
    maxHeight: '540px',
    background: '#e0efe0',
    flexWrap: 'wrap',
    image: {
      width: ['100%', '70%'],
      display: 'inline',
      maxHeight: '540px',
      objectFit: 'cover',
      link: {
        flex: 1
      },
      content: {
        width: '100%'
      }
    },
    info: {
      padding: [3, 0, 0],
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: ['100%', '30%'],
      action: {
        marginTop: 3
      }
    }
  }
};

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var theme = /*#__PURE__*/_extends({}, base, {
  colors: {
    text: '#3f3f40',
    textMuted: '#979899',
    textBold: '#03003d',
    background: '#fff',
    primary: '#0f3e99',
    muted: '#f0f0f0'
  }
});

export { Card, CardImage, CardInfo, CardInfoAction, theme as baseTheme, CardTheme as cardTheme };
//# sourceMappingURL=store-ui.esm.js.map
