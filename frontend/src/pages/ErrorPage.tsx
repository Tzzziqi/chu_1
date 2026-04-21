import { Button, Typography } from "antd";
import styled from "styled-components";
import { CloseCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <MainContent>
            <ErrorCard>
                <ErrorIcon/>
                <Title level={ 2 }>Oops, something went wrong!</Title>
                <HomeButton
                    type="primary"
                    onClick={ () => navigate("/") }
                >
                   Go Home
                </HomeButton>
            </ErrorCard>
        </MainContent>
    )
}

export default ErrorPage;

const MainContent = styled.main`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
`;

const ErrorCard = styled.div`
    background: white;
    width: 100%;
    max-width: 1000px;
    height: 500px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const ErrorIcon = styled(CloseCircleOutlined)`
    font-size: 80px;
    color: #5c67f2;
    margin-bottom: 24px;
`;

const HomeButton = styled(Button)`
    && {
        background-color: #5c67f2;
        border-color: #5c67f2;
        height: 40px;
        padding: 0 40px;
        margin-top: 24px;

        &:hover {
            background-color: #4a54d1;
        }
    }
`;