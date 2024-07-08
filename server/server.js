const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri =
  "mongodb+srv://baduguphanendra:ProjectResto@cluster0.tl2lnn7.mongodb.net/addresses?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Restaurant schema and model
const addressSchema = new mongoose.Schema({
  name: String,
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
  },
  jobPosts: {
    cooking: Boolean,
    delivery: Boolean,
    receptionist: Boolean,
  },
});

// Define the schema for job applications including selected restaurant details
const jobApplicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    howLongLooking: {
      type: String,
      required: true,
    },
    contactDetails: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    callAvailability: {
      type: String,
      required: true,
    },
    agreedToPolicy: {
      type: Boolean,
      required: true,
    },
    selectedRestaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    selectedPositions: {
      type: [String], // An array of strings to store multiple positions
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create a model for job applications
const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);

addressSchema.index({ "address.location": "2dsphere" });

const Address = mongoose.model("Address", addressSchema);

// API route to handle form submissions
app.post("/api/restaurantForm", async (req, res) => {
  const { name, street, city, state, zip, jobPosts } = req.body;

  try {
    const address = `${street}, ${city}, ${state} ${zip}`;
    const geocodeResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=AIzaSyAIyY4C-OPivpAncytCELY-fUCk9aJsDWc`
    );

    if (geocodeResponse.data.status !== "OK") {
      return res.status(400).send("Failed to geocode address");
    }

    const location = geocodeResponse.data.results[0].geometry.location;

    const newAddress = new Address({
      name,
      address: {
        street,
        city,
        state,
        zip,
        location: {
          type: "Point",
          coordinates: [location.lng, location.lat],
        },
      },
      jobPosts,
    });
    await newAddress.save();
    res.status(201).send("Address added successfully");
  } catch (error) {
    console.error("Error adding restaurant:", error);
    res.status(500).send("Failed to add address");
  }
});

app.post("/api/submitJobApplication", async (req, res) => {
  const {
    name,
    address,
    howLongLooking,
    contactDetails,
    email,
    callAvailability,
    agreedToPolicy,
    selectedRestaurantId,
    selectedPositions,
  } = req.body;
  console.log("Received selectedPositions:", selectedPositions); // Log selected positions for debugging

  try {
    // Find the selected restaurant by ID
    const restaurant = await Address.findById(selectedRestaurantId);
    if (!restaurant) {
      return res.status(404).send("Selected restaurant not found");
    }

    // Create a new job application instance
    const newJobApplication = new JobApplication({
      name,
      address,
      howLongLooking,
      contactDetails,
      email,
      callAvailability,
      agreedToPolicy,
      selectedRestaurantId: restaurant._id, // Save the restaurant ID
      selectedPositions,
    });

    // Save the job application
    await newJobApplication.save();
    res.status(201).send("Job application submitted successfully");
  } catch (error) {
    console.error("Error submitting job application:", error);
    res.status(500).send("Failed to submit job application");
  }
});


// API endpoint to fetch all job applications
app.get("/api/admin/dashboard", async (req, res) => {
  try {
    const jobApplications = await JobApplication.find();
    res.json(jobApplications);
  } catch (error) {
    console.error("Error fetching job applications:", error);
    res.status(500).json({ message: "Failed to fetch job applications" });
  }
});

// API endpoint to get nearby addresses
app.get("/api/studentSearch", async (req, res) => {
  const { lat, lng, distance } = req.query;
  if (!lat || !lng || !distance) {
    return res.status(400).json({
      message: "lat, lng, and distance query parameters are required",
    });
  }

  const maxDistance = parseFloat(distance) * 1000;

  try {
    const addresses = await Address.find({
      "address.location": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: maxDistance,
        },
      },
    });
    res.json(addresses);
  } catch (err) {
    console.error("Error fetching nearby addresses:", err);
    res.status(500).json({ message: err.message });
  }
});


//SERVER CONFIG

const server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use.`);
    process.exit(1);
  } else {
    throw err;
  }
});



