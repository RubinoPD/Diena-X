const nodemailer = require("nodemailer");

// Sukuriame transpoerter objekta
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Siusti el. laiska
exports.sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("El. laiskas issiustas:", info.messageId);
    return info;
  } catch (error) {
    console.error("Klaida siunciant el. laiska:", error);
    throw error;
  }
};

// Siusti priminima apie galiojimo pabaiga
exports.sendExpiryReminder = async (user, item, timeLeft) => {
  let subject, message;

  switch (timeLeft) {
    case "month":
      subject = `Priminimas: "${item.name}" galiojimas baigsis uz menesio`;
      message = `<p>Sveiki ${user.username}, </p>
            <p>Jusu daikto "${
              item.name
            }" galiojimas baigsis uz menesio (${new Date(
        item.expiryDate
      ).toLocaleDateString()}).</p>
            <p>Nepamirskite patikrinti savo kuprines daiktu!</p>`;
      break;

    case "week":
      subject = `Priminimas: "${item.name}" galiojimas baigsis uz savaites`;
      message = `<p>Sveiki ${user.username}, </p>
            <p>Jusu daikto "${
              item.name
            }" galiojimas baigsis uz savaites (${new Date(
        item.expiryDate
      ).toLocaleDateString()}).</p>
            <p>Nepamirskite patikrinti savo kuprines daiktu!</p>`;
      break;

    case "day":
      subject = `Priminimas: "${item.name}" galiojimas baigsis rytoj`;
      message = `<p>Sveiki ${user.username}, </p>
            <p>Jusu daikto "${item.name}" galiojimas baigsis rytoj (${new Date(
        item.expiryDate
      ).toLocaleDateString()}).</p>
            <p>Nepamirskite patikrinti savo kuprines daiktu!</p>`;
      break;

    case "expired":
      subject = `Demesio: "${item.name}" galiojimas jau pasibaige`;
      message = `<p>Sveiki ${user.username}, </p>
            <p>Jusu daikto "${item.name}" galiojimas jau pasibaige (${new Date(
        item.expiryDate
      ).toLocaleDateString()}).</p>
            <p>Rekomenduojame peržiūrėti savo kuprinės turinį ir atnaujinti atsargas.</p>`;
      break;
    default:
      subject = `Priminimas apie daikta "${item.name}"`;
      message = `<p>Sveiki ${user.username},</p>
        <p>Nepamirskite patikrinti savo kuprines daiktu!</p>`;
  }

  return this.sendEmail(user.email, subject, message);
};
