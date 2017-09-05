import { ModelNodeAttribute } from './../../interfaces/model/index';
/**
 * Removes the extra information from the node attributes.
 *
 * @param {ModelNodeAttribute} attr
 * @returns {ModelNodeAttribute}
 */
export function cleanAttribute(attr: ModelNodeAttribute): ModelNodeAttribute {
  delete attr.dataType;
  delete attr.required;
  return attr;
}
