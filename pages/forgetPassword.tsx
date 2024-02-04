import { Hono } from "hono";
import type { FC } from "hono/jsx";

const app = new Hono();

const Layout: FC = (props) => {
    return (
        <html>
            <head>
                <title>{props.title}</title>
            </head>
            <body>
                {props.children}
            </body>
        </html>
    );
};
type messages = {messages: string[]};
const Top: FC<messages> = (props: messages) => {
    return (
        <Layout>
            <h1>test</h1>
            <ul>
                {props.messages.map((m) => (
                    <li>{m}</li>
                ))}
            </ul>
        </Layout>
    );
};

export default Top;