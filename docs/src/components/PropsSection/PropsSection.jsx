import React from 'react';
import { useDynamicImport } from 'docusaurus-plugin-react-docgen-typescript/pkg/dist-src/hooks/useDynamicImport';

import PropsComponent from '../PropsComponent/PropsComponent'

const PropsSection = ({ name }) => {
  const props = useDynamicImport(name);

  if (!props) {
    return null;
  }

  return Object.keys(props).map(key => (
    <PropsComponent
      name={key}
      type={`${props[key].type?.name}${props[key].required ? '!' : ''}`}
      defaultValue={props[key].defaultValue?.value ?? null}
      description={props[key].description}
    />
  ))
};

export default PropsSection
