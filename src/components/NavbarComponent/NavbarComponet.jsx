import { Checkbox, Rate } from 'antd';
import { LableContent, LableText, LableTextPrice, LableTextValue } from './style';

const NavbarComponet = () => {
    const renderContent = (type, options) => {
        switch (type) {
            case 'text':
                return options.map((option, index) => {
                    return <LableTextValue key={index}>{option}</LableTextValue>;
                });
            case 'checkbox':
                return (
                    <Checkbox.Group style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {options.map((option, index) => {
                            return (
                                <Checkbox style={{ marginLeft: '0' }} key={index} value={option.value}>
                                    {option.label}
                                </Checkbox>
                            );
                        })}
                    </Checkbox.Group>
                );
            case 'star':
                return options.map((option, index) => {
                    return (
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <Rate style={{ fontSize: '12px' }} key={index} disabled defaultValue={option}></Rate>
                            <span style={{ fontSize: '12px' }}> {`từ ${option} sao`}</span>
                        </div>
                    );
                });
            case 'price':
                return options.map((option, index) => {
                    return <LableTextPrice key={index}>{option}</LableTextPrice>;
                });

            default:
                return {};
        }
    };
    return (
        <div>
            <LableText>Lable</LableText>
            <LableContent>{renderContent('text', ['Đàn guitar', 'Piano', 'Cajon', 'Trống'])}</LableContent>
            <LableContent>
                {renderContent('checkbox', [
                    { value: 'a', label: 'A' },
                    { value: 'b', label: 'B' },
                    { value: 'c', label: 'C' },
                ])}
            </LableContent>
            <LableContent>{renderContent('star', [3, 4, 5])}</LableContent>
            <LableContent>{renderContent('price', ['dưới 40.000đ', 'trên 50.000đ -->'])}</LableContent>
        </div>
    );
};

export default NavbarComponet;
