import { Input } from 'antd';
import React from 'react';
const InputComPonent = ({ size, placeholder, style, ...rests }) => {
    return <Input size={size} placeholder={placeholder} style={style} {...rests}></Input>;
};

export default InputComPonent;
