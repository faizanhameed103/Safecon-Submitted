const { default: axios } = require("axios");
const Messages = require("../models/messageModel");
const User = require("../models/userModel");

const MAX_VIOLATIONS = 3;


module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};
/*
module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    console.log(message)
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
      
    });
    console.log(message)
   

    const response = await axios.post('http://localhost:5000/cluster', {
      text: message
    });
    let check=response.data
    // const check = false;
     //let check =false;
    if (check) {
      // get user
      const user = await User.findByIdAndUpdate(to, { $addToSet: { blockedUsers: from } }, {new: true}).exec();
      //console.log('user update: ', user);
      return res.json({
        user,
        block: true,
        msg: "You have been blocked!"
      })
      
      
    } else {
      
      if (data) return res.json({ msg: "Message added successfully." });
      else return res.json({ msg: "Failed to add message to the database" });
    }

  } catch (ex) {
    next(ex);
  }
  
};
*/

  module.exports.addMessage = async (req, res, next) => {
    try {
      const { from, to, message } = req.body;
      console.log(message);
      const data = await Messages.create({
        message: { text: message },
        users: [from, to],
        sender: from,
      });
      console.log(message);

      // Call the API to check for sexual content
      const response = await axios.post('http://localhost:5000/cluster', {
        text: message
      });
      const check = response.data;

      if (check) {
        // If the message contains sexual content, increment violation count for the sender
        const user = await User.findByIdAndUpdate(from, { $inc: { violations: 1 } }, { new: true }).exec();

        // If the user has reached the maximum violations, block them
        if (user.violations >= MAX_VIOLATIONS) {
          const user = await User.findByIdAndUpdate(to, { $addToSet: { blockedUsers: from } }, {new: true}).exec();
      //console.log('user update: ', user);
      return res.json({
        user,
        block: true,
        msg: "You have been blocked!"
      })
        }
        return res.json({
          violation: true,
          msg: "Warning: Sending sexual content is prohibited.",
        });
      } else {        
        if (data) return res.json({ msg: "Message added successfully." });
        else return res.json({ msg: "Failed to add message to the database" });
      }

    } catch (ex) {
      next(ex);
    }
  };