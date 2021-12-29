export const InParams = () => {
  return (target: any, propertyKey: string) => {
    if (!target.__inParamList) {
      target.__inParamList = [];
    }

    target.__inParamList.push(propertyKey);
    let original = target.__inParamList;

    target.__inParams = target.__inParamList;

    Object.defineProperty(target, "__inParams", {
      get: () => original,
      set: (newVal) => newVal,
    });
  };
};
