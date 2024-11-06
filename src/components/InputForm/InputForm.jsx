// import { useState } from 'react';
import { InputStyle } from './style';

const InputForm = (props) => {
    const { placeholder, ...rests } = props;
    const handleOnchangeInput = (e) => {
        props.onChange(e.target.value);
    };
    return (
        <InputStyle
            placeholder={placeholder}
            value={props.value}
            {...rests}
            onChange={handleOnchangeInput}
        ></InputStyle>
    );
};

export default InputForm;
