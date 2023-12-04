const express = require("express");
const Razorpay = require("razorpay");
const path = require("path");
const cors = require("cors");
const crypto = require("crypto");

const app = express();

app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
  key_id: "rzp_test_OhHe0QHOgBvQHV",
  key_secret: "gWj34O0T8UGRfWRZ0LQqfegl",
});

app.post("/order", async (req, res) => {
  console.log(req.body.data);
  let options = {
    amount: req.body.amount,
    currency: "INR",
    receipt: "Created By Medhansh",
  };
  razorpay.orders.create(options, function (err, order) {
    console.log(order, err);
    if (err) {
      res.json(err);
    } else {
      res.json(order);
    }
  });
});

app.listen(3001, () => console.log("Running on port 3001"));
