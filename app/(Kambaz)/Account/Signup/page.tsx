import Link from "next/link";
import { Form, Button } from "react-bootstrap";

export default function Signup() {
    return (
        <div id="wd-signup-screen" className="p-4">
            <h1 className="mb-4">Sign up</h1>
            <Form>
                <Form.Control
                    id="wd-username"
                    placeholder="username"
                    className="mb-2"
                />
                <Form.Control
                    id="wd-password"
                    placeholder="password"
                    type="password"
                    className="mb-2"
                />
                <Form.Control
                    id="wd-password-verify"
                    placeholder="verify password"
                    type="password"
                    className="mb-2"
                />
                <Link href="Profile" className="btn btn-primary w-100 mb-2">
                    Sign up
                </Link>
                <Link href="Signin" className="d-block text-center text-decoration-none">
                    Sign in
                </Link>
            </Form>
        </div>
    );
}