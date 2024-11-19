import {
    WapperA,
    WapperBox,
    WapperBox2,
    WapperColl2,
    WapperColl3,
    WapperContainer,
    WapperDesc,
    WapperImage,
    WapperLi,
    Wapperol,
    Wapperol2,
    WapperRow,
    WapperRow2,
    WapperSubport,
    WapperTit,
    WapperTitle,
    WapperTop,
    WapperUl,
    WrapperFooter,
    WrapperH5,
    WrapperImage,
} from './style';
import image from '../../accsets/image/icon_html1.png';
import image1 from '../../accsets/image/icon_html2.png';
import image2 from '../../accsets/image/icon_html3.png';
import image3 from '../../accsets/image/icon_html4.png';
import imgFb from '../../accsets/image/icon_facebook.png';
import imgZalo from '../../accsets/image/icon_zalo.png';
import imgIns from '../../accsets/image/icon_instagram.png';
import imgYT from '../../accsets/image/icon_youtube.png';
const FooterComponent = () => {
    return (
        <div
            style={{
                width: '100%',
                display: 'flex',
            }}
        >
            <WrapperFooter>
                <WapperContainer>
                    <WapperBox>
                        <WapperRow>
                            <Wapperol>
                                <WapperBox2>
                                    <WapperA href="#">
                                        <WapperImage>
                                            <img style={{ margin: '13px 10px' }} src={image} alt="tt"></img>
                                        </WapperImage>
                                        <WapperTitle>
                                            <WapperTit>Trả góp</WapperTit>
                                            <WapperDesc>Mua hàng lãi suất 0%</WapperDesc>
                                        </WapperTitle>
                                    </WapperA>
                                </WapperBox2>
                            </Wapperol>
                            <Wapperol>
                                <WapperBox2>
                                    <WapperA href="#">
                                        <WapperImage>
                                            <img style={{ margin: '13px 10px' }} src={image1} alt="oto"></img>
                                        </WapperImage>
                                        <WapperTitle>
                                            <WapperTit>Vận chuyển</WapperTit>
                                            <WapperDesc>Chuyên nghiệp - tốc độ</WapperDesc>
                                        </WapperTitle>
                                    </WapperA>
                                </WapperBox2>
                            </Wapperol>
                            <Wapperol>
                                <WapperBox2>
                                    <WapperA href="#">
                                        <WapperImage>
                                            <img style={{ margin: '13px 10px' }} src={image2} alt="bh"></img>
                                        </WapperImage>
                                        <WapperTitle>
                                            <WapperTit>Bảo hành</WapperTit>
                                            <WapperDesc>Hiệu quả - chất lượng </WapperDesc>
                                        </WapperTitle>
                                    </WapperA>
                                </WapperBox2>
                            </Wapperol>
                            <Wapperol>
                                <WapperBox2>
                                    <WapperA href="#">
                                        <WapperImage>
                                            <img style={{ margin: '13px 10px' }} src={image3} alt="dl"></img>
                                        </WapperImage>
                                        <WapperTitle>
                                            <WapperTit>Đại lí</WapperTit>
                                            <WapperDesc>Rộng khắp Việt Nam</WapperDesc>
                                        </WapperTitle>
                                    </WapperA>
                                </WapperBox2>
                            </Wapperol>
                        </WapperRow>
                    </WapperBox>
                    <WapperTop>
                        <WapperRow2>
                            <Wapperol2>
                                <WapperColl2>
                                    <WapperColl3>
                                        <WrapperH5>Kết nối với chúng tôi</WrapperH5>
                                        <WapperSubport>
                                            <WapperUl style={{ display: 'flex' }}>
                                                <WapperLi style={{ marginRight: '8px' }}>
                                                    <WrapperImage alt="fb" src={imgFb}></WrapperImage>
                                                </WapperLi>
                                                <WapperLi style={{ marginRight: '8px' }}>
                                                    <WrapperImage alt="zalo" src={imgZalo}></WrapperImage>
                                                </WapperLi>
                                                <WapperLi style={{ marginRight: '8px' }}>
                                                    <WrapperImage alt="Inst" src={imgIns}></WrapperImage>
                                                </WapperLi>
                                                <WapperLi style={{ marginRight: '8px' }}>
                                                    <WrapperImage alt="Yt" src={imgYT}></WrapperImage>
                                                </WapperLi>
                                            </WapperUl>
                                        </WapperSubport>
                                    </WapperColl3>
                                </WapperColl2>
                                <WapperColl2>
                                    <WapperColl3>
                                        <WrapperH5>Hỗ trợ khách hàng</WrapperH5>
                                        <WapperSubport>
                                            <WapperUl>
                                                <WapperLi>
                                                    Gọi mua hàng:<br></br>
                                                    <WapperA href="#">0903.637.689 </WapperA>
                                                    <br></br>
                                                    <WapperA href="#">0903.637.689 </WapperA>
                                                </WapperLi>
                                                <WapperLi>
                                                    Gọi mua hàng:<br></br>
                                                    <WapperA href="#">0903.637.689 </WapperA>
                                                    <br></br>
                                                    <WapperA href="#">0903.637.689 </WapperA>
                                                </WapperLi>
                                                <WapperLi>Thời gian phục vụ : 8h-22h</WapperLi>
                                            </WapperUl>
                                        </WapperSubport>
                                    </WapperColl3>
                                </WapperColl2>
                                <WapperColl2>
                                    <WapperColl3>
                                        <WrapperH5>Về chúng tôi</WrapperH5>
                                        <WapperSubport>
                                            <WapperUl>
                                                <WapperLi>Giới thiệu công ty</WapperLi>
                                                <WapperLi>Điều khoản sử dụng</WapperLi>
                                                <WapperLi>Hệ thống cửa hàng</WapperLi>
                                                <WapperLi>Liên hệ - Góp ý</WapperLi>
                                            </WapperUl>
                                        </WapperSubport>
                                    </WapperColl3>
                                </WapperColl2>
                                <WapperColl2>
                                    <WapperColl3>
                                        <WrapperH5>Hệ thống website</WrapperH5>
                                        <WapperSubport>
                                            <WapperUl>
                                                <WapperLi>Hướng dẫn mua hàng</WapperLi>
                                                <WapperLi>Chính sách bảo hành</WapperLi>
                                                <WapperLi>Chính sách đổi trả</WapperLi>
                                                <WapperLi>Quy định Giao hàng</WapperLi>
                                            </WapperUl>
                                        </WapperSubport>
                                    </WapperColl3>
                                </WapperColl2>
                            </Wapperol2>
                        </WapperRow2>
                    </WapperTop>
                </WapperContainer>
            </WrapperFooter>
        </div>
    );
};

export default FooterComponent;
