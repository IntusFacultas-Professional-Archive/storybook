/**
 * @function handleArrayPropType
 * @param {Object} propData
 * @returns {String} the appropriate prop type
 * Since prop types can be an array of types, we need to select either the type that matches the provided
 * default or select the first one since we can't support all of them at once.
 */
const handleArrayPropType = (propData) => (
  typeof propData.default !== 'undefined' ? typeof propData.default : propData.type[0].name.toLowerCase()
);

/**
 * @function propGenerator
 * @param {VueComponentConstructor} component
 * @param {Object} descriptions
 * @returns {Object} all props from the mixins which can then be object spread into the default argTypes
 * Storybook struggles with finding the props for mixins that aren't colocated with the Vue component, so
 * we can include them back into the controls panel by using this in the default story.
 */
export const propGenerator = (component, descriptions = {}) => (
  (component?.mixins ?? []).map((mixin) => (Object.entries(mixin?.props ?? {}).map(
    ([propName, propData]) => (
      [
        propName,
        {
          control: {
            type: Array.isArray(propData.type) ? handleArrayPropType(propData) : propData.type.name.toLowerCase(),
            default: propData?.default ?? null,
            required: propData.required ?? false,
          },
          description: descriptions?.[propName] ?? `Override the description of this auto-included prop with 
            \`{ ${propName}: 'Custom description here', ... }\` as the second argument of propGenerator in 
            your default story`,
        },
      ]
    ),
  ))).reduce((acc, cur) => {
    cur.forEach(([propName, propData]) => { acc[propName] = propData; });
    return acc;
  }, {}));

export default propGenerator;
