const NEW_MESSAGE = "NEW_MESSAGE";

const models = require("../models");
const fs = require("fs");
const np = require("path");

const storeFS = ({ stream, filename }) => {
  const uploadDir = np.join(__dirname + `../../../photos`);
  const path = np.join(`${uploadDir}/${filename}`);
  console.log({ uploadDir, path });

  return new Promise((resolve, reject) =>
    stream
      .on("error", (error) => {
        if (stream.truncated) fs.unlinkSync(path);
        reject(error);
      })
      .pipe(fs.createWriteStream(path))
      .on("error", (error) => reject(error))
      .on("finish", () => resolve({ path }))
  );
};

module.exports = resolvers = {
  Query: {
    users: async () => {
      try {
        const users = await models.user.find();
        return users;
      } catch (error) {
        throw error;
      }
    },
    userById: async (_, args) => {
      try {
        const user = await models.user.findById(args.userId);
        return user;
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    register: async (_, { userInfo: { firstName, lastName } }, { pubsub }) => {
      try {
        const user = new models.user({
          firstName,
          lastName,
        });
        const newUser = await user.save();
        return newUser;
      } catch (err) {
        throw err;
      }
    },
    singleUpload: async (parent, args) => {
      console.log({ x: args.file });

      const { filename, mimetype, createReadStream } = await args.file;
      // console.log({ f: args.file });

      const stream = createReadStream();
      const pathObj = await storeFS({ stream, filename });
      const fileLocation = pathObj.path;
      const photo = await models
        .photo({
          filename,
          fileLocation,
        })
        .save();
      console.log({ photo });

      return photo;
    },
    sendMessage: async (
      parent,
      { messageInfo: { content, sender } },
      { pubsub }
    ) => {
      const message = await models
        .message({
          content,
          sender,
        })
        .save();

      const newMessage = await models.message
        .findById(message)
        .populate("sender");
      pubsub.publish(NEW_MESSAGE, {
        newMessage: newMessage,
      });

      // console.log({newMessage});

      return newMessage;
    },
  },
  Subscription: {
    newMessage: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(NEW_MESSAGE),
    },
  },
};
