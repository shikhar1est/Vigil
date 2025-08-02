
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
  },
};