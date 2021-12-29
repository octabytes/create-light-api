import { Service as AutoInjection } from "typedi";
import MessageDTO from "../dto/request/Message.dto";
import WelcomeDTO from "../dto/response/Welcome.dto";
import WelcomeRepo from "../repository/Welcome.repo";

export interface IWelcomeService {
  hello(): WelcomeDTO;
  saySomething(message: MessageDTO): WelcomeDTO;
  helloFromRepo(): WelcomeDTO;
  reply(message: MessageDTO): WelcomeDTO;
  errorTest(): string;
  asyncErrorTest(): Promise<void>;
}

@AutoInjection()
export class WelcomeService implements IWelcomeService {
  public constructor(private readonly welcomeRepo: WelcomeRepo) {}

  errorTest(): string {
    throw new Error("Error Test");
  }

  asyncErrorTest(): Promise<void> {
    throw new Error("Async Error test");
  }

  reply(message: MessageDTO): WelcomeDTO {
    const welcome = new WelcomeDTO();
    welcome.message = message.text;

    return welcome;
  }

  helloFromRepo(): WelcomeDTO {
    const repoText = this.welcomeRepo.getText();
    const welcome: WelcomeDTO = new WelcomeDTO();
    welcome.message = repoText.text;

    return welcome;
  }

  saySomething(message: MessageDTO): WelcomeDTO {
    const welcome: WelcomeDTO = new WelcomeDTO();
    welcome.message = message.text;

    return welcome;
  }

  hello(): WelcomeDTO {
    const welcome: WelcomeDTO = new WelcomeDTO();
    welcome.message = "Hello world!";

    return welcome;
  }
}
