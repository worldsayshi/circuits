import defaultNounResolver from './default';

export function getNounResolvers() {
  return {
    default: defaultNounResolver.getNoun,
  };
}
