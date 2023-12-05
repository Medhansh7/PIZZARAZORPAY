import axios from "axios";
import useRazorpay from "react-razorpay";

import {
  Container,
  Row,
  Col,
  Card,
  ButtonGroup,
  ToggleButton,
  Badge,
  Button,
  Modal,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import OrderCard from "./components/OrderCard";

function App() {
  const [Razorpay] = useRazorpay();

  const [sucessTranscation, setSucessTranscation] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [radioValue, setRadioValue] = useState("DELIVERY");
  const [total, setTotal] = useState(0);

  const [pizzaData, setPizzaData] = useState([]);

  const dummyData = [
    {
      category: "Pizza",
      id: 1,
      name: "Vesuvius",
      price: 79,
      rank: 3,
      topping: (3)[("Tomat", "Ost", "Skinka")],
    },
    {
      category: "Pizza",
      id: 2,
      name: "Margarita A",
      price: 100,
      rank: 3,
      topping: (3)[("Tomat", "Ost", "Skinka")],
    },
    {
      category: "Pizza",
      id: 3,
      name: "Margarita B",
      price: 105,
      rank: 3,
      topping: (3)[("Tomat", "Ost", "Skinka")],
    },
  ];

  const radios = [
    { name: "DELIVERY", value: "DELIVERY" },
    { name: "PICK-UP", value: "PICK-UP" },
  ];

  useEffect(() => {
    axios
      .get(
        "https://private-anon-d48191547a-pizzaapp.apiary-mock.com/restaurants/restaurantId/menu?category=Pizza&orderBy=rank"
      )
      .then((res) => {
        if (res?.status === 200 && res?.data?.length) {
          setPizzaData(res?.data);
        }
      })
      .catch((err) => {
        setPizzaData(dummyData);
        alert("An error occured while fetching the pizzaData!");
      });
  }, []);

  useEffect(() => {
    if (pizzaData?.length) {
      let total = 0;
      pizzaData?.map((e) =>
        e?.category === "Pizza" ? (total = total + e?.price * e?.id) : null
      );
      setTotal(total);
    }
  }, [pizzaData]);

  const createOrder = async () => {
    let responseData = await axios.post("http://localhost:3001/order", {
      amount: (total + 46.15 + 46.15 - 20) * 100,
    });

    if (responseData?.status === 200) {
      handlePayment(responseData?.data?.id, responseData?.data?.amount);
    }
  };

  const handlePayment = (orderID, amount) => {
    const options = {
      key: "rzp_test_OhHe0QHOgBvQHV",
      amount: amount,
      currency: "INR",
      name: "TSX PIZZERIAS",
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: orderID,
      handler: (res) => {
        if (res?.razorpay_order_id) {
          setSucessTranscation(res.razorpay_order_id);
          setShowPopup(true);
        }
      },
      prefill: {
        name: "User Name",
        email: "useremail@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Pizza By Medhansh",
      },
      theme: {
        color: "#3399cc",
      },
    };
    const rzpay = new Razorpay(options);
    rzpay.open();
  };

  return (
    <Card>
      <Modal show={showPopup} onHide={() => setShowPopup(false)}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <Card.Text>
            Order has been placed successfully. <br /> Confirmation message
            sent!
          </Card.Text>
          <br />
          <Card.Subtitle>Order Id : {sucessTranscation}</Card.Subtitle>
          <br />
          <Card.Subtitle>Total : ₹1058.65</Card.Subtitle>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPopup(false)}>
            Back
          </Button>
        </Modal.Footer>
      </Modal>
      <Container>
        <Row>
          <Container>
            <Card className="shadow p-3 mt-5 bg-white rounded mx-3">
              <Card.Body className="text-center">
                <Card.Title>TSX PIZZERIAS</Card.Title>
                <ButtonGroup className="my-3 w-100">
                  {radios.map((radio, idx) => (
                    <ToggleButton
                      key={idx}
                      id={`radio-${idx}`}
                      type="radio"
                      variant={"outline-dark"}
                      name="radio"
                      value={radio.value}
                      checked={radioValue === radio.value}
                      onChange={(e) => setRadioValue(e.currentTarget.value)}
                    >
                      {radio.name}
                    </ToggleButton>
                  ))}
                </ButtonGroup>
                <Row className="my-3">
                  <Col>
                    <Card.Text>25 mins</Card.Text>
                  </Col>
                  <Col>
                    <Card.Text>₹ 20</Card.Text>
                  </Col>
                  <Col>
                    <Card.Text>Discounts</Card.Text>
                  </Col>
                </Row>
                <Row className="text-center mt-3">
                  <Card.Subtitle>
                    Menu Hours: 10:00 AM to 11:00 PM
                  </Card.Subtitle>
                </Row>
              </Card.Body>
            </Card>
          </Container>
        </Row>
        <Row className="mt-3">
          <Col>
            <Card.Title>Your Order</Card.Title>
          </Col>
          <Col className="d-flex align-items-center justify-content-end">
            <Card.Title style={{ color: "red" }}>+ Add Items</Card.Title>
          </Col>
        </Row>
        {pizzaData?.map(
          (pizza) => pizza?.category === "Pizza" && <OrderCard data={pizza} />
        )}

        <Row className="mt-5">
          <Col md={3} sm={3} xs={5}>
            <h4 className="border  border-3 border-top-0 border-end-0 border-start-0  border-danger">
              Summary
            </h4>
          </Col>
        </Row>
        <Row className="my-3">
          <Col>
            <Row>
              <Col className="mx-3 d-flex flex-column justify-content-start">
                <p className="text-mute">Subtotal</p>
              </Col>
            </Row>
          </Col>
          <Col className="d-flex justify-content-end">
            <Card.Subtitle>₹ {total}</Card.Subtitle>
          </Col>
          <hr />
        </Row>

        <Row className="my-3">
          <Col>
            <Row>
              <Col className="mx-3 d-flex flex-column justify-content-start">
                <p className="text-mute">Discount</p>
              </Col>
            </Row>
          </Col>
          <Col className="d-flex justify-content-end">
            <Card.Subtitle className="text-primary">-₹20.00</Card.Subtitle>
          </Col>
          <hr />
        </Row>
        <Row className="my-3">
          <Col>
            <Row>
              <Col className="mx-3 d-flex flex-column justify-content-start">
                <p className="text-mute">Delivery Fee</p>
              </Col>
            </Row>
          </Col>
          <Col className="d-flex justify-content-end">
            <Card.Subtitle>₹46.15</Card.Subtitle>
          </Col>
          <hr />
        </Row>
        <Row className="my-3">
          <Col>
            <Row>
              <Col className="mx-3 d-flex flex-column justify-content-start">
                <p className="text-mute">Taxes</p>
              </Col>
            </Row>
          </Col>
          <Col className="d-flex justify-content-end">
            <Card.Subtitle>₹46.15</Card.Subtitle>
          </Col>
          <hr />
        </Row>
        <Row className="my-3">
          <Col>
            <Row>
              <Col className="mx-3 d-flex flex-column justify-content-start">
                <Card.Title>Total</Card.Title>
              </Col>
            </Row>
          </Col>
          <Col className="d-flex justify-content-end">
            <Card.Title>₹{total + 46.15 + 46.15 - 20}</Card.Title>
          </Col>
        </Row>
        <Button
          variant="dark"
          onClick={() => createOrder()}
          className="mb-3 w-100"
        >
          PLACE ORDER
        </Button>
      </Container>
    </Card>
  );
}

export default App;
