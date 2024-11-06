import { Button, Form } from 'antd';
import { WrapperHeader } from './style';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import TableComponent from '../TableComponent/Table';
import { useEffect, useState } from 'react';
import InputComPonent from '../InputComponent/InputComponent';

// import { getBase64, renderOptions } from '../../utils';
// import { WrapperUploadFile } from './style';

import * as CategoryService from '../../services/CategoryService';
import { useMutationHooks } from '../../hook/useMutationHook';
import Loading from '../LoadingComponent/Loading';
import * as message from '../MessageComponent/Message';
import { useQuery } from 'react-query';
import DrawerComponent from '../DrawComponent/DrawerComponent';
import { useSelector } from 'react-redux';
import ModalComponet from '../ModalComponent/ModalComponent';

const AdminCategory = () => {
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

    const [stateCategory, setStateCategory] = useState(inittial());
    const [stateCategoryDetails, setStateCategoryDetails] = useState(inittial());

    const [form] = Form.useForm();

    const mutation = useMutationHooks((data) => {
        const { name } = data;
        const res = CategoryService.createCategory({
            name,
        });
        return res;
    });

    const mutationUpdate = useMutationHooks((data) => {
        const { id, token, ...rests } = data;
        const res = CategoryService.updateCategory(id, token, { ...rests });
        return res;
    });

    const mutationDeleted = useMutationHooks((data) => {
        const { id, token } = data;
        const res = CategoryService.deleteCategory(id, token);
        return res;
    });
    // const mutationDeletedMany = useMutationHooks((data) => {
    //     const { token, ...ids } = data;
    //     const res = ProductService.deleteManyProduct(ids, token);
    //     return res;
    // });

    const getAllCategorys = async () => {
        const res = await CategoryService.getAllCategory();
        return res;
    };
    const fetchgetDetailsCategory = async (rowSelected) => {
        const res = await CategoryService.getDetailsCategory(rowSelected);
        if (res?.data) {
            setStateCategoryDetails({
                name: res?.data?.name,
            });
        }
        setIsLoadingUpdate(false);
    };
    useEffect(() => {
        if (!isModalOpen) {
            form.setFieldsValue(stateCategoryDetails);
        } else {
            form.setFieldsValue(inittial());
        }
    }, [form, stateCategoryDetails, isModalOpen]);
    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            setIsLoadingUpdate(true);
            fetchgetDetailsCategory(rowSelected);
        }
    }, [rowSelected, isOpenDrawer]);
    // console.log('datngu', stateProductDetails);
    const handleDetailsCategory = () => {
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
    const queryCategory = useQuery(['category'], getAllCategorys);

    // const queryTypeProduct = useQuery(['type-product'], fetchAllTypeProduct);
    const { isLoading: isLoadingCategory, data: categorys } = queryCategory;
    const renderActions = () => {
        return (
            <div>
                <DeleteOutlined
                    style={{ color: 'red', fontSize: '25px', cursor: 'pointer' }}
                    onClick={() => setIsModalOpenDelete(true)}
                />
                <EditOutlined
                    style={{ color: '#000', fontSize: '25px', cursor: 'pointer' }}
                    onClick={handleDetailsCategory}
                />
            </div>
        );
    };

    const columns = [
        {
            title: 'Tên danh mục',
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
        categorys?.data?.length &&
        categorys?.data?.map((category) => {
            return {
                ...category,
                key: category._id,
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
        setStateCategoryDetails({
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

    const handleDeleteCategory = () => {
        mutationDeleted.mutate(
            { id: rowSelected, token: user?.access_token },
            {
                onSettled: () => {
                    queryCategory.refetch();
                },
            },
        );
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateCategory({
            name: '',
        });
        form.resetFields();
    };

    const onFinish = () => {
        const params = {
            name: stateCategory.name,
        };
        mutation.mutate(params, {
            onSettled: () => {
                queryCategory.refetch();
            },
        });
    };
    const handleOnchange = (e) => {
        setStateCategory({
            ...stateCategory,
            [e.target.name]: e.target.value,
        });
    };
    const handleOnchangeDetails = (e) => {
        setStateCategoryDetails({
            ...stateCategoryDetails,
            [e.target.name]: e.target.value,
        });
    };

    const onUpdateCategory = () => {
        mutationUpdate.mutate(
            { id: rowSelected, token: user?.access_token, ...stateCategoryDetails },
            {
                onSettled: () => {
                    queryCategory.refetch();
                },
            },
        );
    };

    return (
        <div>
            <WrapperHeader>Quản lý Danh mục</WrapperHeader>
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
                    isLoading={isLoadingCategory}
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
                            label="Tên danh mục"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên danh mục!',
                                },
                            ]}
                        >
                            <InputComPonent value={stateCategory.name} onChange={handleOnchange} name="name" />
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
                title="Chi tiết danh mục "
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
                        onFinish={onUpdateCategory}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                            label="Tên danh mục"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên danh mục!',
                                },
                            ]}
                        >
                            <InputComPonent
                                value={stateCategoryDetails.name}
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
                title="Xóa danh mục"
                open={isModalOpenDelete}
                onCancel={handleCancelDelete}
                onOk={handleDeleteCategory}
            >
                <Loading isLoading={isLoadingDeleted}>
                    <div>Bạn có muốn xóa danh mục này không ? </div>
                </Loading>
            </ModalComponet>
        </div>
    );
};

export default AdminCategory;
