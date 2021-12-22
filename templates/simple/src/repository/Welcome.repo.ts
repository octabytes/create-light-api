import { Service as AutoInjection } from "typedi";
import WelcomeEntity from "./entity/Welcome.entity";

interface IWelcomeRepo {
  getText(): WelcomeEntity;
}

@AutoInjection()
class WelcomeRepo implements IWelcomeRepo {
  getText(): WelcomeEntity {
    const welcomeEntity = new WelcomeEntity();
    welcomeEntity.text = "text from repository";

    return welcomeEntity;
  }
}

export default WelcomeRepo;
