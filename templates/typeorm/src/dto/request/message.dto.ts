import { IsNotEmpty } from "class-validator";

/**
 * @openapi
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         text:
 *           type: string
 *           description: Message text.
 */
class MessageDTO {
  @IsNotEmpty()
  text: string;
}

export default MessageDTO;
