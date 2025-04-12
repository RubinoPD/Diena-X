const Item = require("../models/Item");
const User = require("../models/User");
const emailService = require("./emailService");

// Tikrinti ir siusti priminimus
exports.checkAdnSendReminders = async () => {
  try {
    const today = new Date();
    const items = await Item.find({}).populate({
      path: "backpacks",
      populate: {
        path: "user",
        model: "User",
      },
    });

    for (const item in items) {
      const user = item.backpack.user;
      expiryDate = new Date(item.expiryDate);

      // Skaiciuojame likusi laika iki galiojimo pabaigos
      const timeUntilExpiry = expiryDate - today;
      const daysUntilExpiry = Math.ceil(
        timeUntilExpiry / (1000 * 60 * 60 * 24)
      );

      // Jei jau pasibaiges ir dar neissiustas priminimas
      if (daysUntilExpiry < 0 && !item.reminderSent.expired) {
        await emailService.sendExpiryReminder(user, item, "expired");
        item.reminderSent.expired = true;
        await item.save();
      }

      // Jei liko maziau nei diena ir dar neissiustas priminimas
      else if (daysUntilExpiry <= 1 && !item.reminderSent.day) {
        await emailService.sendExpiryReminder(user, item, "day");
        item.reminderSent.day = true;
        await item.save();
      }

      // Jei liko maziau nei savaite ir dar neissiustas priminimas
      else if (daysUntilExpiry <= 7 && !item.reminderSent.week) {
        await emailService.sendExpiryReminder(user, item, "week");
        item.reminderSent.week = true;
        await item.save();
      }

      // Jei liko maziau nei menuo ir dar neissiustas priminimas
      else if (daysUntilExpiry <= 30 && !item.reminderSent.month) {
        await emailService.sendExpiryReminder(user, item, "month");
        item.reminderSent.month = true;
        await item.save();
      }
    }

    console.log("Priminimai patikrinti ir issiusti");
  } catch (error) {
    console.error("Klaida tikrinant ir issiunciant priminimus:", error);
  }
};

// Nustatyti kasdienini priminimu tikrinima
exports.scheduleReminderChecks = () => {
  // Tikriname kaivkeian diena 8:00 ryto
  const checkTime = new Date();
  checkTime.setHours(8, 0, 0, 0);

  let timeUntilCheck;
  const now = new Date();

  if (now > checkTime) {
    // Jei jau po 8:00, nustatome kita diena
    checkTime.setDate(checkTime.getDate() + 1);
  }

  timeUntilCheck = checkTime - now;

  // Nustatome pirma patikrinima
  setTimeout(() => {
    this.checkAdnSendReminders();

    // Tada nustatome kasdienini patikrinima
    setInterval(this.checkAdnSendReminders, 24 * 60 * 60 * 1000);
  }, timeUntilCheck);

  console.log(
    `Priminimai bus tikrinami kasdien 8:00 ryto. Pirmas patikrinimas po ${Math.round(
      timeUntilCheck / (1000 * 60)
    )} minuciu.`
  );
};
