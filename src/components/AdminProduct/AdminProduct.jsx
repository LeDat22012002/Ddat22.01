import { Button, Form, Select } from 'antd';
import { WrapperHeader } from './style';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import TableComponent from '../TableComponent/Table';
import { useEffect, useState } from 'react';
import InputComPonent from '../InputComponent/InputComponent';

import { getBase64, renderOptions } from '../../utils';
import { WrapperUploadFile } from './style';
import * as ProductService from '../../services/ProductService';
import * as CategoryService from '../../services/CategoryService';
import * as BrandService from '../../services/BrandService';
import { useMutationHooks } from '../../hook/useMutationHook';
import Loading from '../LoadingComponent/Loading';
import * as message from '../../components/MessageComponent/Message';
import { useQuery } from 'react-query';
import DrawerComponent from '../DrawComponent/DrawerComponent';
import { useSelector } from 'react-redux';
import ModalComponet from '../ModalComponent/ModalComponent';

const AdminProduct = () => {
    const { Option } = Select;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('');
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    // const [typeSelect, setTypeSelect] = useState('');
    const inittial = () => ({
        name: '',
        type: '',
        price: '',
        countInStock: '',
        rating: '',
        description: '',
        image: '',
        newType: '',
        discount: '',
        category: '',
        brand: '',
    });

    const user = useSelector((state) => state?.user);
    // const category = useSelector((state) => state?.category);
    // console.log('datngu', category);

    const [stateProduct, setStateProduct] = useState(inittial());
    const [stateProductDetails, setStateProductDetails] = useState(inittial());

    const [form] = Form.useForm();

    const mutation = useMutationHooks((data) => {
        const { name, type, price, countInStock, rating, description, image, discount, category, brand } = data;
        const res = ProductService.createProduct({
            name,
            type,
            price,
            countInStock,
            rating,
            description,
            image,
            discount,
            category,
            brand,
        });
        return res;
    });
    // console.log('datga1', mutation);
    // console.log('rowSelected22', rowSelected);
    const mutationUpdate = useMutationHooks((data) => {
        const { id, token, ...rests } = data;
        const res = ProductService.updateProduct(id, token, { ...rests });
        return res;
    });

    const mutationDeleted = useMutationHooks((data) => {
        const { id, token } = data;
        const res = ProductService.deleteProduct(id, token);
        return res;
    });
    const mutationDeletedMany = useMutationHooks((data) => {
        const { token, ...ids } = data;
        const res = ProductService.deleteManyProduct(ids, token);
        return res;
    });

    const getAllProducts = async () => {
        const res = await ProductService.getAllProduct();
        return res;
    };
    const fetchgetDetailsProduct = async (rowSelected) => {
        const res = await ProductService.getDetailsProduct(rowSelected);
        if (res?.data) {
            setStateProductDetails({
                name: res?.data?.name,
                type: res?.data?.type,
                price: res?.data?.price,
                countInStock: res?.data?.countInStock,
                rating: res?.data?.rating,
                description: res?.data?.description,
                discount: res?.data?.discount,
                image: res?.data?.image,
                category: res?.data?.category?.name,
                brand: res?.data?.brand?.name,
            });
        }
        setIsLoadingUpdate(false);
    };
    useEffect(() => {
        if (!isModalOpen) {
            form.setFieldsValue(stateProductDetails);
        } else {
            form.setFieldsValue(inittial());
        }
    }, [form, stateProductDetails, isModalOpen]);
    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            setIsLoadingUpdate(true);
            fetchgetDetailsProduct(rowSelected);
        }
    }, [rowSelected, isOpenDrawer]);
    // console.log('datngu', stateProductDetails);
    const handleDetailsProduct = () => {
        setIsOpenDrawer(true);
    };
    const handleDeleteManyProducts = (ids) => {
        mutationDeletedMany.mutate(
            { ids: ids, token: user?.access_token },
            {
                onSettled: () => {
                    queryProduct.refetch();
                },
            },
        );
    };
    // xử lý Type product
    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct();
        return res;
    };
    const fetchAllCategoryProduct = async () => {
        const res = await CategoryService.getAllCategory();
        return res;
    };
    const fetchAllBrandProduct = async () => {
        const res = await BrandService.getAllBrand();
        return res;
    };

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
    const {
        data: dataDeletedMany,
        isLoading: isLoadingDeletedMany,
        isSuccess: isSuccessDeletedMany,
        isError: isErrorDeletedMany,
    } = mutationDeletedMany;
    // console.log('dataUpdated', dataUpdated);
    const queryProduct = useQuery(['products'], getAllProducts);
    const queryCategory = useQuery(['categorys'], fetchAllCategoryProduct);
    const queryBrand = useQuery(['brands'], fetchAllBrandProduct);
    const queryTypeProduct = useQuery(['type-product'], fetchAllTypeProduct);
    // console.log('dat77', queryTypeProduct);
    const { isLoading: isLoadingProducts, data: products } = queryProduct;
    const renderActions = () => {
        return (
            <div>
                <DeleteOutlined
                    style={{ color: 'red', fontSize: '25px', cursor: 'pointer' }}
                    onClick={() => setIsModalOpenDelete(true)}
                />
                <EditOutlined
                    style={{ color: '#000', fontSize: '25px', cursor: 'pointer' }}
                    onClick={handleDetailsProduct}
                />
            </div>
        );
    };

    // console.log('queryTypeProduct', queryTypeProduct);
    const columns = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
            filters: [
                {
                    text: '>=50',
                    value: '>=',
                },
                {
                    text: '<=50',
                    value: '<=',
                },
            ],
            onFilter: (value, record) => {
                if (value === '>=') {
                    return record.price >= 50;
                }
                return record.price <= 50;
            },
        },
        {
            title: 'Số sao',
            dataIndex: 'rating',
            sorter: (a, b) => a.rating - b.rating,
            filters: [
                {
                    text: '>=3 sao',
                    value: '>=',
                },
                {
                    text: '<= 3 sao',
                    value: '<=',
                },
            ],
            onFilter: (value, record) => {
                if (value === '>=') {
                    return record.rating >= 3;
                }
                return record.rating <= 3;
            },
        },
        {
            title: 'Dáng đàn',
            dataIndex: 'type',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderActions,
        },
    ];
    const dataTable =
        products?.data?.length &&
        products?.data?.map((product) => {
            return {
                ...product,
                key: product._id,
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

    const handleOnchangeCategory = (value) => {
        setStateProduct({
            ...stateProduct,
            category: value,
        });
        // console.log(`value : ${value}`);
    };

    const handleOnchangeBrand = (value) => {
        setStateProduct({
            ...stateProduct,
            brand: value,
        });
    };

    useEffect(() => {
        if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
            message.success();
        } else if (isErrorDeletedMany) {
            message.error();
        }
    }, [isSuccessDeletedMany]);

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
        setStateProductDetails({
            name: '',
            type: '',
            price: '',
            countInStock: '',
            rating: '',
            description: '',
            image: '',
            discount: '',
            category: '',
            brand: '',
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

    const handleDeleteProduct = () => {
        mutationDeleted.mutate(
            { id: rowSelected, token: user?.access_token },
            {
                onSettled: () => {
                    queryProduct.refetch();
                },
            },
        );
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateProduct({
            name: '',
            type: '',
            price: '',
            countInStock: '',
            rating: '',
            description: '',
            image: '',
            discount: '',
            category: '',
            brand: '',
        });
        form.resetFields();
    };

    const onFinish = () => {
        const params = {
            name: stateProduct.name,
            type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type,
            price: stateProduct.price,
            countInStock: stateProduct.countInStock,
            rating: stateProduct.rating,
            description: stateProduct.description,
            image: stateProduct.image,
            discount: stateProduct.discount,
            category: stateProduct.category,
            brand: stateProduct.brand,
        };
        mutation.mutate(params, {
            onSettled: () => {
                queryProduct.refetch();
            },
        });
    };
    const handleOnchange = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name]: e.target.value,
        });
    };
    // const handleOnchangeDetailsType = (value) => {
    //     setStateProductDetails({
    //         ...stateProductDetails,
    //         type: value,
    //     });
    // };
    const handleOnchangeDetailsCategory = (value) => {
        setStateProductDetails({
            ...stateProductDetails,
            category: value,
        });
    };
    const handleOnchangeDetailsBrand = (value) => {
        setStateProductDetails({
            ...stateProductDetails,
            brand: value,
        });
    };
    const handleOnchangeDetails = (e) => {
        setStateProductDetails({
            ...stateProductDetails,
            [e.target.name]: e.target.value,
        });
    };
    const handleOnchangeAvatar = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProduct({
            ...stateProduct,
            image: file.preview,
        });
    };

    const handleOnchangeAvatarDetails = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProductDetails({
            ...stateProductDetails,
            image: file.preview,
        });
    };
    const onUpdateProduct = () => {
        mutationUpdate.mutate(
            { id: rowSelected, token: user?.access_token, ...stateProductDetails },
            {
                onSettled: () => {
                    queryProduct.refetch();
                },
            },
        );
    };

    const handleOnchangeSelect = (value) => {
        setStateProduct({
            ...stateProduct,
            type: value,
        });
    };

    // console.log('value={stateProduct.type}', stateProduct);

    return (
        <div>
            <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
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
                    handleDeleteMany={handleDeleteManyProducts}
                    columns={columns}
                    isLoading={isLoadingProducts}
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
            <ModalComponet forceRender title="Tạo sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
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
                        {/* name , image , type, price , countInStock , rating , description */}
                        <Form.Item
                            label="Tên sản phẩm"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên sản phẩm!',
                                },
                            ]}
                        >
                            <InputComPonent value={stateProduct.name} onChange={handleOnchange} name="name" />
                        </Form.Item>
                        <Form.Item
                            label="Danh mục  "
                            name="type"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập danh mục sản phẩm ',
                                },
                            ]}
                        >
                            <Select
                                name="type"
                                value={stateProduct.type}
                                onChange={handleOnchangeSelect}
                                options={renderOptions(queryTypeProduct?.data?.data)}
                            ></Select>
                        </Form.Item>

                        {stateProduct.type === 'add_type' && (
                            <Form.Item
                                label="Danh mục mới "
                                name="newType"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập danh mục sản phẩm ',
                                    },
                                ]}
                            >
                                <InputComPonent value={stateProduct.newType} onChange={handleOnchange} name="newType" />
                            </Form.Item>
                        )}
                        <Form.Item
                            label="Categry  "
                            name="category"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập danh mục sản phẩm ',
                                },
                            ]}
                        >
                            <Select
                                name="category"
                                value={stateProduct.category}
                                onChange={handleOnchangeCategory}

                                // options={renderCategory(queryCategory?.data?.data?.name)}
                            >
                                {queryCategory?.data?.data?.map((dattt) => (
                                    <Option key={dattt._id} value={dattt._id}>
                                        {dattt.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Brand"
                            name="brand"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập thương hiệu sản phẩm ',
                                },
                            ]}
                        >
                            <Select
                                name="brand"
                                value={stateProduct.brand}
                                onChange={handleOnchangeBrand}

                                // options={renderCategory(queryCategory?.data?.data?.name)}
                            >
                                {queryBrand?.data?.data?.map((brandd) => (
                                    <Option key={brandd._id} value={brandd._id}>
                                        {brandd.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label=" Số lượng  "
                            name="countInStock"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số lượng sản phẩm ',
                                },
                            ]}
                        >
                            <InputComPonent
                                value={stateProduct.countInStock}
                                onChange={handleOnchange}
                                name="countInStock"
                            />
                        </Form.Item>
                        <Form.Item
                            label=" Giá sản phẩm "
                            name="price"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập giá sản phẩm ',
                                },
                            ]}
                        >
                            <InputComPonent value={stateProduct.price} onChange={handleOnchange} name="price" />
                        </Form.Item>
                        <Form.Item
                            label=" Số sao "
                            name="rating"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số sao của sản phẩm ',
                                },
                            ]}
                        >
                            <InputComPonent value={stateProduct.rating} onChange={handleOnchange} name="rating" />
                        </Form.Item>
                        <Form.Item
                            label=" Mô tả sản phẩm  "
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mô tả của sản phẩm ',
                                },
                            ]}
                        >
                            <InputComPonent
                                value={stateProduct.description}
                                onChange={handleOnchange}
                                name="description"
                            />
                        </Form.Item>
                        <Form.Item
                            label=" Giá giảm "
                            name="discount"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập giảm giá của sản phẩm ',
                                },
                            ]}
                        >
                            <InputComPonent value={stateProduct.discount} onChange={handleOnchange} name="discount" />
                        </Form.Item>
                        <Form.Item
                            label=" Ảnh sản phẩm  "
                            name="image"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ảnh của sản phẩm ',
                                },
                            ]}
                        >
                            <WrapperUploadFile WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                                <Button>select file</Button>
                                {stateProduct?.image && (
                                    <img
                                        src={stateProduct?.image}
                                        style={{
                                            height: '60px',
                                            width: '60px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            marginLeft: '10px',
                                        }}
                                        alt="ảnh sản phẩm"
                                    ></img>
                                )}
                            </WrapperUploadFile>
                        </Form.Item>
                        <Form.Item
                            wrapperCol={{
                                offset: 17,
                                span: 16,
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                Thêm sản phẩm
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </ModalComponet>
            <DrawerComponent
                title="Chi tiết sản phẩm "
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
                        onFinish={onUpdateProduct}
                        autoComplete="on"
                        form={form}
                    >
                        {/* name , image , type, price , countInStock , rating , description */}
                        <Form.Item
                            label="Tên sản phẩm"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên sản phẩm!',
                                },
                            ]}
                        >
                            <InputComPonent
                                value={stateProductDetails.name}
                                onChange={handleOnchangeDetails}
                                name="name"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Size "
                            name="type"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập danh mục sản phẩm ',
                                },
                            ]}
                        >
                            <InputComPonent
                                value={stateProductDetails.type}
                                onChange={handleOnchangeDetails}
                                name="type"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Category "
                            name="category"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập danh mục sản phẩm ',
                                },
                            ]}
                        >
                            <Select
                                name="category"
                                value={stateProductDetails.category}
                                onChange={handleOnchangeDetailsCategory}

                                // options={renderCategory(queryCategory?.data?.data?.name)}
                            >
                                {queryCategory?.data?.data?.map((dattt) => (
                                    <Option key={dattt._id} value={dattt._id}>
                                        {dattt.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Brand"
                            name="brand"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập thương hiệu sản phẩm ',
                                },
                            ]}
                        >
                            <Select
                                name="brand"
                                value={stateProductDetails.brand}
                                onChange={handleOnchangeDetailsBrand}

                                // options={renderCategory(queryCategory?.data?.data?.name)}
                            >
                                {queryBrand?.data?.data?.map((brandd) => (
                                    <Option key={brandd._id} value={brandd._id}>
                                        {brandd.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label=" Số lượng  "
                            name="countInStock"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số lượng sản phẩm ',
                                },
                            ]}
                        >
                            <InputComPonent
                                value={stateProductDetails.countInStock}
                                onChange={handleOnchangeDetails}
                                name="countInStock"
                            />
                        </Form.Item>
                        <Form.Item
                            label=" Giá sản phẩm "
                            name="price"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập giá sản phẩm ',
                                },
                            ]}
                        >
                            <InputComPonent
                                value={stateProductDetails.price}
                                onChange={handleOnchangeDetails}
                                name="price"
                            />
                        </Form.Item>
                        <Form.Item
                            label=" Số sao "
                            name="rating"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số sao của sản phẩm ',
                                },
                            ]}
                        >
                            <InputComPonent
                                value={stateProductDetails.rating}
                                onChange={handleOnchangeDetails}
                                name="rating"
                            />
                        </Form.Item>
                        <Form.Item
                            label=" Mô tả sản phẩm  "
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mô tả của sản phẩm ',
                                },
                            ]}
                        >
                            <InputComPonent
                                value={stateProductDetails.description}
                                onChange={handleOnchangeDetails}
                                name="description"
                            />
                        </Form.Item>
                        <Form.Item
                            label=" Giảm giá "
                            name="discount"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập giảm giá của sản phẩm ',
                                },
                            ]}
                        >
                            <InputComPonent
                                value={stateProductDetails.discount}
                                onChange={handleOnchangeDetails}
                                name="discount"
                            />
                        </Form.Item>
                        <Form.Item
                            label=" Ảnh sản phẩm  "
                            name="image"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ảnh của sản phẩm ',
                                },
                            ]}
                        >
                            <WrapperUploadFile WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
                                <Button>select file</Button>
                                {stateProductDetails?.image && (
                                    <img
                                        src={stateProductDetails?.image}
                                        style={{
                                            height: '60px',
                                            width: '60px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            marginLeft: '10px',
                                        }}
                                        alt="ảnh sản phẩm"
                                    ></img>
                                )}
                            </WrapperUploadFile>
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
                title="Xóa sản phẩm"
                open={isModalOpenDelete}
                onCancel={handleCancelDelete}
                onOk={handleDeleteProduct}
            >
                <Loading isLoading={isLoadingDeleted}>
                    <div>Bạn có muốn xóa sản phẩm này không ? </div>
                </Loading>
            </ModalComponet>
        </div>
    );
};

export default AdminProduct;
