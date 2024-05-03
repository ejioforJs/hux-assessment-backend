const Contact = require("../models/Contact")

exports.addContact = async (req, res) => {
    try {
      const { firstName, lastName, phoneNumber } = req.body;
      const newContact = new Contact({
        firstName,
        lastName,
        phoneNumber
      });
      const savedContact = await newContact.save();
      res.json(savedContact);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: `Internal server error`,
      });
    }
  };

  exports.editContact = async (req, res) => {
    try {
      const {id, firstName, lastName, phoneNumber } = req.body;
      const updatedContact = await Contact.findByIdAndUpdate(id, {
        $set: {
          firstName,
          lastName,
          phoneNumber
        }
      }, { new: true });
      res.json(updatedContact);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: `Internal server error`,
      });
    }
  };

  exports.deleteContact = async (req, res) => {
    try {
      const {id} = req.body
      await Contact.findByIdAndDelete(id);
      res.json({
        success: true,
        message: `Contact deleted successfully`,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: `Internal server error`,
      });
    }
  };