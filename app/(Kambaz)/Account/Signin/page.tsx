import Link from "next/link";
import { Form, Button } from "react-bootstrap";

export default function Signin() {
    return (
        <div id="wd-signin-screen" className="p-4">
            <h1 className="mb-4">Sign in</h1>
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
                <Link href="/Dashboard" id="wd-signin-btn" className="btn btn-primary w-100 mb-2">
                    Sign in
                </Link>
                <Link href="Signup" id="wd-signup-link" className="d-block text-center text-decoration-none">
                    Sign up
                </Link>
            </Form>
        </div>
    );
}