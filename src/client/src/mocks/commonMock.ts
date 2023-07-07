export const mockChangeEvent = (
  newValue: string | number
): React.ChangeEvent<HTMLInputElement> => {
  return {
    target: {
      value: newValue,
      name: '',
      validity: { valid: true },
      checked: false,
    },
  } as React.ChangeEvent<HTMLInputElement>;
};

export const mockMouseEvent = (
  targetId: string,
  attributes?: { [key: string]: string }
): React.MouseEvent<HTMLElement, MouseEvent> => {
  return {
    currentTarget: {
      id: targetId,
      getAttribute: (key: string) => (attributes ? attributes[key] : null),
    } as HTMLSpanElement,
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
  } as any;
};

export const mockUseTranslation = () => ({ t: (key: string) => key, i18n: {} });
