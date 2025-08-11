
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const resolvers = {
  Query: {
    hello: () => 'The server is working!',
  },
  Mutation: {
    registerUser: async (_, { name, email, password }) => {
      const userExists = await User.findOne({ email });

      if (userExists) {
        throw new GraphQLError('User already exists with that email.', {
          extensions: { code: 'USER_EXISTS' },
        });
      }
      const user = await User.create({
        name,
        email,
        password,
      });

      if (user) {
        const token = createToken(user._id);

        return {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
          },
        };
      } else {
        throw new GraphQLError('Invalid user data.', {
          extensions: { code: 'INVALID_USER_DATA' },
        });
      }
    },

    // Add the new login resolver below
    login: async (_, { email, password }) => {
      // 1. Find the user by email
      const user = await User.findOne({ email });

      // 2. Check if user exists and if passwords match
      if (user && (await user.matchPassword(password))) {
        // 3. Create a new token
        const token = createToken(user._id);

        // 4. Return the token and user data
        return {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
          },
        };
      } else {
        // 5. If login fails, throw an error
        throw new GraphQLError('Invalid email or password.', {
          extensions: { code: 'INVALID_CREDENTIALS' },
        });
      }
    },

createAlert: async (_, { category, description, location }, context) => {
      // 1. Get the authenticated user from the context
      const user = context.user;

      // 2. Check if the user is logged in
      if (!user) {
        throw new GraphQLError('You must be logged in to create an alert.', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      // 3. Create the new alert document
      const newAlert = new Alert({
        category,
        description,
        user: user.id, // Link the alert to the logged-in user
        location: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude],
        },
      });

      // 4. Save the alert to the database
      await newAlert.save();

      // 5. Populate the user field and return the new alert
      return newAlert.populate('user');
    },
  },
};