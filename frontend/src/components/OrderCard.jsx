import React from "react";
import { Badge, Card, Col, Row } from "react-bootstrap";

export default function OrderCard({ data }) {
  console.log(data);
  return (
    <Row key={data?.id} className="my-3">
      <Col>
        <Row>
          <Col md={1} xs={1} sm={1}>
            <Badge bg="danger">{data?.id}</Badge>
          </Col>
          <Col className="mx-3 d-flex flex-column justify-content-start">
            <h6>
              <em>{data?.name}</em>
            </h6>
            <Card.Text className="text-muted">
              {data?.topping?.map((e) => `${e}, `)}
            </Card.Text>
          </Col>
        </Row>
      </Col>
      <Col className="d-flex justify-content-end">
        <Card.Subtitle>₹ {data?.id * data?.price}</Card.Subtitle>
      </Col>
    </Row>
  );
}
