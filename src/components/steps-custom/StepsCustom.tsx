import "./index.less"
import React from 'react';
import { Steps } from 'antd';


interface StepData {
  title: string | JSX.Element;
  description?: string | JSX.Element;
}

interface StepsCustomProps {
  steps: StepData[]
  current: number

}


const StepsCustom: React.FC<StepsCustomProps> = ({steps,current, }) => (
  <Steps
    direction={"vertical"}
    size={"default"}
    current={current}
    items={steps}

  />
);

export default StepsCustom;