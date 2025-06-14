import styles from './RegistrationForm.module.css'

import {
    //ConfigProvider,
    Form,
    Input,
    // Select,
} from 'antd';

import {SignButton} from "../SignButton/SignButton.tsx";
import * as React from "react";

// const { Option } = Select;

interface RegistrationFormProps {
    onSub: React.FormEventHandler<HTMLFormElement>;
    isDisabled?: boolean;
    registerUrl?: string;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({registerUrl = "#", onSub, isDisabled = false} : RegistrationFormProps) => {
    const [form] = Form.useForm();

    return (
        <Form
            form={form}
            name="register"
            onFinish={onSub}
            style={{ maxWidth: 600 }}
            scrollToFirstError
        >
            <Form.Item
                name="first name"
                style={{marginBottom: 47}}
                rules={[
                    {
                        required: true,
                        message: 'Please input your first name!',
                        whitespace: true,
                    },
                ]}
            >
                <Input className={styles.input} placeholder="First name"/>
            </Form.Item>

            <Form.Item
                name="last name"
                style={{marginBottom: 47}}
                rules={[
                    {
                        required: true,
                        message: 'Please input your last name!',
                        whitespace: true,
                    },
                ]}
            >
                <Input className={styles.input} placeholder="Last name" />
            </Form.Item>

            <Form.Item
                name="email"
                style={{marginBottom: 47}}
                rules={[
                    {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                    },
                    {
                        required: true,
                        message: 'Please input your E-mail!',
                    },
                ]}
            >
                <Input className={styles.input} placeholder="Email" />
            </Form.Item>

            <Form.Item
                name="password"
                style={{marginBottom: 47}}
                rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                ]}
                hasFeedback
            >
                <Input.Password className={styles.input} placeholder="Password" />
            </Form.Item>

            <Form.Item
                name="confirm"
                dependencies={['password']}
                style={{marginBottom: 35}}
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Please confirm your password!',
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('The new password that you entered do not match!'));
                        },
                    }),
                ]}
            >
                <Input.Password className={styles.input} placeholder="Confirm your password" />
            </Form.Item>

            {/*<Form.Item*/}
            {/*    name="gender"*/}
            {/*    rules={[{ required: true, message: 'Please select gender!' }]}*/}
            {/*>*/}
            {/*    <ConfigProvider*/}
            {/*        select={{className: styles.genderSelect}}*/}
            {/*    >*/}
            {/*        <Select className={styles.genderSelect} placeholder="Gender">*/}
            {/*            <Option value="male">Male</Option>*/}
            {/*            <Option value="female">Female</Option>*/}
            {/*            <Option value="other">Other</Option>*/}
            {/*        </Select>*/}
            {/*    </ConfigProvider>*/}
            {/*</Form.Item>*/}

            <Form.Item
                style={{marginTop:0, marginBottom: 36, textAlign: 'center'}}>
                <p>Already have an account? <a href={registerUrl}>Login</a></p>
            </Form.Item>

            <Form.Item>
                <SignButton isDisabled={isDisabled} title="Sign Up" htmlType="submit" />
            </Form.Item>
        </Form>
    );
};