import { TimestampInterface } from './Common';

enum MessageStatusEnum {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
}

interface MessageInterface {
  id: string;

  receiverId: string;
  message: string;
  status: MessageStatusEnum;
}

enum NetworkInterface {
  MAINNET = 'MAINNET',
  DEVNET = 'DEVNET',
  TESTNET = 'TESTNET',
}

enum MessageTypeEnum {
  CONTENT = 'CONTENT',
  INTERACTION = 'INTERACTION',
}

enum ContentTypeEnum {
  POST = 'POST',
  REEL = 'REEL',
  STORY = 'STORY',
  COMMENT = 'COMMENT',
  REPLY = 'REPLY',
  PRIVATE_MESSAGE = 'PRIVATE_MESSAGE',
}

enum ContentFormatTypeEnum {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  LINK = 'LINK',
  EMBED = 'EMBED',
  FILE = 'FILE',
}

enum InteractionTypeEnum {
  LIKE = 'LIKE',
  RESHARE = 'RESHARE',
  FOLLOW = 'FOLLOW',
  UNFOLLOW = 'UNFOLLOW',
  BOOKMARK = 'BOOKMARK',
}

interface ContentInterface {
  // id and authorId - primarily needed to support embeds
  // id and authorId = same as outside message.id and message.authorId for original message creation
  // If ContentFormatType = Text, then url = '' & text = 'content'
  // If ContentFormatType = Any Other, then url = 'link' & text = 'content'
  id: string;
  authorId: string;
  text: string;
  url: string;
  hash: string | Uint16Array; // Assuming base64-encoded string representation of Message.hash or raw Uint16Array;
}

interface TargetContentInterface {
  id: string;
  url: string;
  authorId: string;
  hash: string | Uint16Array; // Assuming base64-encoded string representation of Message.hash or raw Uint16Array;
}

enum CRUDActionTypeEnum {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

interface MessageData {
  id: string;
  timeStamp: TimestampInterface;
  authorId: string;
  // Message type - CONTENT | INTERACTION
  messageType: MessageTypeEnum;

  // Message type = CONTENT
  contentActionType: CRUDActionTypeEnum;
  contentType: ContentTypeEnum;
  contentFormatType: ContentFormatTypeEnum;
  content: ContentInterface[];
  mentions: string[]; // User Ids mentioned in the message
  hashtags: string[]; // Hashtags used in the message
  locationTags: string[]; // Location of the message

  // If Message type = CONTENT | REPLY, then targetContent is the parent post
  // Otherwise Message type = INTERACTION - LIKE | RESHARE | FOLLOW | UNFOLLOW | BOOKMARK
  interactionActionType: CRUDActionTypeEnum;
  interactionType: InteractionTypeEnum;
  targetContent: TargetContentInterface;

  // Network Details
  network: NetworkInterface;

  //   UserNameProofBody proof_body = 8;
  //   VerificationAddEthAddressBody verification_add_eth_address_body = 9;
  //   VerificationRemoveBody verification_remove_body = 10;
  //   UserDataBody user_data_body = 12;
  //   LinkBody link_body = 14;
  //   UserNameProof username_proof_body = 15;
}
