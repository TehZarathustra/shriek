var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Channel = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String,
    default: "https://pbs.twimg.com/profile_images/585443559878299648/AAroqLFC.jpg"
  },
  is_private: {
    type: Boolean,
    required: true,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  users: {
    type: Array
  }
});

Channel.on('init', function (model) {
  var newChannel = model({
    name: 'General',
    slug: 'general',
    is_private: false,
    users: ['superadmin'] // durty hack
  });

  newChannel.save(newChannel);
});

module.exports = mongoose.model('Channel', Channel);

