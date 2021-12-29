import { IsNotEmpty } from "class-validator";
import { InParams } from "../../utils/Decorators";

class ParamMessageDTO {
  @InParams()
  @IsNotEmpty()
  name: string;
}

export default ParamMessageDTO;
