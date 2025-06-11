import styles from './LoginForm.module.css'
import { Form, Input } from 'antd';
import {SignButton} from "../SignButton/SignButton.tsx";

interface LoginFormProps {
    onSub: React.FormEventHandler<HTMLFormElement>;
    isDisabled?: boolean;
    registerUrl?: string;
}


export const LoginForm : React.FC<LoginFormProps> = ({isDisabled = false, onSub, registerUrl = "#"} : LoginFormProps) => {
    const onFinishFailed = () => {
        console.error("Form submission failed");
    }
    return (
        <Form
            name="login"
            initialValues={{remember: true}}
            style={{justifyContent: "center", maxWidth: 424, width: '100%', margin: '0 auto'}}
            onFinish={onSub}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item
                style={{marginBottom: 47}}
                name="username"
                rules={[{required: true, message: 'Please input your Username!'}]}
            >
                <Input className={styles.loginInput} placeholder="Username"/>
            </Form.Item>
            <Form.Item
                style={{marginBottom: 37}}
                name="password"
                rules={[{required: true, message: 'Please input your Password!'}]}
            >
                <Input className={styles.loginInput} type="password" placeholder="Password"/>
            </Form.Item>
            
            <SignButton htmlType={"submit"} isDisabled={isDisabled} title={"Continue"} ></SignButton>

            <Form.Item
            style={{marginTop:10, marginBottom: 0, textAlign: 'center'}}>
                <p>Or <a href={registerUrl}>Register now!</a></p>
            </Form.Item>
                
        </Form>
    );
}