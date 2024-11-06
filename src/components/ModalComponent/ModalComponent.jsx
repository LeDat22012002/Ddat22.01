import { Modal } from 'antd';

function ModalComponet({ title = 'Modal', isOpen = false, children, ...rests }) {
    return (
        <Modal title={title} open={isOpen} {...rests}>
            {children}
        </Modal>
    );
}

export default ModalComponet;
