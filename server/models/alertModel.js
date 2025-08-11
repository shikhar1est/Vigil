import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    // The user who created the alert
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // This creates a reference to the User model
    },
    // The category of the alert
    category: {
      type: String,
      required: true,
      enum: ['Traffic', 'Safety', 'Utility', 'Community'], // Restricts the value to one of these
    },
    // The text description of the alert
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 280,
    },
    // The geographic location of the alert
    location: {
      type: {
        type: String,
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true,
      },
      coordinates: {
        type: [Number], // Array of numbers for [longitude, latitude]
        required: true,
      },
    },
    // An array of users who have confirmed the alert
    confirmations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// This creates a special 2dsphere index for the location field,
// which is essential for performing efficient geospatial queries (e.g., find alerts within 5km).
alertSchema.index({ location: '2dsphere' });

const Alert = mongoose.model('Alert', alertSchema);

export default Alert;