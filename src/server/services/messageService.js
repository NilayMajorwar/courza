// @flow
import { Message } from '../models';
import { NotFoundError } from '../utils/errors';

export default class MessageService {
  /**
   * Creates new message object
   *
   * @param {Object} data Object containing authorId, body chatId
   * @returns {Message} Newly created message object
   */
  static async create(data: {
    authorId: string,
    body: string,
    chatId: string
  }): Message {
    const message = new Message(data);
    await message.save();
    return message;
  }

  /**
   * Finds and returns a Message object by its _id.
   *
   * @param {string} messageId ID of the message
   * @returns {Message} Message object
   */
  static async get(messageId: string): Message {
    const message = await Message.findById(messageId);
    if (!message) throw new NotFoundError('Message does not exist.');
    return message;
  }

  /**
   * Upvotes a message
   *
   * @param {Message} message Message to upvote
   * @returns {Message} Updated Message object
   */
  static async upvote(message: Message): Message {
    message.votes++;
    await message.save();
    return message;
  }
}
