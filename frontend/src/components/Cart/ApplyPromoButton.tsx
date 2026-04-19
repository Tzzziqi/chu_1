import type { AppDispatch } from "../../store";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { getCartWithPromo } from "../../store/slices/cartSlice";
import { Button, Input, Typography } from "antd";

const { Text } = Typography;

const PromoCodeInput = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [promoCode, setPromoCode] = useState('');

    const handleApply = async () => {
        await dispatch(getCartWithPromo(promoCode));
    }

    return (
        <div style={ { marginBottom: '24px' } }>
            <Text type="secondary"
                  style={ { fontSize: '13px', display: 'block', marginBottom: '8px', color: '#8c8c8c' } }>
                Promo Code
            </Text>
            <div style={ { display: 'flex', gap: '8px' } }>
                <Input placeholder="20 DOLLAR OFF" style={ { height: '42px' } } value={ promoCode }
                       onChange={ (e) => setPromoCode(e.target.value) }/>
                <Button
                    type="primary"
                    onClick={ handleApply }
                    style={ { height: '42px', padding: '0 25px', backgroundColor: '#5c67f2' } }
                >
                    Apply
                </Button>
            </div>
        </div>
    )
};

export default PromoCodeInput;