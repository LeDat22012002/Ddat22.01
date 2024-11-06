import { Steps } from 'antd';

const StepComponent = ({ current = 0, items = [] }) => {
    const { Step } = Steps;

    return (
        <Steps current={current}>
            {items.map((item) => {
                return <Step key={item.title} title={item.title} description={item.description}></Step>;
            })}
        </Steps>
    );
};

export default StepComponent;
