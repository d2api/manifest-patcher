import _ from "lodash";

/**
 * accepts a list of fixes, in the format `[path, value]`, i.e.
 * ```
 * [
 *   'DestinyInventoryItemDefinition.2575506895.displayProperties.name',
 *   'More Like, Claws of the Missing Impact Stat'
 * ]
 * ```
 */
export function applyPatchList(
  objectToPatch: any,
  patches: [string, string][]
) {
  for (const [path, value] of patches) {
    _.setWith(objectToPatch, path, value, hashStringSetter);
  }
}

/**
 * accepts fixes as an object formatted like the manifest,
 * but missing any properties that don't need changing
 * ```
 * {
 *   DestinyInventoryItemDefinition: {
 *     2575506895: {
 *       displayProperties: {
 *         name: "More Like, Claws of the Missing Impact Stat"
 * }}}}
 * ```
 */
export function applyPatchObject(objectToPatch: any, patchObject: any) {
  traverseObject(patchObject, (value, path) => {
    _.setWith(objectToPatch, path, value, hashStringSetter);
  });
}

// this tells lodash that an item stored under the hash key 2575506895,
// does not mean it's the 2575506896th element in an array
function hashStringSetter(value: any, keyLeadingToThisValue: string) {
  if (
    keyLeadingToThisValue.startsWith("Destiny") &&
    keyLeadingToThisValue.endsWith("Definition")
  ) {
    return Object(value);
  }
}

/**
 * explores an object recursively, checking each key of arrays or objects.
 * if it finds something that isn't an object/array, it runs a function on that thing
 *
 * @param apply this function is run on found values. it's provided the value,
 * and the path it takes to get there from the root object
 */
export function traverseObject(
  obj: any,
  apply: (value: any, path: string[]) => void,
  path: string[] = []
) {
  if (typeof obj === "object") {
    for (const propertyName in obj) {
      traverseObject(obj[propertyName], apply, [...path, propertyName]);
    }
  } else {
    apply(obj, path);
  }
}
