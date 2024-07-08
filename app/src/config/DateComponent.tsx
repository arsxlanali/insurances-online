import React from 'react';

import DefaultDateSelection from 'src/components/dateComponent/DefaultDateSelection';
import SDKBeginDateSelection from 'src/components/dateComponent/SDKBeginDateSelection';
import { useAppSelector } from 'src/utils/hooks';
import mandants from './mandant';

const DateComponent = () => {
  const { mandant } = useAppSelector(state => state.config);
  const component: string | null | undefined = mandants[mandant]?.dateComponentOnStartPage;
  const ComponentToRender = component === 'SDKBeginDateSelection' ? SDKBeginDateSelection : DefaultDateSelection;

  return <ComponentToRender />;
};

export default DateComponent;
