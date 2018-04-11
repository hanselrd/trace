import {
  Resolver,
  Root,
  Ctx,
  Authorized,
  FieldResolver,
  Query,
  Mutation,
  Subscription
} from 'type-graphql';
import { LoginError, SignupError, UniqueKeyError } from '../../errors';
import { Message, Role, User } from '../../models';

@Resolver(objectType => User)
export default class UserResolver {
  @FieldResolver()
  role(@Root() user: User) {
    return user.role || Role.findOneById(user.roleId);
  }
}

// export default {
//   User: {
//     role: parent => parent.role || Role.findOneById(parent.roleId),
//     messages: parent =>
//       parent.messages || Message.find({ where: { userId: parent.id } })
//   },
//   Query: {
//     users: () => User.find(),
//     user: (parent, { id }) => User.findOneById(id),
//     currentUser: (parent, args, { user }) => user
//   },
//   Mutation: {
//     signup: async (parent, args, { pubsub }) => {
//       const user = await User.create(args);
//       const errors = await user.validate();
//       if (errors) {
//         throw new SignupError({ data: errors });
//       }
//       try {
//         await user.save();
//       } catch (err) {
//         if (err instanceof UniqueKeyError) {
//           throw new SignupError(err);
//         }
//         throw err;
//       }
//       pubsub.publish('userAdded', { userAdded: user });
//       return { token: user.generateToken(), user };
//     },
//     login: async (parent, { email, password }) => {
//       const user = await User.findOne({ where: { email } });
//       if (!user) {
//         throw new LoginError({
//           data: { email: 'No user exists with that email' }
//         });
//       }
//       if (!await user.authenticate(password)) {
//         throw new LoginError({
//           data: { password: 'Password is incorrect' }
//         });
//       }
//       return { token: user.generateToken(), user };
//     }
//   },
//   Subscription: {
//     userAdded: {
//       subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator('userAdded')
//     }
//   }
// };
