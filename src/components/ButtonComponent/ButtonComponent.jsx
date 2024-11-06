import { Button } from 'antd';

const ButtonComponent = ({ size, style, textButton, styleTextButton, disabled, ...rests }) => {
    return (
        <Button size={size} style={{ ...style, background: disabled ? '#ccc' : style.backgroundColor }} {...rests}>
            {textButton}
            {styleTextButton}
        </Button>
    );
};

export default ButtonComponent;
