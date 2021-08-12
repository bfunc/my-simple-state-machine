import { get } from 'underscore.get';
import { delimiter, statesProp } from './config.js';

export const getPathChunks = str => str.split(delimiter);

export const buildDefinitionPath = str => {
  const chunks = getPathChunks(str);
  return chunks.flatMap(chunk => [statesProp, chunk]).join('.');
};

export const resolveState = (definition = {}, path = '') => {
  const definitionPath = buildDefinitionPath(path);
  return get(definition, definitionPath);
};

export const printCurrentState = ({ value }) =>
  console.log(`current state: ${value}`);

export const getStateByEvent = (currentStateDefinition, event) =>
  Object.values(currentStateDefinition.states).find(({ on = {} }) => on[event]);

// TODO - add to log
export const getStateName = (definition = {}, transition = '') =>
  Object.values(definition.states).find(({ on }) => on[transition]);
