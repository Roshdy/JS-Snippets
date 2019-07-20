/**
 * ModelService.js
 */

module.exports = {
  /**
   * return true if the structures don't match || values don't match types
   * 
   * * Schema boilerplate:
   *  - Array Schema
   *  ```
   *  schema = {
   *      type: 'array',
   *      item: {
   *        type: 'object',
   *        struct: {
   *          field: 'fieldType',
   *          ...
   *        },
   *      },
   *  };
   *  ```
   * 
   *  -  Object Schema
   *  ```
   *  schema = {
   *       type: 'object',
   *       struct: {
   *         field: 'fieldType',
   *         ...
   *       },
   *  };
   *  ```
   * 
   * @param {Object} schema schema definition
   * @param {Object} input input json object
   */
  invalidStructure(schema, input) {
    try {
      if (schema.type === 'array') {
        // Invalid: if input is not array
        //  OR some of input[items] doesn't match schema.item
        return !_.isArray(input) ||
          _.some(input, item => this.invalidStructure(schema.item, item));
      }
      else if (schema.type === 'object') {
        // Invalid if input is not an object
        //  OR if input.keys doesn't match schema.struct.keys
        //  OR if typeof input[key] doesn't match schema.struct[key]
        return !_.isObjectLike(input) ||
          !_.isEqual(_.keys(schema.struct), _.keys(input)) ||
          _.some(_.keys(input), key => this.invalidStructure(schema.struct[key], input[key]));
      }
      else { // verifying field value vs schema.type
        // TODO: Add other field validations here (i.e. isEmail, required,...etc.)
        return typeof input !== schema.type;
      }
    }
    catch (err) {
      sails.log.error('Exception in [invalidStructure] : ', err);
      return true;
    }
  },
};