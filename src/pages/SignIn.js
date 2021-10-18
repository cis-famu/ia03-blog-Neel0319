import React, {Component} from 'react';
import {Card, Form, Button, Row, Col} from "react-bootstrap";
import axios from "axios";

class SignIn extends Component {

    constructor(props) {
        super(props);
        this.usernameRef = React.createRef();
        this.passwordRef = React.createRef();
        this.handleSubmit= this.handleSubmit.bind(this);
    }

    async handleSubmit(evt){
        evt.preventDefault();

        const data = {
            username: this.usernameRef.current.value,
            password: this.passwordRef.current.value
        }
        await axios.post("http://localhost:4000/login", data).then((res )=>{
            console.log(res.data.response);
        }).catch(err => console.log(err));
    }

    render() {

        return (
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <h2 className="text-center mb-4">Sign In</h2>
                            <Form onSubmit={this.handleSubmit}>
                                <Form.Group id="username" className="mb-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control type="text" required ref={this.usernameRef} />
                                </Form.Group>
                                <Form.Group id="password" className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" required ref={this.passwordRef} />
                                </Form.Group>

                                <Button className=" w-100" type="submit">Sign In</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

        );
    }
}

export default SignIn;
