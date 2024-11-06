import { Button, Form } from 'antd';
import { WrapperHeader } from './style';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import TableComponent from '../TableComponent/Table';
import { useEffect, useState } from 'react';
import InputComPonent from '../InputComponent/InputComponent';

// import { getBase64, renderOptions } from '../../utils';
// import { WrapperUploadFile } from './style';
import * as ProductService from '../../services/ProductService';
import * as BrandService from '../../services/BrandService';
import { useMutationHooks } from '../../hook/useMutationHook';
import Loading from '../LoadingComponent/Loading';
import * as message from '../MessageComponent/Message';
import { useQuery } from 'react-query';
import DrawerComponent from '../DrawComponent/DrawerComponent';
import { useSelector } from 'react-redux';
import ModalComponet from '../ModalComponent/ModalComponent';

const AdminBrand = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('');
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    // const [typeSelect, setTypeSelect] = useState('');
    const inittial = () => ({
        name: '',
    });

    const user = useSelector((state) => state?.user);

    const [stateBrand, setStateBrand] = useState(inittial());
    const [stateBrandDetails, setStateBrandDetails] = useState(inittial());

    const [form] = Form.useForm();

    const mutation = useMutationHooks((data) => {
        const { name } = data;
        const res = BrandService.createBrand({
            name,
        });
        return res;
    });
    // console.log('rowSelected22', rowSelected);
    const mutationUpdate = useMutationHooks((data) => {
        const { id, token, ...rests } = data;
        const res = BrandService.updateBrand(id, token, { ...rests });
        return res;
    });

    const mutationDeleted = useMutationHooks((data) => {
        const { id, token } = data;
        const res = BrandService.deleteBrand(id, token);
        return res;
    });
    // const mutationDeletedMany = useMutationHooks((data) => {
    //     const { token, ...ids } = data;
    //     const res = ProductService.deleteManyProduct(ids, token);
    //     return res;
    // });

    const getAllBrands = async () => {
        const res = await BrandService.getAllBrand();
        return res;
    };
    const fetchgetDetailsBrand = async (rowSelected) => {
        const res = await BrandService.getDetailsBrand(rowSelected);
        if (res?.data) {
            setStateBrandDetails({
                name: res?.data?.name,
            });
        }
        setIsLoadingUpdate(false);
    };
    useEffect(() => {
        if (!isModalOpen) {
            form.setFieldsValue(stateBrandDetails);
        } else {
            form.setFieldsValue(inittial());
        }
    }, [form, stateBrandDetails, isModalOpen]);
    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            setIsLoadingUpdate(true);
            fetchgetDetailsBrand(rowSelected);
        }
    }, [rowSelected, isOpenDrawer]);
    // console.log('datngu', stateProductDetails);
    const handleDetailsBrand = () => {
        setIsOpenDrawer(true);
    };
    // const handleDeleteManyProducts = (ids) => {
    //     mutationDeletedMany.mutate(
    //         { ids: ids, token: user?.access_token },
    //         {
    //             onSettled: () => {
    //                 queryBrand.refetch();
    //             },
    //         },
    //     );
    // };
    // xử lý Type product
    // const fetchAllTypeProduct = async () => {
    //     const res = await ProductService.getAllTypeProduct();
    //     return res;
    // };

    const { data, isLoading, isSuccess, isError } = mutation;
    const {
        data: dataUpdated,
        isLoading: isLoadingUpdated,
        isSuccess: isSuccessUpdated,
        isError: isErrorUpdated,
    } = mutationUpdate;
    const {
        data: dataDeleted,
        isLoading: isLoadingDeleted,
        isSuccess: isSuccessDeleted,
        isError: isErrorDeleted,
    } = mutationDeleted;
    // const {
    //     data: dataDeletedMany,
    //     isLoading: isLoadingDeletedMany,
    //     isSuccess: isSuccessDeletedMany,
    //     isError: isErrorDeletedMany,
    // } = mutationDeletedMany;
    // console.log('dataUpdated', dataUpdated);
    const queryBrand = useQuery(['brands'], getAllBrands);

    // const queryTypeProduct = useQuery(['type-product'], fetchAllTypeProduct);
    const { isLoading: isLoadingBrands, data: brands } = queryBrand;
    const renderActions = () => {
        return (
            <div>
                <DeleteOutlined
                    style={{ color: 'red', fontSize: '25px', cursor: 'pointer' }}
                    onClick={() => setIsModalOpenDelete(true)}
                />
                <EditOutlined
                    style={{ color: '#000', fontSize: '25px', cursor: 'pointer' }}
                    onClick={handleDetailsBrand}
                />
            </div>
        );
    };

    // console.log('queryTypeProduct', queryTypeProduct);
    const columns = [
        {
            title: 'Tên thương hiệu',
            dataIndex: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
        },

        {
            title: 'Action',
            dataIndex: 'action',
            render: renderActions,
        },
    ];
    const dataTable =
        brands?.data?.length &&
        brands?.data?.map((brand) => {
            return {
                ...brand,
                key: brand._id,
            };
        });

    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            message.success();
            handleCancel();
        } else if (isError) {
            message.error();
        }
    }, [isSuccess]);

    // useEffect(() => {
    //     if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
    //         message.success();
    //     } else if (isErrorDeletedMany) {
    //         message.error();
    //     }
    // }, [isSuccessDeletedMany]);

    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            message.success();
            handleCancelDelete();
        } else if (isErrorDeleted) {
            message.error();
        }
    }, [isSuccessDeleted]);
    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateBrandDetails({
            name: '',
        });
        form.resetFields();
    };

    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === 'OK') {
            message.success();
            handleCloseDrawer();
        } else if (isErrorUpdated) {
            message.error();
        }
    }, [isSuccessUpdated]);

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    };

    const handleDeleteBrand = () => {
        mutationDeleted.mutate(
            { id: rowSelected, token: user?.access_token },
            {
                onSettled: () => {
                    queryBrand.refetch();
                },
            },
        );
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateBrand({
            name: '',
        });
        form.resetFields();
    };

    const onFinish = () => {
        const params = {
            name: stateBrand.name,
        };
        mutation.mutate(params, {
            onSettled: () => {
                queryBrand.refetch();
            },
        });
    };
    const handleOnchange = (e) => {
        setStateBrand({
            ...stateBrand,
            [e.target.name]: e.target.value,
        });
    };
    const handleOnchangeDetails = (e) => {
        setStateBrandDetails({
            ...stateBrandDetails,
            [e.target.name]: e.target.value,
        });
    };
    // const handleOnchangeAvatar = async ({ fileList }) => {
    //     const file = fileList[0];
    //     if (!file.url && !file.preview) {
    //         file.preview = await getBase64(file.originFileObj);
    //     }
    //     setStateProduct({
    //         ...stateProduct,
    //         image: file.preview,
    //     });
    // };

    // const handleOnchangeAvatarDetails = async ({ fileList }) => {
    //     const file = fileList[0];
    //     if (!file.url && !file.preview) {
    //         file.preview = await getBase64(file.originFileObj);
    //     }
    //     setStateProductDetails({
    //         ...stateProductDetails,
    //         image: file.preview,
    //     });
    // };
    const onUpdateBrand = () => {
        mutationUpdate.mutate(
            { id: rowSelected, token: user?.access_token, ...stateBrandDetails },
            {
                onSettled: () => {
                    queryBrand.refetch();
                },
            },
        );
    };

    // const handleOnchangeSelect = (value) => {
    //     setStateProduct({
    //         ...stateProduct,
    //         type: value,
    //     });
    // };
    // console.log('value={stateProduct.type}', stateProduct);

    return (
        <div>
            <WrapperHeader>Quản lý Thương hiệu</WrapperHeader>
            <div style={{ marginTop: '10px' }}>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }}
                >
                    <PlusOutlined style={{ fontSize: '60px' }} />
                </Button>
            </div>
            <div style={{ marginTop: '20px' }}>
                <TableComponent
                    // handleDeleteMany={handleDeleteManyProducts}
                    columns={columns}
                    isLoading={isLoadingBrands}
                    data={dataTable}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: (event) => {
                                setRowSelected(record._id);
                            },
                        };
                    }}
                ></TableComponent>
            </div>
            <ModalComponet forceRender title="Tạo Thương hiệu" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <Loading isLoading={isLoading}>
                    <Form
                        name="basic"
                        labelCol={{
                            span: 6,
                        }}
                        wrapperCol={{
                            span: 18,
                        }}
                        style={{
                            maxWidth: 600,
                        }}
                        onFinish={onFinish}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                            label="Tên thương hiệu"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên thương hiệu!',
                                },
                            ]}
                        >
                            <InputComPonent value={stateBrand.name} onChange={handleOnchange} name="name" />
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{
                                offset: 20,
                                span: 16,
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                Thêm mới
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </ModalComponet>
            <DrawerComponent
                title="Chi tiết thương hiệu "
                isOpen={isOpenDrawer}
                onClose={() => setIsOpenDrawer(false)}
                width="90%"
            >
                <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
                    <Form
                        name="basic"
                        labelCol={{
                            span: 4,
                        }}
                        wrapperCol={{
                            span: 20,
                        }}
                        style={{
                            maxWidth: 600,
                        }}
                        onFinish={onUpdateBrand}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                            label="Tên thương hiệu"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên thương hiệu!',
                                },
                            ]}
                        >
                            <InputComPonent
                                value={stateBrandDetails.name}
                                onChange={handleOnchangeDetails}
                                name="name"
                            />
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{
                                offset: 20,
                                span: 16,
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                Update
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </DrawerComponent>
            <ModalComponet
                title="Xóa thương hiệu"
                open={isModalOpenDelete}
                onCancel={handleCancelDelete}
                onOk={handleDeleteBrand}
            >
                <Loading isLoading={isLoadingDeleted}>
                    <div>Bạn có muốn xóa thương hiệu này không ? </div>
                </Loading>
            </ModalComponet>
        </div>
    );
};

export default AdminBrand;
