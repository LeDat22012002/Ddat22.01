import { Button, Form, Select, Typography, Row, Col, Space, Input, InputNumber, Upload } from 'antd';
import { WrapperHeader } from './style';
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    ShopOutlined,
    DollarOutlined,
    InboxOutlined,
} from '@ant-design/icons';
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

const { TextArea } = Input;

const AdminProduct = () => {
    const { Option } = Select;
    const [isEdit, setIsEdit] = useState(false);
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

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(8);

    const getAllProducts = async () => {
        const res = await ProductService.getAllProduct('', limit, currentPage);
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
        setIsEdit(true);
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
    const queryProduct = useQuery(['products', currentPage, limit], getAllProducts, {
        retry: 3,
        retryDelay: 1000,
        keepPreviousData: true,
    });
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
            message.success('Thêm sản phẩm thành công');
            handleCancel();
            setCurrentPage(1);
        } else if (isError || data?.status === 'ERR') {
            message.error(data?.message || 'Có lỗi xảy ra');
        }
    }, [isSuccess, isError, data]);

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
            message.success('Xóa các sản phẩm thành công');
        } else if (isErrorDeletedMany || dataDeletedMany?.status === 'ERR') {
            message.error(dataDeletedMany?.message || 'Có lỗi xảy ra khi xóa sản phẩm');
        }
    }, [isSuccessDeletedMany, isErrorDeletedMany, dataDeletedMany]);

    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            message.success('Xóa sản phẩm thành công');
            handleCancelDelete();
            setCurrentPage(1);
        } else if (isErrorDeleted || dataDeleted?.status === 'ERR') {
            message.error(dataDeleted?.message || 'Có lỗi xảy ra khi xóa sản phẩm');
            handleCancelDelete();
        }
    }, [isSuccessDeleted, isErrorDeleted, dataDeleted]);
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
            message.success('Cập nhật sản phẩm thành công');
            handleCloseDrawer();
            setCurrentPage(1);
        } else if (isErrorUpdated || dataUpdated?.status === 'ERR') {
            message.error(dataUpdated?.message || 'Có lỗi xảy ra khi cập nhật');
        }
    }, [isSuccessUpdated, isErrorUpdated, dataUpdated]);

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
        setIsEdit(false);
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

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= (products?.pagination?.totalPages || 1)) {
            setCurrentPage(newPage);
            setLimit(8);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

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
                />

                {/* Thêm phân trang */}
                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '20px',
                        gap: '8px',
                    }}
                >
                    <button
                        style={{
                            padding: '8px 16px',
                            border: '1px solid #d9d9d9',
                            borderRadius: '4px',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                            backgroundColor: currentPage === 1 ? '#f5f5f5' : 'white',
                        }}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || isLoadingProducts}
                    >
                        Trước
                    </button>

                    {Array.from({ length: products?.pagination?.totalPages || 1 }).map((_, index) => (
                        <button
                            key={index + 1}
                            style={{
                                padding: '8px 16px',
                                border: '1px solid #d9d9d9',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                backgroundColor: currentPage === index + 1 ? 'rgb(11, 116, 229)' : 'white',
                                color: currentPage === index + 1 ? 'white' : 'black',
                            }}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        style={{
                            padding: '8px 16px',
                            border: '1px solid #d9d9d9',
                            borderRadius: '4px',
                            cursor: currentPage === (products?.pagination?.totalPages || 1) ? 'not-allowed' : 'pointer',
                            backgroundColor:
                                currentPage === (products?.pagination?.totalPages || 1) ? '#f5f5f5' : 'white',
                        }}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === (products?.pagination?.totalPages || 1) || isLoadingProducts}
                    >
                        Sau
                    </button>
                </div>
            </div>
            <ModalComponet
                title={
                    <Typography.Title level={4} style={{ margin: 0 }}>
                        {isEdit ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
                    </Typography.Title>
                }
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={800}
                style={{
                    top: 20,
                    maxHeight: '90vh',
                    overflow: 'auto',
                }}
            >
                <Loading isLoading={isLoading}>
                    <Form form={form} onFinish={onFinish} layout="vertical" style={{ marginTop: '20px' }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label={<span style={{ fontWeight: 500 }}>Tên sản phẩm</span>}
                                    name="name"
                                    rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                                >
                                    <Input
                                        prefix={<ShopOutlined />}
                                        placeholder="Nhập tên sản phẩm"
                                        style={{ borderRadius: '6px' }}
                                        onChange={handleOnchange}
                                        name="name"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label={<span style={{ fontWeight: 500 }}>Dáng đàn</span>}
                                    name="type"
                                    rules={[{ required: true, message: 'Vui lòng chọn dáng đàn!' }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Chọn dáng đàn"
                                        style={{ width: '100%', borderRadius: '6px' }}
                                        onChange={handleOnchangeSelect}
                                        options={[
                                            ...renderOptions(queryTypeProduct?.data?.data),
                                            {
                                                value: 'add_type',
                                                label: '+ Thêm dáng đàn mới',
                                            },
                                        ]}
                                    />
                                </Form.Item>

                                {stateProduct.type === 'add_type' && (
                                    <Form.Item
                                        label={<span style={{ fontWeight: 500 }}>Tên dáng đàn mới</span>}
                                        name="newType"
                                        rules={[{ required: true, message: 'Vui lòng nhập tên dáng đàn mới!' }]}
                                    >
                                        <Input
                                            placeholder="Nhập tên dáng đàn mới"
                                            style={{ borderRadius: '6px' }}
                                            onChange={handleOnchange}
                                            name="newType"
                                        />
                                    </Form.Item>
                                )}
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label={<span style={{ fontWeight: 500 }}>Giá bán</span>}
                                    name="price"
                                    rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                                >
                                    <InputNumber
                                        style={{ width: '100%', borderRadius: '6px' }}
                                        prefix={<DollarOutlined />}
                                        placeholder="Nhập giá"
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                        onChange={(value) => handleOnchange({ target: { name: 'price', value } })}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label={<span style={{ fontWeight: 500 }}>Số lượng</span>}
                                    name="countInStock"
                                    rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                                >
                                    <InputNumber
                                        style={{ width: '100%', borderRadius: '6px' }}
                                        min={0}
                                        placeholder="Nhập số lượng"
                                        onChange={(value) =>
                                            handleOnchange({ target: { name: 'countInStock', value } })
                                        }
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label={<span style={{ fontWeight: 500 }}>Danh mục</span>}
                                    name="category"
                                    rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Chọn danh mục"
                                        style={{ width: '100%', borderRadius: '6px' }}
                                        onChange={handleOnchangeCategory}
                                    >
                                        {queryCategory?.data?.data?.map((cat) => (
                                            <Select.Option key={cat._id} value={cat._id}>
                                                {cat.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label={<span style={{ fontWeight: 500 }}>Thương hiệu</span>}
                                    name="brand"
                                    rules={[{ required: true, message: 'Vui lòng chọn thương hiệu!' }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Chọn thương hiệu"
                                        style={{ width: '100%', borderRadius: '6px' }}
                                        onChange={handleOnchangeBrand}
                                    >
                                        {queryBrand?.data?.data?.map((brand) => (
                                            <Select.Option key={brand._id} value={brand._id}>
                                                {brand.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            label={<span style={{ fontWeight: 500 }}>Mô tả sản phẩm</span>}
                            name="description"
                            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                        >
                            <TextArea
                                rows={4}
                                placeholder="Nhập mô tả chi tiết về sản phẩm"
                                style={{ borderRadius: '6px' }}
                                onChange={handleOnchange}
                                name="description"
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span style={{ fontWeight: 500 }}>Hình ảnh sản phẩm</span>}
                            name="image"
                            rules={[{ required: true, message: 'Vui lòng chọn ảnh!' }]}
                        >
                            <Upload.Dragger
                                maxCount={1}
                                beforeUpload={() => false}
                                onChange={handleOnchangeAvatar}
                                accept="image/*"
                                style={{
                                    borderRadius: '6px',
                                    padding: '20px',
                                }}
                            >
                                {stateProduct?.image ? (
                                    <img
                                        src={stateProduct.image}
                                        alt="product"
                                        style={{
                                            height: '100px',
                                            width: 'auto',
                                            objectFit: 'contain',
                                        }}
                                    />
                                ) : (
                                    <>
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined style={{ fontSize: '48px', color: '#40a9ff' }} />
                                        </p>
                                        <p className="ant-upload-text">Kéo thả hoặc click để tải ảnh lên</p>
                                    </>
                                )}
                            </Upload.Dragger>
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0 }}>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: '8px',
                                    marginTop: '24px',
                                    paddingTop: '16px',
                                    borderTop: '1px solid #f0f0f0',
                                }}
                            >
                                <Button onClick={handleCancel}>Hủy bỏ</Button>
                                <Button type="primary" htmlType="submit" loading={isLoading}>
                                    {isEdit ? 'Cập nhật' : 'Thêm mới'}
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </Loading>
            </ModalComponet>
            <DrawerComponent
                title={
                    <Typography.Title level={4} style={{ margin: 0 }}>
                        Chi tiết sản phẩm
                    </Typography.Title>
                }
                isOpen={isOpenDrawer}
                onClose={() => setIsOpenDrawer(false)}
                width="50%"
            >
                <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
                    <Form
                        name="basic"
                        layout="vertical"
                        onFinish={onUpdateProduct}
                        autoComplete="on"
                        form={form}
                        style={{ marginTop: '20px' }}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label={<span style={{ fontWeight: 500 }}>Tên sản phẩm</span>}
                                    name="name"
                                    rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                                >
                                    <Input
                                        prefix={<ShopOutlined />}
                                        placeholder="Nhập tên sản phẩm"
                                        style={{ borderRadius: '6px' }}
                                        value={stateProductDetails.name}
                                        onChange={handleOnchangeDetails}
                                        name="name"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label={<span style={{ fontWeight: 500 }}>Dáng đàn</span>}
                                    name="type"
                                    rules={[{ required: true, message: 'Vui lòng chọn dáng đàn!' }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Chọn dáng đàn"
                                        style={{ width: '100%', borderRadius: '6px' }}
                                        value={stateProductDetails.type}
                                        onChange={(value) => {
                                            setStateProductDetails({
                                                ...stateProductDetails,
                                                type: value
                                            });
                                        }}
                                        options={[
                                            ...renderOptions(queryTypeProduct?.data?.data),
                                            {
                                                value: 'add_type',
                                                label: '+ Thêm dáng đàn mới'
                                            }
                                        ]}
                                    />
                                </Form.Item>

                                {stateProductDetails.type === 'add_type' && (
                                    <Form.Item
                                        label={<span style={{fontWeight: 500}}>Tên dáng đàn mới</span>}
                                        name="newType"
                                        rules={[{ required: true, message: 'Vui lòng nhập tên dáng đàn mới!' }]}
                                    >
                                        <Input
                                            placeholder="Nhập tên dáng đàn mới"
                                            style={{ borderRadius: '6px' }}
                                            onChange={handleOnchangeDetails}
                                            name="newType"
                                        />
                                    </Form.Item>
                                )}
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label={<span style={{ fontWeight: 500 }}>Giá bán</span>}
                                    name="price"
                                    rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                                >
                                    <InputNumber
                                        style={{ width: '100%', borderRadius: '6px' }}
                                        prefix={<DollarOutlined />}
                                        placeholder="Nhập giá"
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                        value={stateProductDetails.price}
                                        onChange={(value) => handleOnchangeDetails({ target: { name: 'price', value } })}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label={<span style={{ fontWeight: 500 }}>Số lượng</span>}
                                    name="countInStock"
                                    rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                                >
                                    <InputNumber
                                        style={{ width: '100%', borderRadius: '6px' }}
                                        min={0}
                                        placeholder="Nhập số lượng"
                                        value={stateProductDetails.countInStock}
                                        onChange={(value) => handleOnchangeDetails({ target: { name: 'countInStock', value } })}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label={<span style={{ fontWeight: 500 }}>Danh mục</span>}
                                    name="category"
                                    rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Chọn danh mục"
                                        style={{ width: '100%', borderRadius: '6px' }}
                                        value={stateProductDetails.category}
                                        onChange={handleOnchangeDetailsCategory}
                                    >
                                        {queryCategory?.data?.data?.map((cat) => (
                                            <Select.Option key={cat._id} value={cat._id}>
                                                {cat.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label={<span style={{ fontWeight: 500 }}>Thương hiệu</span>}
                                    name="brand"
                                    rules={[{ required: true, message: 'Vui lòng chọn thương hiệu!' }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Chọn thương hiệu"
                                        style={{ width: '100%', borderRadius: '6px' }}
                                        value={stateProductDetails.brand}
                                        onChange={handleOnchangeDetailsBrand}
                                    >
                                        {queryBrand?.data?.data?.map((brand) => (
                                            <Select.Option key={brand._id} value={brand._id}>
                                                {brand.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            label={<span style={{ fontWeight: 500 }}>Mô tả sản phẩm</span>}
                            name="description"
                            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                        >
                            <TextArea
                                rows={4}
                                placeholder="Nhập mô tả chi tiết về sản phẩm"
                                style={{ borderRadius: '6px' }}
                                value={stateProductDetails.description}
                                onChange={handleOnchangeDetails}
                                name="description"
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span style={{ fontWeight: 500 }}>Hình ảnh sản phẩm</span>}
                            name="image"
                            rules={[{ required: true, message: 'Vui lòng chọn ảnh!' }]}
                        >
                            <Upload.Dragger
                                maxCount={1}
                                beforeUpload={() => false}
                                onChange={handleOnchangeAvatarDetails}
                                accept="image/*"
                                style={{ 
                                    borderRadius: '6px',
                                    padding: '20px'
                                }}
                            >
                                {stateProductDetails?.image ? (
                                    <img
                                        src={stateProductDetails.image}
                                        alt="product"
                                        style={{
                                            height: '100px',
                                            width: 'auto',
                                            objectFit: 'contain'
                                        }}
                                    />
                                ) : (
                                    <>
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined style={{fontSize: '48px', color: '#40a9ff'}} />
                                        </p>
                                        <p className="ant-upload-text">
                                            Kéo thả hoặc click để tải ảnh lên
                                        </p>
                                    </>
                                )}
                            </Upload.Dragger>
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0 }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: '8px',
                                marginTop: '24px',
                                paddingTop: '16px',
                                borderTop: '1px solid #f0f0f0'
                            }}>
                                <Button onClick={() => setIsOpenDrawer(false)}>
                                    Hủy bỏ
                                </Button>
                                <Button 
                                    type="primary" 
                                    htmlType="submit" 
                                    loading={isLoadingUpdate || isLoadingUpdated}
                                >
                                    Cập nhật
                                </Button>
                            </div>
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
