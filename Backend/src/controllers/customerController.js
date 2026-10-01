const bcrypt = require("bcrypt");
const Customer = require("../models/customer");
const Order = require("../models/order");
const { sendWelcomeCustomerEmail } = require("../services/emailService");

const checkUserExists = async (req, res) => {
  try {
    const email = req.query.email || req.body?.email;
    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email address is required to check user"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const customer = await Customer.findOne({ email: normalizedEmail });

    if (customer && customer.password) {
      return res.status(200).json({
        success: true,
        exists: true,
        hasPassword: true,
        message: "User already exists with this email. Please sign in.",
        customer: {
          _id: customer._id,
          name: customer.name,
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone
        }
      });
    }

    return res.status(200).json({
      success: true,
      exists: false,
      hasPassword: false,
      message: "User does not exist or has not set a password yet."
    });
  } catch (error) {
    console.error("checkUserExists error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to check user existence"
    });
  }
};

const registerCustomer = async (req, res) => {
  try {
    const { name, firstName, lastName, email, phone, password, address, company } = req.body;

    const fullName = (name || `${firstName || ""} ${lastName || ""}`).trim();
    if (!fullName) {
      return res.status(400).json({
        success: false,
        message: "Full name is required"
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email address is required"
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address"
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingCustomer = await Customer.findOne({ email: normalizedEmail });

    const hashedPassword = await bcrypt.hash(password, 10);
    const parts = fullName.split(" ");
    const fName = (firstName && firstName.trim()) || parts[0] || fullName;
    const lName = (lastName && lastName.trim()) || parts.slice(1).join(" ") || "";

    if (existingCustomer) {
      if (existingCustomer.password) {
        return res.status(400).json({
          success: false,
          exists: true,
          hasPassword: true,
          message: "User already exists with this email. Please sign in."
        });
      }

      existingCustomer.name = fullName;
      existingCustomer.firstName = fName;
      existingCustomer.lastName = lName;
      if (phone) existingCustomer.phone = phone.trim();
      if (company) existingCustomer.company = company.trim();
      if (address) existingCustomer.address = address;
      existingCustomer.password = hashedPassword;
      existingCustomer.status = "ACTIVE";
      const updatedCustomer = await existingCustomer.save();

      try {
        sendWelcomeCustomerEmail(normalizedEmail, fullName).catch(() => {});
      } catch (_) {}

      return res.status(201).json({
        success: true,
        exists: false,
        message: "Account registered successfully in MongoDB!",
        customer: {
          _id: updatedCustomer._id,
          name: updatedCustomer.name,
          firstName: updatedCustomer.firstName,
          lastName: updatedCustomer.lastName,
          email: updatedCustomer.email,
          phone: updatedCustomer.phone,
          company: updatedCustomer.company,
          address: updatedCustomer.address,
          totalOrders: updatedCustomer.totalOrders || 0,
          totalSpent: updatedCustomer.totalSpent || 0
        }
      });
    }

    const newCustomer = await Customer.create({
      name: fullName,
      firstName: fName,
      lastName: lName,
      email: normalizedEmail,
      phone: phone ? phone.trim() : "",
      password: hashedPassword,
      company: company ? company.trim() : "",
      address: address || {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States"
      },
      status: "ACTIVE"
    });

    try {
      sendWelcomeCustomerEmail(normalizedEmail, fullName).catch(() => {});
    } catch (_) {}

    return res.status(201).json({
      success: true,
      exists: false,
      message: "Account registered successfully in MongoDB!",
      customer: {
        _id: newCustomer._id,
        name: newCustomer.name,
        firstName: newCustomer.firstName,
        lastName: newCustomer.lastName,
        email: newCustomer.email,
        phone: newCustomer.phone,
        company: newCustomer.company,
        address: newCustomer.address,
        totalOrders: 0,
        totalSpent: 0
      }
    });
  } catch (error) {
    console.error("registerCustomer error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to register account"
    });
  }
};

const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const customer = await Customer.findOne({ email: normalizedEmail });

    if (!customer) {
      return res.status(404).json({
        success: false,
        exists: false,
        message: "User does not exist with this email. Please sign up first."
      });
    }

    if (!customer.password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      customer.password = hashedPassword;
      await customer.save();
    } else {
      const isMatch = await bcrypt.compare(password, customer.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Incorrect password. Please verify and try again."
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Signed in successfully!",
      customer: {
        _id: customer._id,
        name: customer.name,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        company: customer.company,
        address: customer.address,
        totalOrders: customer.totalOrders || 0,
        totalSpent: customer.totalSpent || 0
      }
    });
  } catch (error) {
    console.error("loginCustomer error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to sign in"
    });
  }
};

const createOrGetCustomer = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      street,
      city,
      state,
      zipCode,
      country,
      orderNotes
    } = req.body;

    if (!firstName || !firstName.trim()) {
      return res.status(400).json({ message: "First name is required" });
    }

    if (!lastName || !lastName.trim()) {
      return res.status(400).json({ message: "Last name is required" });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email address is required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    if (!street || !street.trim()) {
      return res.status(400).json({ message: "Street address is required" });
    }

    if (!city || !city.trim()) {
      return res.status(400).json({ message: "City is required" });
    }

    if (!state || !state.trim()) {
      return res.status(400).json({ message: "State / Province is required" });
    }

    if (!zipCode || !zipCode.trim()) {
      return res.status(400).json({ message: "Zip / Postal code is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let customer = await Customer.findOne({ email: normalizedEmail });

    const addressData = {
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      zipCode: zipCode.trim(),
      country: (country && country.trim()) || "United States"
    };

    if (customer) {
      customer.firstName = firstName.trim();
      customer.lastName = lastName.trim();
      customer.name = `${firstName.trim()} ${lastName.trim()}`;
      customer.phone = phone.trim();
      if (company !== undefined) customer.company = company.trim();
      customer.address = addressData;
      if (orderNotes !== undefined) customer.orderNotes = orderNotes.trim();
      await customer.save();
    } else {
      customer = await Customer.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: normalizedEmail,
        phone: phone.trim(),
        company: company ? company.trim() : "",
        address: addressData,
        orderNotes: orderNotes ? orderNotes.trim() : "",
        status: "ACTIVE"
      });
      try {
        sendWelcomeCustomerEmail(normalizedEmail, customer.name).catch(() => {});
      } catch (_) {}
    }

    return res.status(200).json({
      success: true,
      message: "Customer verified and saved successfully in MongoDB",
      customer
    });
  } catch (error) {
    console.error("createOrGetCustomer error:", error);
    return res.status(500).json({
      message: error.message || "Failed to process customer information"
    });
  }
};

const getCustomers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query = {
        $or: [
          { name: searchRegex },
          { firstName: searchRegex },
          { lastName: searchRegex },
          { email: searchRegex },
          { phone: searchRegex },
          { company: searchRegex },
          { "address.city": searchRegex },
          { "address.state": searchRegex },
          { "address.country": searchRegex }
        ]
      };
    }

    const customers = await Customer.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: customers.length,
      customers
    });
  } catch (error) {
    console.error("getCustomers error:", error);
    return res.status(500).json({
      message: "Failed to fetch customers from database"
    });
  }
};

const {
  getCustomerById,
  deleteCustomer,
  getCurrentProfile,
  updateCustomerProfile,
  updateCustomerBillingAddress,
  changeCustomerPassword,
  uploadProfileImage
} = require("./customerProfileController");

module.exports = {
  checkUserExists,
  registerCustomer,
  loginCustomer,
  createOrGetCustomer,
  getCustomers,
  getCustomerById,
  deleteCustomer,
  getCurrentProfile,
  updateCustomerProfile,
  updateCustomerBillingAddress,
  changeCustomerPassword,
  uploadProfileImage
};
