const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendPasswordResetEmail = async (email, resetLink, otp) => {
  await transporter.sendMail({
    from: `"Ecobazar" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Ecobazar - Password Reset OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px;">
        <h2 style="color: #16a34a;">Ecobazar</h2>
        <p>Hello,</p>
        <p>We received a request to reset your Ecobazar account password.</p>
        <p>Click the button below to continue:</p>
        <a
          href="${resetLink}"
          style="
            display: inline-block;
            padding: 12px 24px;
            background: #16a34a;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
          "
        >
          Reset Password
        </a>
        <p style="margin-top: 25px;">Your verification OTP is:</p>
        <div
          style="
            font-size: 30px;
            font-weight: bold;
            letter-spacing: 8px;
            background: #f0fdf4;
            padding: 15px;
            text-align: center;
            color: #166534;
          "
        >
          ${otp}
        </div>
        <p>This OTP and reset link will expire in 15 minutes.</p>
        <p>If you did not request this password reset, please ignore this email.</p>
        <p>Regards,<br />Ecobazar Team</p>
      </div>
    `
  });
};

const sendStaffCredentialsEmail = async (email, name, password) => {
  const adminUrl =
    process.env.ADMIN_FRONTEND_URL ||
    process.env.FRONTEND_URL ||
    "http://localhost:5173";
  const loginUrl = `${adminUrl}/login`;

  await transporter.sendMail({
    from: `"Ecobazar" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Ecobazar - Staff Account Created",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px;">
        <h2 style="color: #16a34a;">Welcome to Ecobazar</h2>
        <p>Hello ${name},</p>
        <p>Your Ecobazar staff account has been created by the administrator.</p>
        <div
          style="
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          "
        >
          <p><strong>Login Email:</strong> ${email}</p>
          <p><strong>Temporary Password:</strong> ${password}</p>
          <p><strong>Role:</strong> STAFF</p>
        </div>
        <a
          href="${loginUrl}"
          style="
            display: inline-block;
            padding: 12px 24px;
            background: #16a34a;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
          "
        >
          Login to Ecobazar
        </a>
        <p style="margin-top: 25px;">Please change your password after your first login.</p>
        <p>Regards,<br />Ecobazar Team</p>
      </div>
    `
  });
};

const sendWelcomeCustomerEmail = async (email, name) => {
  try {
    const storeUrl = process.env.USER_FRONTEND_URL || "http://localhost:5174";
    await transporter.sendMail({
      from: `"Ecobazar" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Ecobazar - Your Account is Ready!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px; background: #ffffff;">
          <div style="text-align: center; margin-bottom: 25px;">
            <h1 style="color: #00b207; margin: 0; font-size: 28px;">Ecobazar</h1>
            <p style="color: #6b7280; font-size: 14px; margin-top: 5px;">Fresh & Organic Groceries</p>
          </div>
          <h2 style="color: #111827; font-size: 20px;">Welcome to Ecobazar, ${name}!</h2>
          <p style="color: #4b5563; line-height: 1.6; font-size: 14px;">
            Thank you for registering with Ecobazar. Your account has been created successfully. You can now shop 100% organic fruits, fresh vegetables, dairy, and groceries delivered straight to your door.
          </p>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #166534; font-size: 14px; margin: 0; font-weight: bold;">
              Registered Email: ${email}
            </p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${storeUrl}/shop" style="display: inline-block; padding: 12px 30px; background: #00b207; color: #ffffff; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 14px;">
              Start Shopping Now
            </a>
          </div>
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
            If you did not create this account, please disregard this email.<br />
            © ${new Date().getFullYear()} Ecobazar. All rights reserved.
          </p>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error("Failed to send welcome email:", error.message);
    return false;
  }
};

const sendOrderConfirmationEmail = async (order) => {
  try {
    const toEmail = (order?.customerDetails?.email || "").trim().toLowerCase();
    if (!toEmail) {
      console.warn("No customer email provided for order confirmation:", order?.orderNumber);
      return false;
    }

    const customerName = order?.customerDetails?.name || "Valued Customer";
    const storeUrl = process.env.USER_FRONTEND_URL || "http://localhost:5174";

    const itemsRows = (order.items || [])
      .map(
        (it) => `
        <tr style="border-bottom: 1px solid #f3f4f6;">
          <td style="padding: 10px 0; font-size: 14px; color: #111827;">
            <strong>${it.name}</strong>
            <br />
            <span style="font-size: 12px; color: #6b7280;">Qty: ${it.quantity} ${it.unit || "kg"} × $${Number(it.price).toFixed(2)}</span>
          </td>
          <td style="padding: 10px 0; text-align: right; font-size: 14px; font-weight: bold; color: #111827;">
            $${(Number(it.price) * Number(it.quantity)).toFixed(2)}
          </td>
        </tr>
      `
      )
      .join("");

    const addr = order?.customerDetails?.address || {};
    const addressStr = [addr.street, addr.city, addr.state, addr.zipCode, addr.country]
      .filter(Boolean)
      .join(", ");

    const info = await transporter.sendMail({
      from: `"Ecobazar" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `Order Confirmed: ${order.orderNumber} - Ecobazar`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px; background: #ffffff;">
          <div style="text-align: center; margin-bottom: 25px;">
            <h1 style="color: #00b207; margin: 0; font-size: 28px;">Ecobazar</h1>
            <p style="color: #6b7280; font-size: 14px; margin-top: 5px;">Fresh & Organic Groceries</p>
          </div>

          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 18px; border-radius: 10px; margin-bottom: 25px;">
            <h2 style="color: #166534; font-size: 18px; margin: 0 0 6px 0;">Thank You for Your Order, ${customerName}!</h2>
            <p style="color: #15803d; font-size: 14px; margin: 0;">
              Your order <strong>${order.orderNumber}</strong> has been received and is now being processed.
            </p>
          </div>

          <table style="width: 100%; margin-bottom: 25px; font-size: 13px; color: #4b5563;">
            <tr>
              <td><strong>Order Number:</strong> ${order.orderNumber}</td>
              <td style="text-align: right;"><strong>Date:</strong> ${new Date(order.createdAt || Date.now()).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td><strong>Payment Method:</strong> ${order.paymentMethod}</td>
              <td style="text-align: right;"><strong>Payment Status:</strong> <span style="color: ${order.paymentStatus === "Paid" ? "#16a34a" : "#d97706"}; font-weight: bold;">${order.paymentStatus}</span></td>
            </tr>
            ${order.razorpayPaymentId ? `<tr><td colspan="2"><strong>Razorpay Payment ID:</strong> ${order.razorpayPaymentId}</td></tr>` : ""}
          </table>

          <h3 style="color: #111827; font-size: 16px; border-bottom: 2px solid #00b207; padding-bottom: 8px; margin-bottom: 12px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <div style="border-top: 2px solid #f3f4f6; padding-top: 15px; margin-bottom: 25px;">
            <table style="width: 100%; font-size: 14px; color: #4b5563;">
              <tr>
                <td style="padding: 4px 0;">Subtotal:</td>
                <td style="text-align: right; font-weight: bold; color: #111827;">$${Number(order.subtotal).toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0;">Shipping Fee:</td>
                <td style="text-align: right; font-weight: bold; color: #111827;">$${Number(order.shippingFee).toFixed(2)}</td>
              </tr>
              <tr style="font-size: 18px; color: #111827;">
                <td style="padding: 10px 0; font-weight: bold; border-top: 1px solid #e5e7eb;">Total Amount:</td>
                <td style="text-align: right; font-weight: bold; color: #00b207; border-top: 1px solid #e5e7eb;">$${Number(order.totalAmount).toFixed(2)}</td>
              </tr>
            </table>
          </div>

          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
            <h4 style="margin: 0 0 6px 0; color: #111827; font-size: 14px;">Delivery Address</h4>
            <p style="margin: 0; font-size: 13px; color: #4b5563; line-height: 1.5;">${addressStr || "Address provided during checkout"}</p>
            <p style="margin: 6px 0 0 0; font-size: 13px; color: #4b5563;">Phone: ${order.customerDetails?.phone || "N/A"}</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${storeUrl}/my-orders" style="display: inline-block; padding: 12px 30px; background: #00b207; color: #ffffff; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 14px;">
              View Your Orders
            </a>
          </div>

          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
            Thank you for shopping organic with Ecobazar!<br />
            © ${new Date().getFullYear()} Ecobazar. All rights reserved.
          </p>
        </div>
      `
    });

    console.log(`Order confirmation email sent to ${toEmail}. MessageId:`, info?.messageId);
    return true;
  } catch (error) {
    console.error("Failed to send order confirmation email:", error.message || error);
    return false;
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendStaffCredentialsEmail,
  sendWelcomeCustomerEmail,
  sendOrderConfirmationEmail
};