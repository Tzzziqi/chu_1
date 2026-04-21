import type { AppDispatch } from "../../store";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { getCartWithPromo } from "../../store/slices/cartSlice";
import { Button, Input, Typography } from "antd";
import styled from "styled-components";

const { Text } = Typography;

const PromoCodeInput = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [promoCode, setPromoCode] = useState('');

    const handleApply = async () => {
        await dispatch(getCartWithPromo(promoCode));
    }

    return (
        <Container>
            <PromoLabel type="secondary">
                Promo Code
            </PromoLabel>
            <InputContainer>
                <InputBox placeholder="20 DOLLAR OFF" value={ promoCode }
                       onChange={ (e) => setPromoCode(e.target.value) }/>
                <ApplyButton
                    type="primary"
                    onClick={ handleApply }
                >
                    Apply
                </ApplyButton>
            </InputContainer>
        </Container>
    )
};

export default PromoCodeInput;

const Container = styled.div`
    margin-bottom: 24px;
`;

const PromoLabel = styled(Text)`
    && {
        front-size: 13px;
        display: block;
        margin-bottom: 8px;
        color: #8c8c8c;
    }
`;

const InputContainer = styled.div`
    display: flex;
    gap: 8px;
`;

const InputBox = styled(Input)`
    && {
        height: 42px;
    }
`;

const ApplyButton = styled(Button)`
    && {
        height: 42px;
        padding: 0 25px;
        background-color: #5c67f2;
    }
`;