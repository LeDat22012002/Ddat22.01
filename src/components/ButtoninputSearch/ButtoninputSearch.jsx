import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import InputComPonent from '../InputComponent/InputComponent';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
const ButtoninputSearch = (props) => {
    const {
        size,
        placeholder,
        textButton,

        backgroundColorInput = '#fff',
        backgroundColorButton = 'rgb(13,92 ,182)',
        colorButton = '#fff',
    } = props;
    return (
        <div style={{ display: 'flex' }}>
            <InputComPonent
                size={size}
                placeholder={placeholder}
                style={{ backgroundColor: backgroundColorInput }}
                {...props}
            ></InputComPonent>
            <ButtonComponent
                size={size}
                style={{
                    backgroundColor: backgroundColorButton,
                    color: colorButton,
                    marginLeft: '-10px',
                    border: 'none',
                }}
                icon={<SearchOutlined />}
                textButton={textButton}
            ></ButtonComponent>
        </div>
    );
};

export default ButtoninputSearch;
