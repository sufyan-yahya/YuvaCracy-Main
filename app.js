require("dotenv").config();
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const app = express();
require("./UserDetails");
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const User = mongoose.model("Users");

mongoose
  .connect(
    "", //mongodb connect link here
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("connected to db");
  })
  .catch((e) => {
    console.log("Error: ", e);
  });

app.post("/sign_up", async (req, res) => {
  const { email } = req.body;
  console.log(email);

  try {
    const oldUser = await User.findOne({ email: email });
    if (oldUser) {
      return res.send(
        '<script>alert("Oops, seems like you have already subscribed to yuvacracy"); window.location.href = "/";</script>'
      );
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL, 
        pass: process.env.PASSWORD, 
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Sending Test Email With JS And Nodejs",
      html: "<h1>Congratulations!!! 🎉🎉</h1> <h2> Thank you for subscribing YC </h2><p>We will notify you for upcoming and exiting new events. Stay tuned..</p>",
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error" + error);
      } else {
        console.log("Email sent:" + info.response);
        //res.status(201).json({ status: 201, info });
        return res.send(
          '<script>alert("Thankyou for subscribing Yuvacracy!!"); window.location.href = "/";</script>'
        );
      }
    });

    const createNewUser = await User.create({ email: email });
    console.log(createNewUser);
  } catch (error) {
    console.log("Error" + error);
    // res.status(401).json({ status: 401, error });
    return res.redirect("error.html");
  }
});

app
  .get("/", (req, res) => {
    res.set({
      "Allow-access-Allow-Origin": "*",
    });
    return res.redirect("events.html");
  })
  .listen(3000);

console.log("Listening on PORT 3000");