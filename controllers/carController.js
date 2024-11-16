const Car = require("../model/Car");
const upload = require("../middlewares/fileUpload");

// Add a car (with up to 10 images)
const addCar = [
  upload.array("images", 10),
  async (req, res) => {
    try {
      const { title, description, tags } = req.body;
      const images = req.files.map((file) => file.filename); // Get file paths from the uploaded images

      const car = new Car({
        title,
        description,
        tags: tags.split(","), // Convert comma-separated tags to an array
        images,
        user: req.user._id,
      });

      await car.save();
      res.status(201).json(car);
    } catch (error) {
      console.log(error.message);

      res.status(500).json({ message: "Error adding car", error });
    }
  },
];

// View all cars (for the current user)
const viewCars = async (req, res) => {
  try {
    const cars = await Car.find({ user: req.user._id }); // Only show cars owned by the user

    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cars", error });
  }
};

// Update a car's details (title, description, tags, or images)
const updateCar = [
  upload.array("images", 10),
  async (req, res) => {
    const { id } = req.params;
    const { title, description, tags } = req.body;
    const images = req.files?.map((file) => file.filename);
    let _id = id;
    try {
      const car = await Car.findByIdAndUpdate(
        _id,
        {
          title,
          description,
          tags: tags,
          images: images.length > 0 ? images : undefined,
        },
        { new: true }
      );

      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }

      res.status(200).json({message:car});
    } catch (error) {
      console.log(error.message);

      res.status(500).json({ message: "Error updating car", error });
    }
  },
];
const getSingleCar = async (req, res) => {
  const { id } = req.params;
  try {
    const car = await Car.findOne({ _id: id });

    if (!car) {
      return res.status(404).json({ data: "Car not found" });
    }

    res.status(200).json({ message: car });
  } catch (error) {
    res.status(500).json({ message: "Error deleting car", error });
  }
};
// Delete a car
const deleteCar = async (req, res) => {
  const { id } = req.params;
  try {
    const car = await Car.findByIdAndDelete({ _id: id });

    if (!car) {
      return res.status(404).json({ data: car });
    }

    res.status(200).json({ message: car });
  } catch (error) {
    res.status(500).json({ message: "Error deleting car", error });
  }
};

module.exports = { addCar, deleteCar, updateCar, viewCars, getSingleCar };
