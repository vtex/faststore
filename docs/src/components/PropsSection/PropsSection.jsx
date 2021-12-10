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
      required={props[key].required}
      type={props[key].type?.name}
      defaultValue={props[key].defaultValue?.value ?? null}
      description={props[key].description}
    />
  ))
};

export default PropsSection
